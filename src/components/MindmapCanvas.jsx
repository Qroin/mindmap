import React, { useRef, useState } from 'react';
import { LocationNode, ObjectNode, MiniObjectPreviewChip } from './MindmapNode.jsx';

export default function MindmapCanvas({
  locations,
  objects,
  positions,
  setPositions,
  pan,
  setPan,
  onLocationClick,
  onObjectClick,
  activeLocationMode,
  setActiveLocationMode,
  onRequestCreateLocation
}) {
  const containerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState(null);

  const blankLongPressTimerRef = useRef(null);
  const isBlankLongPressRef = useRef(false);

  const getClientCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handleEnterLocationMode = (loc) => {
    setActiveLocationMode(loc.id);
    const locPos = positions.locationPositions[loc.id];
    if (locPos) {
      setPan({ x: -locPos.x, y: -locPos.y });
    }
  };

  const handleExitLocationMode = () => {
    setActiveLocationMode(null);
    setPan({ x: 0, y: 0 });
  };

  const handleStartPan = (e) => {
    if (activeLocationMode) {
      const isInsideNode = 
        e.target.closest('.location-room-box') ||
        e.target.closest('.object-tier-node');

      if (!isInsideNode) {
        handleExitLocationMode();
        return;
      }
    }

    if (
      e.target.closest('.location-room-box') ||
      e.target.closest('.object-tier-node')
    ) {
      return;
    }

    const { clientX, clientY } = getClientCoords(e);

    isBlankLongPressRef.current = false;
    blankLongPressTimerRef.current = setTimeout(() => {
      isBlankLongPressRef.current = true;
      setIsPanning(false);

      const canvasX = clientX - pan.x - window.innerWidth / 2;
      const canvasY = clientY - pan.y - window.innerHeight / 2;

      if (onRequestCreateLocation) {
        onRequestCreateLocation({ x: canvasX, y: canvasY });
      }
    }, 380);

    setIsPanning(true);
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handleMove = (e) => {
    const { clientX, clientY } = getClientCoords(e);

    if (isPanning) {
      const movement = Math.hypot(clientX - (dragStart.x + pan.x), clientY - (dragStart.y + pan.y));
      if (movement > 5 && blankLongPressTimerRef.current) {
        clearTimeout(blankLongPressTimerRef.current);
      }

      setPan({
        x: clientX - dragStart.x,
        y: clientY - dragStart.y
      });
    } else if (draggingNode) {
      const dx = clientX - draggingNode.startX;
      const dy = clientY - draggingNode.startY;

      const newX = draggingNode.initialNodeX + dx;
      const newY = draggingNode.initialNodeY + dy;

      if (draggingNode.type === 'location') {
        const locId = draggingNode.id;
        const roomObjs = objects.filter(o => o.locationId === locId);

        setPositions(prev => {
          const newLocPos = {
            ...prev.locationPositions,
            [locId]: { ...prev.locationPositions[locId], x: newX, y: newY }
          };

          const newObjPos = { ...prev.objectPositions };
          roomObjs.forEach(obj => {
            if (newObjPos[obj.id]) {
              newObjPos[obj.id] = {
                ...newObjPos[obj.id],
                x: newX + (newObjPos[obj.id].relX || 0),
                y: newY + (newObjPos[obj.id].relY || 0)
              };
            }
          });

          return {
            locationPositions: newLocPos,
            objectPositions: newObjPos,
            featurePositions: {}
          };
        });
      } else if (draggingNode.type === 'object') {
        setPositions(prev => ({
          ...prev,
          objectPositions: {
            ...prev.objectPositions,
            [draggingNode.id]: { ...prev.objectPositions[draggingNode.id], x: newX, y: newY }
          }
        }));
      }
    }
  };

  const handleEndDrag = () => {
    if (blankLongPressTimerRef.current) {
      clearTimeout(blankLongPressTimerRef.current);
    }
    setIsPanning(false);
    setDraggingNode(null);
  };

  const handleNodeMouseDown = (e, nodeId, type) => {
    const { clientX, clientY } = getClientCoords(e);

    let initialX = 0;
    let initialY = 0;

    if (type === 'location') {
      initialX = positions.locationPositions[nodeId]?.x || 0;
      initialY = positions.locationPositions[nodeId]?.y || 0;
    } else if (type === 'object') {
      initialX = positions.objectPositions[nodeId]?.x || 0;
      initialY = positions.objectPositions[nodeId]?.y || 0;
    }

    setDraggingNode({
      id: nodeId,
      type,
      startX: clientX,
      startY: clientY,
      initialNodeX: initialX,
      initialNodeY: initialY
    });
  };

  return (
    <div
      className="canvas-viewport"
      ref={containerRef}
      onMouseDown={handleStartPan}
      onMouseMove={handleMove}
      onMouseUp={handleEndDrag}
      onTouchStart={handleStartPan}
      onTouchMove={handleMove}
      onTouchEnd={handleEndDrag}
    >
      <div
        className="nodes-layer"
        style={{
          transform: `translate(${pan.x + window.innerWidth / 2}px, ${pan.y + window.innerHeight / 2}px)`
        }}
      >
        {/* 1. ROOM BOX CONTAINERS */}
        {locations.map((loc) => {
          const locPos = positions.locationPositions[loc.id] || { x: 0, y: 0 };
          const objCount = objects.filter(o => o.locationId === loc.id).length;
          const isNeighbor = activeLocationMode && activeLocationMode !== loc.id;

          // Calculate dynamic box dimensions based on distance to neighbor nodes
          let minDistance = Infinity;
          locations.forEach((other) => {
            if (other.id === loc.id) return;
            const otherPos = positions.locationPositions[other.id];
            if (!otherPos) return;
            const d = Math.hypot(locPos.x - otherPos.x, locPos.y - otherPos.y);
            if (d < minDistance) minDistance = d;
          });

          const boxWidth = minDistance === Infinity ? 170 : Math.round(Math.max(110, Math.min(220, minDistance * 0.52)));
          const boxHeight = minDistance === Infinity ? 120 : Math.round(Math.max(75, Math.min(145, minDistance * 0.38)));

          return (
            <div 
              key={loc.id}
              style={{ opacity: isNeighbor ? 0.45 : 1, transition: 'opacity 0.3s' }}
            >
              <LocationNode
                location={loc}
                pos={locPos}
                objectCount={objCount}
                boxWidth={boxWidth}
                boxHeight={boxHeight}
                onMouseDown={handleNodeMouseDown}
                onOpenModal={(locationObj) => onLocationClick && onLocationClick(locationObj)}
                onEnterLocationMode={(locationObj) => handleEnterLocationMode(locationObj)}
              />
            </div>
          );
        })}

        {/* OVERVIEW MODE: MINI 3-LETTER SQUARE OBJECT PREVIEW CHIPS (DISABLED WHEN BOX IS SMALL) */}
        {!activeLocationMode && objects.map((objItem) => {
          const loc = locations.find(l => l.id === objItem.locationId);
          if (!loc) return null;

          const locPos = positions.locationPositions[loc.id] || { x: 0, y: 0 };
          
          // Calculate parent room box width to check preview threshold
          let minDistance = Infinity;
          locations.forEach((other) => {
            if (other.id === loc.id) return;
            const otherPos = positions.locationPositions[other.id];
            if (!otherPos) return;
            const d = Math.hypot(locPos.x - otherPos.x, locPos.y - otherPos.y);
            if (d < minDistance) minDistance = d;
          });

          const boxWidth = minDistance === Infinity ? 170 : Math.round(Math.max(110, Math.min(220, minDistance * 0.52)));
          
          // Hide object preview chips if box width drops below 140px threshold
          if (boxWidth < 140) return null;

          const objPos = positions.objectPositions[objItem.id] || { x: 0, y: 0 };

          return (
            <MiniObjectPreviewChip
              key={`mini-${objItem.id}`}
              objectItem={objItem}
              pos={objPos}
              location={loc}
            />
          );
        })}

        {/* ROOM ENTRY MODE: FULL INTERACTIVE OBJECT FURNITURE NODES */}
        {activeLocationMode && objects.map((objItem) => {
          const loc = locations.find(l => l.id === objItem.locationId);
          if (activeLocationMode !== loc?.id) return null;

          const objPos = positions.objectPositions[objItem.id] || { x: 0, y: 0 };

          return (
            <ObjectNode
              key={objItem.id}
              objectItem={objItem}
              pos={objPos}
              location={loc}
              onMouseDown={handleNodeMouseDown}
              onOpenObjectModal={(locObj, obj) => onObjectClick && onObjectClick(locObj, obj)}
            />
          );
        })}
      </div>
    </div>
  );
}
