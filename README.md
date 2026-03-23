# GestInn — Gestión de Incidencias y Mantenimiento

Aplicación web para gestionar incidencias y tareas de mantenimiento preventivo de una empresa u organización. Visual, simple y completamente funcional en el navegador sin necesidad de backend.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-5-orange)

---

## Características

- **Dashboard** — Resumen visual con tarjetas de estado, gráficos de incidencias por prioridad y mantenimientos por estado, y actividad reciente.
- **Incidencias** — Crear, editar, resolver y cerrar incidencias con prioridad, categoría, responsable, notas y seguimiento de fechas.
- **Mantenimientos preventivos** — Planificar y completar tareas de mantenimiento con frecuencia, responsable, equipo/área y detección automática de vencimientos.
- **Filtros y búsqueda** — Filtrado por estado, prioridad, responsable y rango de fechas. Búsqueda en tiempo real.
- **Modo oscuro** — Cambio de tema claro/oscuro persistente.
- **Multi-idioma** — Soporte completo en Español e Inglés.
- **Exportación** — Exporta incidencias o mantenimientos a CSV o PDF.
- **Notificaciones** — Alertas in-app para mantenimientos vencidos y cambios de estado.
- **Persistencia local** — Todos los datos se guardan en `localStorage`, sin necesidad de servidor.

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| React 18 + Vite | Frontend y bundler |
| Tailwind CSS 4 | Estilos |
| Zustand + persist | Estado global y localStorage |
| React Router v6 | Navegación |
| react-i18next | Internacionalización |
| Recharts | Gráficos |
| jsPDF + autotable | Exportación PDF |
| PapaParse | Exportación CSV |
| Lucide React | Iconos |

---

## Instalación y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/app-incidencias.git
cd app-incidencias

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```

La app estará disponible en `http://localhost:5173`.

---

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables (Layout, Sidebar, TopBar, badges, etc.)
├── pages/            # Páginas principales (Dashboard, Incidencias, Mantenimientos)
├── store/            # Stores Zustand con persistencia localStorage
├── hooks/            # Custom hooks (useOverdueCheck, useLocalStorage)
├── i18n/             # Traducciones ES/EN
└── utils/            # Constantes, helpers, exportación CSV/PDF
```

---

## Datos de prueba

Al iniciar la aplicación por primera vez, se carga un conjunto de datos de ejemplo para que puedas explorar todas las funcionalidades sin necesidad de introducir datos manualmente. Puedes borrarlos desde la propia interfaz.

---

## Licencia

MIT
