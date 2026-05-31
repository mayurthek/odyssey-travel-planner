# Odyssey — Minimalist Interactive Travel Planner

Odyssey is a visual travel planning platform built with React, TypeScript, and Tailwind CSS v4. It features desaturated aesthetics, typography hierarchies, and generous structural layouts inspired by the interfaces of **Linear × Notion × Airbnb × Apple Maps**.

---

## 🌟 Core Product Features

1. **Dual Perspective Visual Planning**:
   - **Map View**: Integrated Leaflet + OpenStreetMap canvas using a custom desaturated CartoDB Positron theme. Activity index pins are rendered as sleek custom div-icon numbers.
   - **Board View**: A side-by-side Kanban-style itinerary overview displaying daily timelines with high-quality card layouts, category labels, activity thumbnails, and direct inline details.
2. **Seamless HTML5 Drag-and-Drop**:
   - drag activity cards within timeline tracks to reorder timings, or drag across columns to shift plans between days.
3. **Comprehensive Budget Calculator**:
   - live horizontal cost gauge separating Stay, Dining, Transit, and Sightseeing ratios, backed by fine-grained slider controllers.
4. **Editorial Weather Integration**:
   - dynamic current temps, humidity indicators, wind speeds, air quality ratings, and 5-day horizontal outlooks using the Open-Meteo API.
5. **Debounced Destination Autocomplete**:
   - geocodes query inputs using OpenStreetMap Nominatim, centering map viewports and populating dynamic category cards instantly.
6. **A4 Vector PDF Document Exporter**:
   - print-friendly CSS selectors formatting summaries into structured print sheets, supporting native browser print PDF conversions and mock sharing links.

---

## 🛠️ Technology Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/) (SPA mode)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS
- **Mapping**: [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **APIs** (API-Key Free & Zero Billing Setup):
  - Geocoding: [OSM Nominatim Geocoder](https://nominatim.org/)
  - Forecasts: [Open-Meteo Weather API](https://open-meteo.com/)
  - Map Tiles: [CartoDB Positron Server](https://carto.com/basemaps/)

---

## 📂 Folder Structure

```text
travel-planner/
├── tsconfig.json                # Project TypeScript rules
├── tsconfig.app.json            # Strict-lint relaxed compilation
├── postcss.config.js            # PostCSS processing (using Tailwind v4 syntax)
├── tailwind.config.js           # Design tokens (warm sand/neutral stone palettes)
├── index.html                   # Load links for Google Fonts & Leaflet
├── src/
│   ├── main.tsx                 # Base DOM mounter
│   ├── App.tsx                  # Master providers wrapper
│   ├── index.css                # Global scrollbar overlays & Leaflet styles
│   ├── types/
│   │   └── index.ts             # Typings for Activities, Weather, & Budgets
│   ├── services/
│   │   └── attraction-service.ts# Paris/Tokyo/London databases & fallback generator
│   ├── hooks/
│   │   ├── trip-context.tsx     # Central State Machine (timeline moves, budgets)
│   │   ├── use-geocoding.ts     # Debounced OSM Nominatim lookup (API-key free)
│   │   └── use-weather.ts       # Open-Meteo current temp & WMO descriptions
│   └── components/
│       ├── MainLayout.tsx       # Grid alignments & responsive sheets selector
│       ├── LeafletMap.tsx       # Live Map with div-icons & MapController pan/zooms
│       ├── SearchPanel.tsx      # Explore category feeds, bookmarks & city input
│       ├── ItineraryBuilder.tsx # Timelines sidebar organizer with schedule edits
│       ├── ItineraryBoard.tsx   # Visual side-by-side daily columns with Drag-and-Drop
│       ├── BudgetCalculator.tsx # Segmented expenses sliders & visual progress charts
│       ├── WeatherPanel.tsx     # 5-day forecast grid & condition indicators
│       ├── SummaryDashboard.tsx # Printable A4 sheet, copy links & native PDFs
│       └── ui/
│           ├── button.tsx       # Minimal premium buttons
│           ├── slider.tsx       # Active background range track sliders
│           ├── tabs.tsx         # Underscore & Pill toggle controllers
│           ├── modal.tsx        # Dismissible escape-bound modal overlays
│           └── toast.tsx        # Success/Warning dismissible Toast popups
```

---

## 🚀 Getting Started

### 1. Prerequisites

Verify that you have [Node.js](https://nodejs.org/) installed locally:
```bash
node -v
```

### 2. Installation

Clone the repository and install all baseline and dev dependencies using standard package parameters:
```bash
# Install dependencies
npm install --legacy-peer-deps
```

### 3. Running Locally

Fire up the hot-reloaded Vite development server:
```bash
npm run dev
```

Navigate to `http://localhost:5173/` in your browser.

### 4. Compiling Production Build

Verify type safety and compile into optimized static files suitable for deployment:
```bash
npm run build
```
The compiled output will be generated inside the `/dist` directory.

---

## 🧪 Operational Checklists

To inspect the system's dynamic data integration:
1. **Search Querying**: Input "Tokyo", "Paris", or "London" to load preloaded databases and matching Unsplash photos. Type any other global city (e.g. "Sydney", "Rome") to geocode, center, and dynamically generate custom offset fallback landmarks.
2. **Scheduling**: Click `Add to Itinerary` to place attractions on timelines. Drag cards on the timeline or Kanban columns to rearrange spots or move plans between days.
3. **Budget HUD**: Select different Accommodation prices, Dining Plans, or Transit Modes. Ratios will redistribute inside the segmented summary block in real-time.
4. **Summary**: Tap `Trip Summary` to view the comprehensive itinerary layout. Trigger `Print / Save as PDF` to generate a vector PDF output matching standard paper parameters.
