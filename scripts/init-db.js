const Database = require('../database/database');

async function initializeDatabase() {
    console.log('🔧 Inicializando base de datos...');
    
    try {
        const db = new Database();
        await db.init();
        console.log('✅ Base de datos inicializada correctamente');
        
        // Insertar algunos datos de ejemplo (opcional)
        console.log('📝 Agregando datos de ejemplo...');
        
        const exampleIcon = {
            id: 'example-1',
            url: 'https://www.google.com',
            title: 'Google - Motor de búsqueda',
            iconStyle: 'web',
            iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>',
            userId: 'demo_user',
            createdAt: new Date().toISOString()
        };
        
        await db.saveIcon(exampleIcon);
        console.log('✅ Datos de ejemplo agregados');
        
        db.close();
        console.log('🎉 Inicialización completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase;
