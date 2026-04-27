# 🗺️ Indoor Campus Navigation System

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Build](https://img.shields.io/badge/Build-Production-green)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A **production-ready** React web application for indoor navigation within a campus building. Features real floor map visualization, Dijkstra's algorithm pathfinding, multi-floor navigation with automatic floor switching, and smooth path animations.

🚀 **[Live Demo](https://your-deployment-url.com)** | 📖 **[Deployment Guide](DEPLOYMENT.md)**

## Features

### Core Functionality
- **Location Selection**: Dropdown menus for selecting current location and destination
- **Pathfinding**: Uses Dijkstra's algorithm to calculate the shortest path
- **Multi-Floor Support**: Navigate between 3rd and 4th floors using stairs and lifts
- **Real-time Animation**: Smooth animated dot movement along the calculated path

### Map Visualization
- **Interactive Floor Maps**: Visual representation of building floors with color-coded backgrounds
- **Node Overlay**: Different node types (rooms, corridors, stairs, lifts, entrances) with distinct colors
- **Path Highlighting**: Dashed orange line showing the calculated route
- **Grid System**: Background grid for better spatial understanding

### User Interface
- **Modern Design**: Clean, responsive UI with gradient backgrounds
- **Floor Switcher**: Easy switching between floor views
- **Step-by-Step Directions**: Text-based navigation instructions
- **Legend**: Visual guide for understanding node types
- **Distance Display**: Shows total path distance in units

## Project Structure

```
src/
├── components/
│   ├── Navigation.js    # Main navigation component with controls
│   ├── Map.js          # Map visualization with canvas rendering
│   └── Animation.js    # Path animation component
├── graph/
│   └── graph.js        # Graph data structure and Dijkstra algorithm
├── data/
│   └── campusData.js   # Sample campus data (nodes and edges)
├── App.js              # Main application component
├── App.css             # Global styles
└── index.js            # Application entry point
```

## Technical Implementation

### Graph Algorithm
The application uses a custom graph implementation with:
- **Nodes**: Contain coordinates (x, y), floor number, type, and name
- **Edges**: Weighted connections between nodes
- **Dijkstra's Algorithm**: Finds the shortest path between any two nodes

### Animation System
- **RequestAnimationFrame**: Smooth 60fps animation
- **Linear Interpolation**: Calculates intermediate positions between nodes
- **Floor Detection**: Only animates segments on the currently viewed floor
- **Visual Effects**: Gradient fills and shadows for the moving dot

### Multi-Floor Logic
- **Transition Nodes**: Special nodes (stairs, lifts) that connect floors
- **Floor Switching**: Automatic floor switching during navigation
- **Path Segmentation**: Handles paths that span multiple floors

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Local Development
```bash
# Clone repository
git clone <your-repo-url>
cd indoor-campus-navigation

# Install dependencies
npm install

# Start development server
npm start
```
App runs at: `http://localhost:3000`

### Production Deployment

**Option 1: Netlify (Recommended)**
```bash
npm run build
# Drag 'build' folder to netlify.com
```

**Option 2: Vercel**
```bash
npm install -g vercel
vercel --prod
```

📖 **[Complete Deployment Guide](DEPLOYMENT.md)**

## Project Structure

```
indoor-campus-navigation/
├── public/                    # Static assets
│   ├── images/               # Floor map images
│   ├── floor-3rd.svg        # 3rd floor blueprint
│   └── floor-4th.svg        # 4th floor blueprint
├── src/
│   ├── components/          # React components
│   │   ├── Navigation.js    # Main navigation UI
│   │   ├── ImageMap.js      # SVG map visualization
│   │   ├── Map.js           # Canvas-based map
│   │   └── Animation.js     # Path animation engine
│   ├── graph/
│   │   └── graph.js         # Dijkstra algorithm
│   ├── data/
│   │   └── campusData.js    # Campus building data
│   ├── App.js               # Root component
│   ├── App.css              # Global styles
│   └── index.js             # Entry point
├── build/                    # Production build
├── netlify.toml             # Netlify config
├── vercel.json              # Vercel config
├── .env.example             # Environment template
├── package.json             # Dependencies & scripts
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file

## Usage Instructions

1. **Select Locations**: Choose your starting point and destination from the dropdown menus
2. **Navigate**: Click the "Navigate" button to calculate and display the path
3. **View Animation**: Watch the animated dot follow the calculated route
4. **Switch Floors**: Use floor buttons to view different floors during navigation
5. **Follow Directions**: Read step-by-step instructions in the side panel

## Sample Data

The application includes sample data for:
- **3rd Floor**: Rooms B301-B302, C301-C302, CAB301-CAB302
- **4th Floor**: Rooms B401-B402, C401-C402, CAB401-CAB402
- **Connections**: Corridors, stairs, and lifts linking all locations

## Customization

### Adding New Floors
1. Add nodes in `campusData.js` with new floor numbers
2. Define edges connecting the new floor's nodes
3. Add transition nodes (stairs/lifts) to connect with existing floors

### Modifying Layout
- Adjust node coordinates in `campusData.js` to match your building layout
- Update canvas size in the Map component if needed
- Modify colors and styling in `App.css` and component files

### Adding Real Map Images
Replace the canvas background rendering in `Map.js` with actual floor plan images:
```javascript
// Load and draw background image
const img = new Image();
img.src = '/path/to/floor-plan.jpg';
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technologies Used

- **React 18**: Frontend framework
- **Canvas API**: Map rendering and animations
- **JavaScript ES6+**: Modern JavaScript features
- **CSS3**: Styling and animations

## Future Enhancements

- Real-time GPS integration
- Voice navigation
- 3D map visualization
- Accessibility features
- Mobile app version
- Integration with building management systems

## License

This project is open source and available under the MIT License.
