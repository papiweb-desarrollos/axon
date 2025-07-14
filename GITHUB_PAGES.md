# GitHub Pages Settings

# Configuración automática para GitHub Pages
# Este archivo ayuda a GitHub a entender la estructura del proyecto

## URL del sitio
https://papiweb-desarrollos.github.io/axon/

## Configuración
- **Fuente**: GitHub Actions
- **Rama de despliegue**: gh-pages (automática)
- **Directorio de build**: dist/
- **Archivo principal**: index.html

## Archivos importantes para GitHub Pages:
- `index.html` - Página principal (versión estática)
- `public/` - Recursos estáticos (imágenes, iconos)
- `.github/workflows/deploy.yml` - Configuración de despliegue automático

## Comandos útiles para desarrollo:

### Local (con backend):
```bash
npm install
npm run init-db
npm start
# Abrir: http://localhost:3000
```

### Desplegar a GitHub Pages:
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
# GitHub Actions despliega automáticamente
```

## Diferencias entre versiones:

### Versión local (axon.html):
- ✅ Backend Express.js completo
- ✅ Base de datos SQLite
- ✅ Almacenamiento persistente
- ✅ API REST completa
- ✅ Estadísticas detalladas

### Versión GitHub Pages (index.html):
- ✅ Interfaz completamente funcional
- ✅ Generación de iconos
- ✅ Fondo estrellado animado
- ✅ Diseño responsive
- ❌ Sin almacenamiento persistente
- ❌ Sin backend/API

## Configuración recomendada en GitHub:

1. **Settings → Pages**:
   - Source: GitHub Actions
   - No seleccionar rama específica

2. **Settings → Actions**:
   - Allow all actions and reusable workflows ✅

3. **Environment**:
   - Crear environment "github-pages" si no existe

## URLs importantes:
- **Demo live**: https://papiweb-desarrollos.github.io/axon/
- **Repositorio**: https://github.com/papiweb-desarrollos/axon
- **Issues**: https://github.com/papiweb-desarrollos/axon/issues
- **Actions**: https://github.com/papiweb-desarrollos/axon/actions
