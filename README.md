# Axon - Generador de Iconos Clickeables

[![Deploy to GitHub Pages](https://github.com/papiweb-desarrollos/axon/actions/workflows/deploy.yml/badge.svg)](https://github.com/papiweb-desarrollos/axon/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://papiweb-desarrollos.github.io/axon/)

## 🚀 Demo en Vivo
🔗 **[Ver Demo](https://papiweb-desarrollos.github.io/axon/)**

## 🌟 Características

- **Generador de Iconos**: Convierte URLs en iconos clickeables con diferentes estilos
- **Almacenamiento Persistente**: Guarda tus iconos en una base de datos SQLite (local)
- **API RESTful**: Backend completo con Express.js para desarrollo local
- **Estadísticas**: Visualiza métricas de uso de tus iconos
- **Interfaz Moderna**: UI responsive con fondo estrellado animado
- **GitHub Pages**: Versión estática desplegada automáticamente

## 🎨 Diseño Visual

- ✨ **Fondo azul noche** con estrellas animadas
- 🌟 **150+ estrellas** con animaciones de parpadeo realistas
- 🌌 **Efectos de nebulosa** y meteoros ocasionales
- 🔮 **Glass morphism** en contenedores
- 📱 **Responsive design** para todos los dispositivos

## 📋 Requisitos

- Node.js 16+ 
- npm o yarn

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Inicializar la base de datos:**
```bash
npm run init-db
```

3. **Iniciar el servidor:**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

4. **Abrir en el navegador:**
```
http://localhost:3000
```

## 🎯 Uso

### Interfaz Web
1. Ingresa una URL de destino
2. Opcionalmente agrega un título descriptivo
3. Selecciona un estilo de icono (Enlace, Web, Estrella, Descarga)
4. Haz clic en "Generar Icono-Enlace"
5. Guarda tu icono para usarlo más tarde

### API Endpoints

#### Obtener todos los iconos
```http
GET /api/icons?userId=user_id
```

#### Guardar un nuevo icono
```http
POST /api/icons
Content-Type: application/json

{
  "url": "https://ejemplo.com",
  "title": "Mi sitio web",
  "iconStyle": "web",
  "iconSvg": "<svg>...</svg>",
  "userId": "user_id"
}
```

#### Obtener un icono específico
```http
GET /api/icons/:id
```

#### Actualizar un icono
```http
PUT /api/icons/:id
Content-Type: application/json

{
  "url": "https://ejemplo-actualizado.com",
  "title": "Título actualizado",
  "iconStyle": "star",
  "iconSvg": "<svg>...</svg>"
}
```

#### Eliminar un icono
```http
DELETE /api/icons/:id
```

#### Obtener estadísticas
```http
GET /api/stats?userId=user_id
```

## 🏗️ Estructura del Proyecto

```
axon/
├── server.js              # Servidor principal Express
├── axon.html              # Frontend de la aplicación
├── package.json           # Dependencias y scripts
├── database/
│   ├── database.js        # Clase de manejo de base de datos
│   └── icons.db           # Base de datos SQLite (se crea automáticamente)
└── scripts/
    └── init-db.js         # Script de inicialización de BD
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` (opcional):

```env
PORT=3000
FRONTEND_URL=http://localhost:3000
NODE_ENV=production
```

### Base de Datos
El sistema usa SQLite por defecto. Los datos se almacenan en `database/icons.db`.

**Esquema de la tabla `icons`:**
- `id` (TEXT PRIMARY KEY)
- `url` (TEXT NOT NULL)
- `title` (TEXT)
- `iconStyle` (TEXT NOT NULL)
- `iconSvg` (TEXT NOT NULL)
- `userId` (TEXT NOT NULL)
- `createdAt` (TEXT NOT NULL)
- `updatedAt` (TEXT)
- `clickCount` (INTEGER DEFAULT 0)

## 🛡️ Seguridad

- **Helmet**: Configuración de headers de seguridad
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS**: Control de acceso de origen cruzado
- **Validación de URLs**: Verificación de formato de URLs

## 📊 Monitoreo

El sistema incluye:
- Conteo de iconos creados por usuario
- Estadísticas de clics (preparado para implementar)
- Métricas de iconos creados en la última semana

## 🚀 Despliegue

### Heroku
```bash
# Configurar Heroku
heroku create axon-icon-storage

# Configurar variables de entorno
heroku config:set NODE_ENV=production

# Desplegar
git push heroku main
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📝 Licencia

MIT License - ver archivo LICENSE para más detalles.

## 🐛 Reportar Problemas

Si encuentras algún problema, por favor crea un issue en el repositorio con:
- Descripción detallada del problema
- Pasos para reproducir
- Versión de Node.js y npm
- Sistema operativo

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@papiweb-desarrollos.com
- GitHub Issues: [Crear nuevo issue](https://github.com/papiweb-desarrollos/axon/issues)

---

Desarrollado con ❤️ por **Papiweb Desarrollos**
vinculos configurable
