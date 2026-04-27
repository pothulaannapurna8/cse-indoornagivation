// Graph data structure and Dijkstra's algorithm implementation

export class Graph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  addNode(id, data) {
    this.nodes.set(id, data);
  }

  addEdge(from, to, weight) {
    if (!this.edges.has(from)) {
      this.edges.set(from, []);
    }
    this.edges.get(from).push({ node: to, weight });
  }

  getNeighbors(node) {
    return this.edges.get(node) || [];
  }

  getNode(node) {
    return this.nodes.get(node);
  }

  // Dijkstra's algorithm to find shortest path
  dijkstra(start, end) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // Initialize distances
    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, nodeId === start ? 0 : Infinity);
      previous.set(nodeId, null);
      unvisited.add(nodeId);
    }

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current = null;
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        if (distances.get(nodeId) < minDistance) {
          current = nodeId;
          minDistance = distances.get(nodeId);
        }
      }

      if (current === null || current === end) break;

      unvisited.delete(current);

      // Update distances to neighbors
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (unvisited.has(neighbor.node)) {
          const altDistance = distances.get(current) + neighbor.weight;
          if (altDistance < distances.get(neighbor.node)) {
            distances.set(neighbor.node, altDistance);
            previous.set(neighbor.node, current);
          }
        }
      }
    }

    // Reconstruct path
    const path = [];
    let current = end;
    
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current);
    }

    // If path doesn't start with start node, no path exists
    if (path[0] !== start) {
      return { path: [], distance: Infinity };
    }

    return {
      path,
      distance: distances.get(end)
    };
  }

  // Get all nodes on a specific floor
  getNodesByFloor(floor) {
    const floorNodes = [];
    for (const [id, data] of this.nodes) {
      if (data.floor === floor) {
        floorNodes.push({ id, ...data });
      }
    }
    return floorNodes;
  }

  // Get staircase and lift nodes for floor transitions
  getTransitionNodes() {
    const transitions = [];
    for (const [id, data] of this.nodes) {
      if (data.type === 'stairs' || data.type === 'lift') {
        transitions.push({ id, ...data });
      }
    }
    return transitions;
  }
}

// Calculate distance between two nodes
export function calculateDistance(node1, node2) {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
