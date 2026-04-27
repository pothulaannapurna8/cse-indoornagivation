import React, { useRef, useEffect, useState } from 'react';

const Map = ({ 
  graph, 
  currentFloor, 
  path = [], 
  currentNode = null, 
  destinationNode = null,
  showUserLocation = false,
  userLocation = null
}) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 500 });

  // Floor map colors
  const floorColors = {
    3: '#E8F4FD', // Light blue for 3rd floor
    4: '#FFF4E6'  // Light orange for 4th floor
  };

  // Node colors by type
  const nodeColors = {
    room: '#4CAF50',
    corridor: '#2196F3',
    stairs: '#FF9800',
    lift: '#9C27B0',
    entrance: '#F44336'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw floor background
    ctx.fillStyle = floorColors[currentFloor] || '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid for better visualization
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw edges (corridors)
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    for (const [fromNodeId, edges] of graph.edges) {
      const fromNode = graph.getNode(fromNodeId);
      if (fromNode.floor !== currentFloor) continue;
      
      for (const edge of edges) {
        const toNode = graph.getNode(edge.node);
        if (toNode.floor !== currentFloor) continue;
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    }

    // Draw path if exists
    if (path.length > 1) {
      ctx.strokeStyle = '#FF5722';
      ctx.lineWidth = 4;
      ctx.setLineDash([5, 5]);
      
      for (let i = 0; i < path.length - 1; i++) {
        const fromNode = graph.getNode(path[i]);
        const toNode = graph.getNode(path[i + 1]);
        
        if (fromNode.floor === currentFloor && toNode.floor === currentFloor) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
    }

    // Draw nodes
    const floorNodes = graph.getNodesByFloor(currentFloor);
    for (const node of floorNodes) {
      const isInPath = path.includes(node.id);
      const isCurrent = node.id === currentNode;
      const isDestination = node.id === destinationNode;
      const isUserLocation = showUserLocation && node.id === userLocation;

      // Node shadow
      if (isInPath || isCurrent || isDestination || isUserLocation) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isInPath ? 12 : 8, 0, 2 * Math.PI);
      
      if (isCurrent) {
        ctx.fillStyle = '#4CAF50';
      } else if (isDestination) {
        ctx.fillStyle = '#F44336';
      } else if (isUserLocation) {
        ctx.fillStyle = '#2196F3';
      } else {
        ctx.fillStyle = nodeColors[node.type] || '#666';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw node label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y - 15);
    }

    // Draw "You are here" marker
    if (showUserLocation && userLocation) {
      const userNode = graph.getNode(userLocation);
      if (userNode && userNode.floor === currentFloor) {
        // Pulsing effect for user location
        const time = Date.now() / 1000;
        const pulseSize = 15 + Math.sin(time * 3) * 3;
        
        ctx.beginPath();
        ctx.arc(userNode.x, userNode.y, pulseSize, 0, 2 * Math.PI);
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw "You" text
        ctx.fillStyle = '#2196F3';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('YOU', userNode.x, userNode.y + 5);
      }
    }
  }, [graph, currentFloor, path, currentNode, destinationNode, showUserLocation, userLocation]);

  return (
    <div style={{ 
      border: '2px solid #ddd', 
      borderRadius: '8px', 
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '10px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        Floor {currentFloor}
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default Map;
