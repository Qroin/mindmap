import React, { useRef, useState } from 'react';
import { LocationNode, ObjectNode, FeaturePillNode, MiniObjectPreviewChip } from './MindmapNode.jsx';
import { getBezierPath } from '../utils/layoutEngine.js';

export default function MindmapCanvas({
  locations,
  objects,
  features,
  positions,
  setPositions,
  pan,
  setPan,
  searchTerm,
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
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const blankLongPressTimerRef = useRef(null);
  const isBlankLongPressRef = useRef(false);

  const zoom = 1.0;

  const searchLower = (searchTerm || '').toLowerCase().trim();
  const isSearchActive = searchLower.length > 0;

  const matchesSearch = (feat) => {
    if (!isSearchActive) return false;
    return feat.name.toLowerCase().includes(searchLower);
  };

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
        e.target.closest('.object-tier-node') ||
        e.target.closest('.feature-tier-node');

      if (!isInsideNode) {
        handleExitLocationMode();
        return;
      }
    }

    if (
      e.target.closest('.location-room-box') ||
      e.target.closest('.object-tier-node') ||
      e.target.closest('.feature-tier-node')
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
        const roomObjIds = new Set(roomObjs.map(o => o.id));

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

          const newFeatPos = { ...prev.featurePositions };
          (features || []).forEach(feat => {
            if (roomObjIds.has(feat.objectId) && newFeatPos[feat.id]) {
              newFeatPos[feat.id] = {
                ...newFeatPos[feat.id],
                x: newX + (newFeatPos[feat.id].relX || 0),
                y: newY + (newFeatPos[feat.id].relY || 0)
              };
            }
          });

          return {
            locationPositions: newLocPos,
            objectPositions: newObjPos,
            featurePositions: newFeatPos
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
      } else if (draggingNode.type === 'feature') {
        setPositions(prev => ({
          ...prev,
          featurePositions: {
            ...prev.featurePositions,
            [draggingNode.id]: { x: newX, y: newY }
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
    } else if (type === 'feature') {
      initialX = positions.featurePositions[nodeId]?.x || 0;
      initialY = positions.featurePositions[nodeId]?.y || 0;
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
        {/* SVG Bezier Connections */}
        <svg className="svg-layer">
          {activeLocationMode && objects.map((objItem) => {
            const loc = locations.find(l => l.id === objItem.locationId);
            if (activeLocationMode !== loc?.id) return null;

            const objPos = positions.objectPositions[objItem.id] || { x: 0, y: 0 };
            const objFeats = (features || []).filter(f => f.objectId === objItem.id);

            return objFeats.map((feat) => {
              const featPos = positions.featurePositions[feat.id] || { x: 0, y: 0 };
              const pathStr = getBezierPath(objPos.x, objPos.y, featPos.x, featPos.y, 0.2);
              const isHovered = hoveredNodeId === objItem.id || hoveredNodeId === feat.id;

              return (
                <path
                  key={`obj-feat-${feat.id}`}
                  d={pathStr}
                  className="mindmap-connector"
                  stroke={isHovered ? '#818cf8' : (loc?.color ? `${loc.color}77` : 'rgba(255,255,255,0.25)')}
                  strokeWidth={isHovered ? 3 : 1.5}
                />
              );
            });
          })}
        </svg>

        {/* 1. ROOM BOX CONTAINERS */}
        {locations.map((loc) => {
          const locPos = positions.locationPositions[loc.id] || { x: 0, y: 0 };
          const objCount = objects.filter(o => o.locationId === loc.id).length;
          const isNeighbor = activeLocationMode && activeLocationMode !== loc.id;

          return (
            <div 
              key={loc.id}
              style={{ opacity: isNeighbor ? 0.45 : 1, transition: 'opacity 0.3s' }}
            >
              <LocationNode
                location={loc}
                pos={locPos}
                objectCount={objCount}
                onMouseDown={handleNodeMouseDown}
                onOpenModal={(locationObj) => onLocationClick && onLocationClick(locationObj)}
                onEnterLocationMode={(locationObj) => handleEnterLocationMode(locationObj)}
              />
            </div>
          );
        })}

        {/* OVERVIEW MODE: MINI 3-LETTER SQUARE OBJECT PREVIEW CHIPS */}
        {!activeLocationMode && objects.map((objItem) => {
          const loc = locations.find(l => l.id === objItem.locationId);
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
          const featCount = (features || []).filter(f => f.objectId === objItem.id).length;

          return (
            <ObjectNode
              key={objItem.id}
              objectItem={objItem}
              pos={objPos}
              location={loc}
              featureCount={featCount}
              onMouseDown={handleNodeMouseDown}
              onOpenObjectModal={(locObj, obj) => onObjectClick && onObjectClick(locObj, obj)}
            />
          );
        })}

        {/* ROOM ENTRY MODE: FEATURE PILL NODES */}
        {activeLocationMode && (features || []).map((feat) => {
          const objItem = objects.find(o => o.id === feat.objectId);
          const loc = locations.find(l => l.id === objItem?.locationId);
          if (activeLocationMode !== loc?.id) return null;

          const featPos = positions.featurePositions[feat.id] || { x: 0, y: 0 };

          return (
            <FeaturePillNode
              key={feat.id}
              feature={feat}
              pos={featPos}
              location={loc}
              isHighlighted={matchesSearch(feat)}
              onMouseDown={handleNodeMouseDown}
              onHover={(id) => setHoveredNodeId(id)}
              onHoverLeave={() => setHoveredNodeId(null)}
            />
          );
        })}
      </div>
    </div>
  );
}
