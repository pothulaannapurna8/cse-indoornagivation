import React, { useState, useEffect } from 'react';
import ImageMap from './ImageMap';
import { createCampusGraph, getAllLocations } from '../data/campusData';

const Navigation = () => {
  const [graph] = useState(() => createCampusGraph());
  const [locations, setLocations] = useState([]);
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [path, setPath] = useState([]);
  const [currentFloor, setCurrentFloor] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pathProgress, setPathProgress] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(null);
  const [directions, setDirections] = useState([]);
  const [distance, setDistance] = useState(0);
  const [floorSwitchMessage, setFloorSwitchMessage] = useState('');

  useEffect(() => {
    setLocations(getAllLocations(graph));
  }, [graph]);

  const calculatePath = () => {
    if (!startLocation || !destination) {
      alert('Please select both start and destination locations');
      return;
    }

    if (startLocation === destination) {
      alert('Start and destination cannot be the same');
      return;
    }

    const result = graph.dijkstra(startLocation, destination);
    
    if (result.path.length === 0) {
      alert('No path found between selected locations');
      return;
    }

    setPath(result.path);
    setDistance(result.distance);
    generateDirections(result.path);
    
    // Set current floor to start location's floor
    const startNode = graph.getNode(startLocation);
    const destNode = graph.getNode(destination);
    setCurrentFloor(startNode.floor);
    setPathProgress(0);
    setFloorSwitchMessage('');
    
    // Start animation
    setIsAnimating(true);
    startPathAnimation(result.path, startNode.floor, destNode.floor);
  };

  const generateDirections = (pathNodes) => {
    const steps = [];
    
    for (let i = 0; i < pathNodes.length; i++) {
      const currentNode = graph.getNode(pathNodes[i]);
      const nextNode = i < pathNodes.length - 1 ? graph.getNode(pathNodes[i + 1]) : null;
      
      if (i === 0) {
        steps.push(`Start at ${currentNode.name} (Floor ${currentNode.floor})`);
      }
      
      if (nextNode) {
        // Check for floor transition
        if (currentNode.floor !== nextNode.floor) {
          if (currentNode.type === 'stairs') {
            steps.push(`Take stairs to Floor ${nextNode.floor}`);
          } else if (currentNode.type === 'lift') {
            steps.push(`Take lift to Floor ${nextNode.floor}`);
          }
        } else {
          // Same floor movement
          const direction = getDirection(currentNode, nextNode);
          steps.push(`${direction} to ${nextNode.name}`);
        }
      }
      
      if (i === pathNodes.length - 1) {
        steps.push(`Arrive at ${currentNode.name}`);
      }
    }
    
    setDirections(steps);
  };

  const getDirection = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'Go right' : 'Go left';
    } else {
      return dy > 0 ? 'Go down' : 'Go up';
    }
  };

  const startPathAnimation = (pathNodes, startFloor, destFloor) => {
    let progress = 0;
    const totalSegments = pathNodes.length - 1;
    const animationSpeed = 0.005; // Progress increment per frame
    
    const animate = () => {
      progress += animationSpeed;
      
      if (progress >= 1) {
        progress = 1;
        setIsAnimating(false);
        setFloorSwitchMessage('');
      }
      
      setPathProgress(progress);
      
      // Check if we need to switch floors
      const currentSegmentFloat = progress * totalSegments;
      const currentSegmentIndex = Math.floor(currentSegmentFloat);
      
      if (currentSegmentIndex < totalSegments) {
        const fromNode = graph.getNode(pathNodes[currentSegmentIndex]);
        const toNode = graph.getNode(pathNodes[currentSegmentIndex + 1]);
        
        // Detect floor transition
        if (fromNode.floor !== toNode.floor) {
          // Pause animation and switch floor
          const targetFloor = fromNode.floor === 3 ? 4 : 3;
          setCurrentFloor(targetFloor);
          setFloorSwitchMessage(`Switching to Floor ${targetFloor}...`);
          
          // Clear message after a delay
          setTimeout(() => {
            setFloorSwitchMessage('');
          }, 2000);
        } else {
          // Ensure we're showing the correct floor
          setCurrentFloor(fromNode.floor);
        }
      }
      
      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        setAnimationFrame(frameId);
      }
    };
    
    const frameId = requestAnimationFrame(animate);
    setAnimationFrame(frameId);
  };

  const stopAnimation = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      setAnimationFrame(null);
    }
    setIsAnimating(false);
    setFloorSwitchMessage('');
  };

  const resetNavigation = () => {
    stopAnimation();
    setPath([]);
    setDirections([]);
    setDistance(0);
    setPathProgress(0);
    setStartLocation('');
    setDestination('');
    setFloorSwitchMessage('');
  };

  const switchFloor = (floor) => {
    setCurrentFloor(floor);
    if (isAnimating) {
      stopAnimation();
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#2c3e50', 
          marginBottom: '30px',
          fontSize: '32px',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          🗺️ Indoor Campus Navigation System
        </h1>
      
      {/* Control Panel */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '25px', 
        borderRadius: '15px', 
        marginBottom: '25px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr auto auto', 
          gap: '20px', 
          alignItems: 'center'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#495057',
              fontSize: '14px'
            }}>
              📍 Start Location:
            </label>
            <select
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                minWidth: '250px',
                fontSize: '14px',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <option value="">Select start location</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} (Floor {loc.floor})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#495057',
              fontSize: '14px'
            }}>
              🎯 Destination:
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                minWidth: '250px',
                fontSize: '14px',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <option value="">Select destination</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} (Floor {loc.floor})
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={calculatePath}
            style={{
              padding: '14px 28px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🚀 Navigate
          </button>
          
          <button
            onClick={resetNavigation}
            style={{
              padding: '14px 28px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 8px rgba(220, 53, 69, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Reset
          </button>
        </div>
        
        {distance > 0 && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px 20px', 
            backgroundColor: '#d4edda', 
            borderRadius: '10px',
            border: '1px solid #c3e6cb',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>📏</span>
            <strong style={{ color: '#155724', fontSize: '16px' }}>Total Distance: {distance.toFixed(0)} units</strong>
          </div>
        )}
        
        {floorSwitchMessage && (
          <div style={{ 
            marginTop: '15px', 
            padding: '15px 20px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '10px',
            border: '1px solid #ffeaa7',
            color: '#856404', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'pulse 2s infinite'
          }}>
            <span style={{ fontSize: '20px' }}>🔄</span>
            {floorSwitchMessage}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '25px', 
        alignItems: 'flex-start',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row'
      }}>
        {/* Map Container */}
        <div style={{ flex: 1 }}>
          {/* Floor Switcher */}
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '2px solid #e9ecef'
            }}>
              <button
                onClick={() => switchFloor(3)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: currentFloor === 3 ? '#007bff' : '#f8f9fa',
                  color: currentFloor === 3 ? 'white' : '#6c757d',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  borderRight: '1px solid #e9ecef'
                }}
              >
                🏢 3rd Floor
              </button>
              <button
                onClick={() => switchFloor(4)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: currentFloor === 4 ? '#007bff' : '#f8f9fa',
                  color: currentFloor === 4 ? 'white' : '#6c757d',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                🏢 4th Floor
              </button>
            </div>
          </div>
          
          {/* Image Map with Animation */}
          <ImageMap
            graph={graph}
            currentFloor={currentFloor}
            path={path}
            currentNode={startLocation}
            destinationNode={destination}
            showUserLocation={!!startLocation}
            userLocation={startLocation}
            pathProgress={pathProgress}
            isAnimating={isAnimating}
          />
        </div>

        {/* Directions Panel */}
        <div style={{ 
          width: window.innerWidth < 768 ? '100%' : '350px'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              marginTop: 0, 
              color: '#2c3e50',
              fontSize: '20px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🧭 Step-by-Step Directions
            </h3>
            {directions.length > 0 ? (
              <ol style={{ paddingLeft: '20px', margin: 0 }}>
                {directions.map((step, index) => (
                  <li key={index} style={{ marginBottom: '8px', lineHeight: '1.4' }}>
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <div style={{ 
                color: '#6c757d', 
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '20px 10px'
              }}>
                📍 Select start and destination to see directions
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '25px',
            borderRadius: '15px',
            marginTop: '20px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              marginTop: 0, 
              color: '#2c3e50',
              fontSize: '20px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 Legend
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '8px 0'
              }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#4CAF50', 
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
                }}></div>
                <span style={{ fontWeight: '500', color: '#495057' }}>Room</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '8px 0'
              }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#2196F3', 
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)'
                }}></div>
                <span style={{ fontWeight: '500', color: '#495057' }}>Corridor</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '8px 0'
              }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#FF9800', 
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(255, 152, 0, 0.3)'
                }}></div>
                <span style={{ fontWeight: '500', color: '#495057' }}>Stairs</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '8px 0'
              }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#9C27B0', 
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(156, 39, 176, 0.3)'
                }}></div>
                <span style={{ fontWeight: '500', color: '#495057' }}>Lift</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '8px 0'
              }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#F44336', 
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)'
                }}></div>
                <span style={{ fontWeight: '500', color: '#495057' }}>Entrance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Navigation;
