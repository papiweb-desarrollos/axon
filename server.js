const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Database = require('./database/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"]
        }
    }
}));

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana de tiempo
    message: {
        error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
    }
});
app.use('/api/', limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar base de datos
const db = new Database();

// Rutas de la API

// Obtener todos los iconos del usuario
app.get('/api/icons', async (req, res) => {
    try {
        const { userId } = req.query;
        const icons = await db.getIconsByUser(userId || 'anonymous');
        res.json({
            success: true,
            icons: icons
        });
    } catch (error) {
        console.error('Error al obtener iconos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Guardar un nuevo icono
app.post('/api/icons', async (req, res) => {
    try {
        const { url, title, iconStyle, iconSvg, userId } = req.body;

        // Validaciones
        if (!url || !iconStyle || !iconSvg) {
            return res.status(400).json({
                success: false,
                error: 'URL, estilo de icono y SVG son requeridos'
            });
        }

        // Validar formato de URL
        try {
            new URL(url);
        } catch (urlError) {
            return res.status(400).json({
                success: false,
                error: 'URL no válida'
            });
        }

        const iconData = {
            id: uuidv4(),
            url: url,
            title: title || '',
            iconStyle: iconStyle,
            iconSvg: iconSvg,
            userId: userId || 'anonymous',
            createdAt: new Date().toISOString()
        };

        const result = await db.saveIcon(iconData);
        
        res.json({
            success: true,
            icon: result,
            message: 'Icono guardado exitosamente'
        });
    } catch (error) {
        console.error('Error al guardar icono:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener un icono específico
app.get('/api/icons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const icon = await db.getIconById(id);
        
        if (!icon) {
            return res.status(404).json({
                success: false,
                error: 'Icono no encontrado'
            });
        }

        res.json({
            success: true,
            icon: icon
        });
    } catch (error) {
        console.error('Error al obtener icono:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Actualizar un icono
app.put('/api/icons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { url, title, iconStyle, iconSvg } = req.body;

        const updateData = {
            url: url,
            title: title || '',
            iconStyle: iconStyle,
            iconSvg: iconSvg,
            updatedAt: new Date().toISOString()
        };

        const result = await db.updateIcon(id, updateData);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Icono no encontrado'
            });
        }

        res.json({
            success: true,
            icon: result,
            message: 'Icono actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar icono:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Eliminar un icono
app.delete('/api/icons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.deleteIcon(id);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Icono no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Icono eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar icono:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Ruta para obtener estadísticas
app.get('/api/stats', async (req, res) => {
    try {
        const { userId } = req.query;
        const stats = await db.getStats(userId || 'anonymous');
        
        res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'axon.html'));
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
    });
});

// Manejo global de errores
app.use((error, req, res, next) => {
    console.error('Error no capturado:', error);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

// Inicializar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📱 Frontend disponible en: http://localhost:${PORT}`);
    console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
    
    // Inicializar base de datos
    try {
        await db.init();
        console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar base de datos:', error);
    }
});

module.exports = app;
