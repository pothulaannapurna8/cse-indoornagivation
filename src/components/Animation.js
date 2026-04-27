import React, { useEffect, useRef, useState, useCallback } from 'react';

const Animation = ({ 
  graph, 
  path, 
  currentFloor, 
  isAnimating, 
  onAnimationComplete,
  onFloorSwitch,
  speed = 3 // base speed multiplier
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [pathProgress, setPathProgress] = useState(0); // Total progress along entire path (0 to 1)
  const trailRef = useRef([]); // Store trail positions for smooth effect
  const floorSwitchTimeoutRef = useRef(null);
  const lastFloorRef = useRef(currentFloor);

  // Easing function for smooth acceleration and deceleration
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Calculate position along the entire path with floor transition detection
  const getPositionAlongPath = useCallback((progress) => {
    if (!path || path.length < 2) return null;
    
    const totalSegments = path.length - 1;
    const currentSegmentFloat = progress * totalSegments;
    const currentSegmentIndex = Math.floor(currentSegmentFloat);
    const segmentProgress = currentSegmentFloat - currentSegmentIndex;
    
    if (currentSegmentIndex >= totalSegments) {
      // At the end of the path
      const lastNode = graph.getNode(path[path.length - 1]);
      return { x: lastNode.x, y: lastNode.y, node: lastNode, floor: lastNode.floor };
    }
    
    const fromNode = graph.getNode(path[currentSegmentIndex]);
    const toNode = graph.getNode(path[currentSegmentIndex + 1]);
    
    // Detect floor transition
    const isFloorTransition = fromNode.floor !== toNode.floor;
    
    // Apply easing to segment progress for smoother movement
    const easedProgress = easeInOutQuad(segmentProgress);
    
    // Calculate interpolated position
    const x = fromNode.x + (toNode.x - fromNode.x) * easedProgress;
    const y = fromNode.y + (toNode.y - fromNode.y) * easedProgress;
    
    return { 
      x, 
      y, 
      fromNode, 
      toNode, 
      segmentProgress: easedProgress,
      isFloorTransition,
      currentFloor: fromNode.floor,
      targetFloor: toNode.floor
    };
  }, [path, graph]);

  useEffect(() => {
    if (!isAnimating || !path || path.length < 2) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Calculate total path distance for consistent speed
    let totalDistance = 0;
    const segmentDistances = [];
    for (let i = 0; i < path.length - 1; i++) {
      const fromNode = graph.getNode(path[i]);
      const toNode = graph.getNode(path[i + 1]);
      const distance = Math.sqrt(
        Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2)
      );
      segmentDistances.push(distance);
      totalDistance += distance;
    }
    
    const animate = (currentTime) => {
      // Initialize lastTime on first frame
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }
      
      // Calculate delta time for smooth animation
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get current position along path
      const position = getPositionAlongPath(pathProgress);
      
      if (!position) {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        return;
      }

      // Only animate if current segment is on the visible floor
      if (position.fromNode && position.toNode) {
        if (position.fromNode.floor === currentFloor && position.toNode.floor === currentFloor) {
          // Update trail
          trailRef.current.push({ x: position.x, y: position.y, time: currentTime });
          
          // Keep only recent trail points (last 500ms)
          trailRef.current = trailRef.current.filter(point => currentTime - point.time < 500);
          
          // Draw trail
          if (trailRef.current.length > 1) {
            ctx.strokeStyle = 'rgba(255, 87, 34, 0.3)';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            trailRef.current.forEach((point, index) => {
              const opacity = index / trailRef.current.length;
              ctx.globalAlpha = opacity * 0.5;
              
              if (index === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
          
          // Draw animated dot with pulsing effect
          const pulseSize = 10 + Math.sin(currentTime * 0.005) * 2;
          
          // Outer glow
          ctx.beginPath();
          ctx.arc(position.x, position.y, pulseSize + 8, 0, 2 * Math.PI);
          const glowGradient = ctx.createRadialGradient(
            position.x, position.y, 0,
            position.x, position.y, pulseSize + 8
          );
          glowGradient.addColorStop(0, 'rgba(255, 87, 34, 0.3)');
          glowGradient.addColorStop(1, 'rgba(255, 87, 34, 0)');
          ctx.fillStyle = glowGradient;
          ctx.fill();
          
          // Main dot
          ctx.beginPath();
          ctx.arc(position.x, position.y, pulseSize, 0, 2 * Math.PI);
          
          // Gradient fill for the dot
          const gradient = ctx.createRadialGradient(
            position.x - pulseSize/3, position.y - pulseSize/3, 0,
            position.x, position.y, pulseSize
          );
          gradient.addColorStop(0, '#FF8A65');
          gradient.addColorStop(0.5, '#FF5722');
          gradient.addColorStop(1, '#D84315');
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // White border
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          
          setCurrentPosition({ x: position.x, y: position.y });
          
          // Update progress based on time for consistent speed
          const progressIncrement = (speed * deltaTime) / (totalDistance * 10); // Normalize speed
          const newProgress = Math.min(pathProgress + progressIncrement, 1);
          
          setPathProgress(newProgress);
          
          if (newProgress >= 1) {
            // Animation complete
            if (onAnimationComplete) {
              onAnimationComplete();
            }
            return;
          }
        }
      } else if (position.node) {
        // Handle end of path
        if (position.node.floor === currentFloor) {
          const pulseSize = 10 + Math.sin(currentTime * 0.005) * 2;
          
          ctx.beginPath();
          ctx.arc(position.x, position.y, pulseSize, 0, 2 * Math.PI);
          
          const gradient = ctx.createRadialGradient(
            position.x - pulseSize/3, position.y - pulseSize/3, 0,
            position.x, position.y, pulseSize
          );
          gradient.addColorStop(0, '#FF8A65');
          gradient.addColorStop(0.5, '#FF5722');
          gradient.addColorStop(1, '#D84315');
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          setCurrentPosition({ x: position.x, y: position.y });
        }
        
        if (pathProgress >= 1) {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      lastTimeRef.current = 0;
    };
  }, [isAnimating, path, currentFloor, pathProgress, graph, speed, onAnimationComplete, getPositionAlongPath]);

  // Reset animation when path changes
  useEffect(() => {
    setPathProgress(0);
    setCurrentPosition(null);
    trailRef.current = [];
    lastTimeRef.current = 0;
  }, [path]);

  // Reset when animation stops
  useEffect(() => {
    if (!isAnimating) {
      trailRef.current = [];
      lastTimeRef.current = 0;
    }
  }, [isAnimating]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={500}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10
      }}
    />
  );
};

export default Animation;
