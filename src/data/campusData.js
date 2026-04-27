import { Graph } from '../graph/graph';

// Create and configure the campus graph with REAL floor map coordinates
export function createCampusGraph() {
  const graph = new Graph();

  // 3rd Floor Nodes - Based on real floor plan image (800x1000 coordinate system)
  // Top row: B303 Staff Room, B302, CAB302, Ladies Wash Room
  graph.addNode('B303_3rd', { x: 130, y: 120, floor: 3, type: 'room', name: 'B303 Staff Room' });
  graph.addNode('B302_top', { x: 280, y: 120, floor: 3, type: 'room', name: 'B302' });
  graph.addNode('CAB302', { x: 430, y: 120, floor: 3, type: 'room', name: 'CAB302' });
  graph.addNode('ladies_wash_3rd', { x: 580, y: 120, floor: 3, type: 'room', name: 'Ladies Wash Room' });
  
  // Left side: B303, Lift, Main Staircase, B302, B301 IoT Lab
  graph.addNode('B303_left', { x: 100, y: 280, floor: 3, type: 'room', name: 'B303' });
  graph.addNode('lift_3rd', { x: 200, y: 280, floor: 3, type: 'lift', name: 'Lift' });
  graph.addNode('stairs_3rd', { x: 280, y: 280, floor: 3, type: 'stairs', name: 'Main Staircase' });
  graph.addNode('B302_left', { x: 100, y: 400, floor: 3, type: 'room', name: 'B302' });
  graph.addNode('B301', { x: 100, y: 550, floor: 3, type: 'room', name: 'B301 IoT Lab' });
  
  // Right side: C302, C305 Seminar Hall, C301, C305 Staff Room
  graph.addNode('C302', { x: 480, y: 280, floor: 3, type: 'room', name: 'C302' });
  graph.addNode('C305_seminar', { x: 650, y: 220, floor: 3, type: 'room', name: 'C305 Seminar Hall' });
  graph.addNode('C301', { x: 480, y: 400, floor: 3, type: 'room', name: 'C301' });
  graph.addNode('C305_staff', { x: 650, y: 400, floor: 3, type: 'room', name: 'C305 Staff Room' });
  
  // Entrance at bottom
  graph.addNode('entrance_3rd', { x: 400, y: 750, floor: 3, type: 'entrance', name: 'Entrance' });

  // 4th Floor Nodes - Based on real floor plan image (800x1000 coordinate system)
  // Top row: CAB401, CAB402, CAB403, Men's Wash Room
  graph.addNode('CAB401', { x: 130, y: 120, floor: 4, type: 'room', name: 'CAB401' });
  graph.addNode('CAB402', { x: 280, y: 120, floor: 4, type: 'room', name: 'CAB402' });
  graph.addNode('CAB403', { x: 430, y: 120, floor: 4, type: 'room', name: 'CAB403' });
  graph.addNode('mens_wash_4th', { x: 580, y: 120, floor: 4, type: 'room', name: "Men's Wash Room" });
  
  // Left side: B401, Lift, Main Staircase, B402, B403 Staff Room
  graph.addNode('B401', { x: 100, y: 280, floor: 4, type: 'room', name: 'B401' });
  graph.addNode('lift_4th', { x: 200, y: 280, floor: 4, type: 'lift', name: 'Lift' });
  graph.addNode('stairs_4th', { x: 280, y: 280, floor: 4, type: 'stairs', name: 'Main Staircase' });
  graph.addNode('B402', { x: 100, y: 400, floor: 4, type: 'room', name: 'B402' });
  graph.addNode('B403', { x: 100, y: 550, floor: 4, type: 'room', name: 'B403 Staff Room' });
  
  // Right side: C403, C404, C402, C405 ADS Lab, C401, Staff Room C406
  graph.addNode('C403', { x: 480, y: 220, floor: 4, type: 'room', name: 'C403' });
  graph.addNode('C404', { x: 650, y: 220, floor: 4, type: 'room', name: 'C404' });
  graph.addNode('C402', { x: 480, y: 340, floor: 4, type: 'room', name: 'C402' });
  graph.addNode('C405', { x: 650, y: 340, floor: 4, type: 'room', name: 'C405 ADS Lab' });
  graph.addNode('C401', { x: 480, y: 480, floor: 4, type: 'room', name: 'C401' });
  graph.addNode('C406', { x: 650, y: 480, floor: 4, type: 'room', name: 'Staff Room C406' });
  
  // Entrance at bottom
  graph.addNode('entrance_4th', { x: 400, y: 750, floor: 4, type: 'entrance', name: 'Entrance' });

  // 3rd Floor Connections - Based on real floor layout
  // Main corridor connections (horizontal path through center)
  graph.addEdge('lift_3rd', 'stairs_3rd', 80);
  graph.addEdge('stairs_3rd', 'C302', 150);
  graph.addEdge('C302', 'C305_seminar', 120);
  graph.addEdge('C302', 'C301', 100);
  graph.addEdge('C301', 'C305_staff', 120);
  
  // Left side connections
  graph.addEdge('lift_3rd', 'B303_left', 80);
  graph.addEdge('B303_left', 'B302_left', 100);
  graph.addEdge('B302_left', 'B301', 120);
  
  // Top row connections
  graph.addEdge('stairs_3rd', 'B302_top', 100);
  graph.addEdge('B302_top', 'B303_3rd', 120);
  graph.addEdge('B302_top', 'CAB302', 120);
  graph.addEdge('CAB302', 'ladies_wash_3rd', 120);
  
  // Vertical connections between floors
  graph.addEdge('stairs_3rd', 'C302', 150);
  graph.addEdge('C302', 'C301', 100);
  
  // Entrance connection
  graph.addEdge('stairs_3rd', 'entrance_3rd', 200);
  
  // Reverse connections for undirected graph
  graph.addEdge('stairs_3rd', 'lift_3rd', 80);
  graph.addEdge('C302', 'stairs_3rd', 150);
  graph.addEdge('C305_seminar', 'C302', 120);
  graph.addEdge('C301', 'C302', 100);
  graph.addEdge('C305_staff', 'C301', 120);
  graph.addEdge('B303_left', 'lift_3rd', 80);
  graph.addEdge('B302_left', 'B303_left', 100);
  graph.addEdge('B301', 'B302_left', 120);
  graph.addEdge('B302_top', 'stairs_3rd', 100);
  graph.addEdge('B303_3rd', 'B302_top', 120);
  graph.addEdge('CAB302', 'B302_top', 120);
  graph.addEdge('ladies_wash_3rd', 'CAB302', 120);
  graph.addEdge('entrance_3rd', 'stairs_3rd', 200);

  // 4th Floor Connections - Based on real floor layout
  // Main corridor connections (horizontal path through center)
  graph.addEdge('lift_4th', 'stairs_4th', 80);
  graph.addEdge('stairs_4th', 'C403', 150);
  graph.addEdge('C403', 'C404', 120);
  graph.addEdge('C403', 'C402', 100);
  graph.addEdge('C402', 'C405', 120);
  graph.addEdge('C402', 'C401', 100);
  graph.addEdge('C401', 'C406', 120);
  
  // Left side connections
  graph.addEdge('lift_4th', 'B401', 80);
  graph.addEdge('B401', 'B402', 100);
  graph.addEdge('B402', 'B403', 120);
  
  // Top row connections
  graph.addEdge('stairs_4th', 'CAB402', 100);
  graph.addEdge('CAB402', 'CAB401', 120);
  graph.addEdge('CAB402', 'CAB403', 120);
  graph.addEdge('CAB403', 'mens_wash_4th', 120);
  
  // Vertical connections
  graph.addEdge('stairs_4th', 'C403', 150);
  graph.addEdge('C403', 'C402', 100);
  graph.addEdge('C402', 'C401', 100);
  
  // Entrance connection
  graph.addEdge('stairs_4th', 'entrance_4th', 200);
  
  // Reverse connections for undirected graph
  graph.addEdge('stairs_4th', 'lift_4th', 80);
  graph.addEdge('C403', 'stairs_4th', 150);
  graph.addEdge('C404', 'C403', 120);
  graph.addEdge('C402', 'C403', 100);
  graph.addEdge('C405', 'C402', 120);
  graph.addEdge('C401', 'C402', 100);
  graph.addEdge('C406', 'C401', 120);
  graph.addEdge('B401', 'lift_4th', 80);
  graph.addEdge('B402', 'B401', 100);
  graph.addEdge('B403', 'B402', 120);
  graph.addEdge('CAB402', 'stairs_4th', 100);
  graph.addEdge('CAB401', 'CAB402', 120);
  graph.addEdge('CAB403', 'CAB402', 120);
  graph.addEdge('mens_wash_4th', 'CAB403', 120);
  graph.addEdge('entrance_4th', 'stairs_4th', 200);

  // Inter-floor connections (stairs and lift)
  graph.addEdge('stairs_3rd', 'stairs_4th', 100); // Stairs between floors
  graph.addEdge('stairs_4th', 'stairs_3rd', 100);
  graph.addEdge('lift_3rd', 'lift_4th', 80); // Lift between floors
  graph.addEdge('lift_4th', 'lift_3rd', 80);

  return graph;
}

// Get all available locations for dropdowns
export function getAllLocations(graph) {
  const locations = [];
  for (const [id, data] of graph.nodes) {
    locations.push({
      id,
      name: data.name,
      floor: data.floor,
      type: data.type
    });
  }
  return locations.sort((a, b) => {
    if (a.floor !== b.floor) return a.floor - b.floor;
    return a.name.localeCompare(b.name);
  });
}

// Get floor-specific locations
export function getFloorLocations(graph, floor) {
  return getAllLocations(graph).filter(loc => loc.floor === floor);
}
