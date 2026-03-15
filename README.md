# ygo-sales (frontend)

SPA en React que muestra una tabla de ítems de venta a partir de un JSON local. Incluye búsqueda por nombre, orden por columnas y paginación en memoria.

## Requisitos

- Node.js (v18 o superior recomendado)
- npm

## Instalación

```bash
npm install
```

O con Make:

```bash
make install
```

## Ejecutar en local

El servidor de desarrollo se levanta en el puerto **3000**:

```bash
npm run dev
```

O:

```bash
make run
```

Abre [http://localhost:3000](http://localhost:3000). Si en `vite.config.ts` tienes `base: '/Yugi-Sales/'`, la ruta local será [http://localhost:3000/Yugi-Sales/](http://localhost:3000/Yugi-Sales/).

## Build para producción

Genera el bundle en la carpeta `dist/`:

```bash
npm run build
```

O:

```bash
make build
```

Para previsualizar el build en local:

```bash
npm run preview
make preview
```

## Desplegar en GitHub Pages

1. **Base URL**: En `vite.config.ts` está configurado `base: '/Yugi-Sales/'` para que las rutas funcionen en `https://<usuario>.github.io/Yugi-Sales/`. Si el repo tiene otro nombre o se publica en una subcarpeta, cambia `base` (por ejemplo `base: '/ygo-sales-frontend/'`).

2. **Publicar el build**:
   - Opción A – **Deploy from a branch**: Crea una rama `gh-pages`, haz build, copia el contenido de `dist/` a la raíz de esa rama (o a una carpeta `docs` si configuras Pages desde `/docs`). El `base` debe coincidir con la URL del sitio.
   - Opción B – **GitHub Actions**: Crea un workflow que ejecute `npm ci && npm run build` y suba el contenido de `dist/` con alguna acción (p. ej. `peaceiris/actions-gh-pages`). La acción suele publicar en la rama `gh-pages` o en la carpeta de Pages.

3. En el repositorio: **Settings → Pages → Source**: elige la rama/carpeta donde quedó el contenido estático.

## Estructura del proyecto

- `src/components/` – Componentes reutilizables (Navbar, SearchBar, ItemsTable).
- `src/pages/` – Páginas (por ahora solo HomePage).
- `src/data/` – Carga y tipo del JSON de ítems.
- `resources/15_03_2026_db.json` – Datos de la tabla (nombre, rareza, cantidad, precio).

## Tecnologías

- React 18 + TypeScript
- Vite
- TanStack Table (filtro global, orden, paginación)
- Tailwind CSS
