const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, 'icons.db');
        this.db = null;
    }

    // Inicializar la base de datos
    async init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error al conectar con la base de datos:', err);
                    reject(err);
                } else {
                    console.log('Conectado a la base de datos SQLite');
                    this.createTables()
                        .then(() => resolve())
                        .catch(reject);
                }
            });
        });
    }

    // Crear tablas necesarias
    async createTables() {
        const createIconsTable = `
            CREATE TABLE IF NOT EXISTS icons (
                id TEXT PRIMARY KEY,
                url TEXT NOT NULL,
                title TEXT,
                iconStyle TEXT NOT NULL,
                iconSvg TEXT NOT NULL,
                userId TEXT NOT NULL DEFAULT 'anonymous',
                createdAt TEXT NOT NULL,
                updatedAt TEXT,
                clickCount INTEGER DEFAULT 0
            )
        `;

        const createStatsTable = `
            CREATE TABLE IF NOT EXISTS stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                totalIcons INTEGER DEFAULT 0,
                totalClicks INTEGER DEFAULT 0,
                lastUpdated TEXT NOT NULL
            )
        `;

        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(createIconsTable, (err) => {
                    if (err) {
                        console.error('Error al crear tabla icons:', err);
                        reject(err);
                        return;
                    }
                });

                this.db.run(createStatsTable, (err) => {
                    if (err) {
                        console.error('Error al crear tabla stats:', err);
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    // Guardar un nuevo icono
    async saveIcon(iconData) {
        const query = `
            INSERT INTO icons (id, url, title, iconStyle, iconSvg, userId, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            this.db.run(query, [
                iconData.id,
                iconData.url,
                iconData.title,
                iconData.iconStyle,
                iconData.iconSvg,
                iconData.userId,
                iconData.createdAt
            ], function(err) {
                if (err) {
                    console.error('Error al guardar icono:', err);
                    reject(err);
                } else {
                    resolve(iconData);
                }
            });
        });
    }

    // Obtener iconos por usuario
    async getIconsByUser(userId) {
        const query = `
            SELECT * FROM icons 
            WHERE userId = ? 
            ORDER BY createdAt DESC
        `;

        return new Promise((resolve, reject) => {
            this.db.all(query, [userId], (err, rows) => {
                if (err) {
                    console.error('Error al obtener iconos:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Obtener icono por ID
    async getIconById(id) {
        const query = `SELECT * FROM icons WHERE id = ?`;

        return new Promise((resolve, reject) => {
            this.db.get(query, [id], (err, row) => {
                if (err) {
                    console.error('Error al obtener icono por ID:', err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Actualizar un icono
    async updateIcon(id, updateData) {
        const query = `
            UPDATE icons 
            SET url = ?, title = ?, iconStyle = ?, iconSvg = ?, updatedAt = ?
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            this.db.run(query, [
                updateData.url,
                updateData.title,
                updateData.iconStyle,
                updateData.iconSvg,
                updateData.updatedAt,
                id
            ], function(err) {
                if (err) {
                    console.error('Error al actualizar icono:', err);
                    reject(err);
                } else if (this.changes === 0) {
                    resolve(null); // No se encontró el icono
                } else {
                    resolve({ id, ...updateData });
                }
            });
        });
    }

    // Eliminar un icono
    async deleteIcon(id) {
        const query = `DELETE FROM icons WHERE id = ?`;

        return new Promise((resolve, reject) => {
            this.db.run(query, [id], function(err) {
                if (err) {
                    console.error('Error al eliminar icono:', err);
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    // Incrementar contador de clics
    async incrementClickCount(id) {
        const query = `
            UPDATE icons 
            SET clickCount = clickCount + 1
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            this.db.run(query, [id], function(err) {
                if (err) {
                    console.error('Error al incrementar clics:', err);
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    // Obtener estadísticas
    async getStats(userId) {
        const iconCountQuery = `SELECT COUNT(*) as totalIcons FROM icons WHERE userId = ?`;
        const clickCountQuery = `SELECT SUM(clickCount) as totalClicks FROM icons WHERE userId = ?`;
        const recentIconsQuery = `
            SELECT COUNT(*) as recentIcons 
            FROM icons 
            WHERE userId = ? AND createdAt > datetime('now', '-7 days')
        `;

        return new Promise((resolve, reject) => {
            const stats = {};

            this.db.get(iconCountQuery, [userId], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                stats.totalIcons = row.totalIcons;

                this.db.get(clickCountQuery, [userId], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    stats.totalClicks = row.totalClicks || 0;

                    this.db.get(recentIconsQuery, [userId], (err, row) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        stats.recentIcons = row.recentIcons;
                        stats.lastUpdated = new Date().toISOString();
                        resolve(stats);
                    });
                });
            });
        });
    }

    // Cerrar conexión
    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error al cerrar la base de datos:', err);
                } else {
                    console.log('Conexión de base de datos cerrada');
                }
            });
        }
    }
}

module.exports = Database;
