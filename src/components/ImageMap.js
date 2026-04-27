import React, { useState } from 'react';

const ImageMap = ({
  graph,
  currentFloor,
  path = [],
  currentNode = null,
  destinationNode = null,
  showUserLocation = false,
  userLocation = null,
  pathProgress = 0,
  isAnimating = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const floorImage = currentFloor === 3 ? '/images/3rd-floor.svg' : '/images/4th-floor.svg';
  
  // Node colors by type
  const nodeColors = {
    room: '#4CAF50',
    corridor: '#2196F3',
    stairs: '#FF9800',
    lift: '#9C27B0',
    entrance: '#F44336'
  };

  // Get position along path for animation
  const getPositionAlongPath = (progress) => {
    if (!path || path.length < 2) return null;
    
    const totalSegments = path.length - 1;
    const currentSegmentFloat = progress * totalSegments;
    const currentSegmentIndex = Math.floor(currentSegmentFloat);
    const segmentProgress = currentSegmentFloat - currentSegmentIndex;
    
    if (currentSegmentIndex >= totalSegments) {
      const lastNode = graph.getNode(path[path.length - 1]);
      return { x: lastNode.x, y: lastNode.y, floor: lastNode.floor };
    }
    
    const fromNode = graph.getNode(path[currentSegmentIndex]);
    const toNode = graph.getNode(path[currentSegmentIndex + 1]);
    
    // Linear interpolation
    const x = fromNode.x + (toNode.x - fromNode.x) * segmentProgress;
    const y = fromNode.y + (toNode.y - fromNode.y) * segmentProgress;
    
    return { 
      x, 
      y, 
      fromNode, 
      toNode,
      isFloorTransition: fromNode.floor !== toNode.floor,
      currentFloor: fromNode.floor
    };
  };

  // Generate SVG path from nodes
  const generateSVGPath = () => {
    if (!path || path.length < 2) return '';
    
    let svgPath = '';
    
    for (let i = 0; i < path.length - 1; i++) {
      const fromNode = graph.getNode(path[i]);
      const toNode = graph.getNode(path[i + 1]);
      
      // Only draw if both nodes are on current floor
      if (fromNode.floor === currentFloor && toNode.floor === currentFloor) {
        if (svgPath === '') {
          svgPath = `M ${fromNode.x} ${fromNode.y}`;
        } else {
          svgPath += ` L ${fromNode.x} ${fromNode.y}`;
        }
        svgPath += ` L ${toNode.x} ${toNode.y}`;
      }
    }
    
    return svgPath;
  };

  // Get animated dot position
  const animatedPosition = isAnimating ? getPositionAlongPath(pathProgress) : null;

  // Get floor-specific nodes
  const floorNodes = graph.getNodesByFloor(currentFloor);

  return (
    <div style={{ 
      border: 'none', 
      borderRadius: '20px', 
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      background: '#fff',
      position: 'relative',
      transition: 'transform 0.3s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: '18px',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}>
        🏢 FLOOR {currentFloor}
      </div>
      
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Floor Map Image */}
        <img
          src={floorImage}
          alt={`Floor ${currentFloor} Map`}
          style={{ 
            display: 'block',
            maxWidth: '100%',
            height: 'auto'
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            color: '#6c757d',
            gap: '15px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #e9ecef',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>Loading floor map...</div>
          </div>
        )}
        
        {/* Error State */}
        {imageError && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            color: '#dc3545',
            padding: '20px',
            textAlign: 'center',
            gap: '15px'
          }}>
            <div style={{ fontSize: '48px' }}>⚠️</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
              Failed to load floor map image.<br/>
              Please ensure images are in /public/images/ directory.
            </div>
          </div>
        )}
        
        {/* SVG Overlay for Path and Animation */}
        {imageLoaded && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 10
            }}
            viewBox="0 0 800 1000"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Path Line */}
            {path.length > 1 && (
              <>
                <path
                  d={generateSVGPath()}
                  fill="none"
                  stroke="#FF5722"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))',
                    opacity: 0.3
                  }}
                />
                <path
                  d={generateSVGPath()}
                  fill="none"
                  stroke="#FF5722"
                  strokeWidth="4"
                  strokeDasharray="12,6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                    animation: 'dash 20s linear infinite'
                  }}
                />
              </>
            )}
            
            {/* Animated Dot */}
            {isAnimating && animatedPosition && animatedPosition.currentFloor === currentFloor && (
              <g>
                {/* Pulsing outer ring */}
                <circle
                  cx={animatedPosition.x}
                  cy={animatedPosition.y}
                  r="25"
                  fill="none"
                  stroke="#FF5722"
                  strokeWidth="2"
                  style={{
                    opacity: 0.6,
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                {/* Outer glow */}
                <circle
                  cx={animatedPosition.x}
                  cy={animatedPosition.y}
                  r="20"
                  fill="rgba(255, 87, 34, 0.2)"
                  style={{
                    filter: 'blur(4px)'
                  }}
                />
                {/* Main dot */}
                <circle
                  cx={animatedPosition.x}
                  cy={animatedPosition.y}
                  r="14"
                  fill="#FF5722"
                  stroke="#fff"
                  strokeWidth="3"
                  style={{
                    filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))'
                  }}
                />
                {/* Inner highlight */}
                <circle
                  cx={animatedPosition.x - 3}
                  cy={animatedPosition.y - 3}
                  r="4"
                  fill="rgba(255, 255, 255, 0.8)"
                />
              </g>
            )}
            
            {/* Node Markers */}
            {floorNodes.map(node => {
              const isInPath = path.includes(node.id);
              const isCurrent = node.id === currentNode;
              const isDestination = node.id === destinationNode;
              const isUserLocation = showUserLocation && node.id === userLocation;
              
              const radius = isCurrent || isDestination ? 14 : isInPath ? 10 : 8;
              const color = isCurrent ? '#4CAF50' : 
                           isDestination ? '#F44336' : 
                           isUserLocation ? '#2196F3' :
                           nodeColors[node.type] || '#666';
              
              return (
                <g key={node.id}>
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                    style={{
                      filter: isInPath || isCurrent || isDestination ? 
                        'drop-shadow(2px 2px 4px rgba(0,0,0,0.4))' : 'none'
                    }}
                  />
                  
                  {/* Node label background */}
                  <rect
                    x={node.x - 30}
                    y={node.y - 35}
                    width="60"
                    height="20"
                    rx="4"
                    fill="rgba(255, 255, 255, 0.95)"
                    stroke="#e9ecef"
                    strokeWidth="1"
                    style={{
                      filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))'
                    }}
                  />
                  
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y - 22}
                    textAnchor="middle"
                    fill="#2c3e50"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Segoe UI, Arial, sans-serif"
                  >
                    {node.name}
                  </text>
                  
                  {/* "YOU" marker for user location */}
                  {isUserLocation && (
                    <>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="20"
                        fill="none"
                        stroke="#2196F3"
                        strokeWidth="3"
                        strokeDasharray="4,2"
                      />
                      <rect
                        x={node.x - 15}
                        y={node.y + 8}
                        width="30"
                        height="16"
                        rx="3"
                        fill="#2196F3"
                      />
                      <text
                        x={node.x}
                        y={node.y + 19}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="Arial, sans-serif"
                      >
                        YOU
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

export default ImageMap;
