import React, { useRef, useState, useEffect } from 'react';
import { LocationNode, ObjectNode, MiniObjectPreviewChip } from './MindmapNode.jsx';
import { getBezierPath } from '../utils/layoutEngine.js';

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
  onRequestCreateLocation,
  onRequestCreateObject
}) {
  const containerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [draggingNode, setDraggingNode] = useState(null);

  // Screen viewport dimensions listener (responsive mobile/desktop)
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate 80% boundary of min(width, height) for overview mode sizing
  const screenMin = Math.min(viewport.width, viewport.height);
  const maxAllowedSpan = screenMin * 0.8;

  // Find position extents for location nodes
  let minLocX = Infinity, maxLocX = -Infinity;
  let minLocY = Infinity, maxLocY = -Infinity;

  locations.forEach((loc) => {
    const locPos = positions.locationPositions[loc.id];
    if (locPos) {
      if (locPos.x < minLocX) minLocX = locPos.x;
      if (locPos.x > maxLocX) maxLocX = locPos.x;
      if (locPos.y < minLocY) minLocY = locPos.y;
      if (locPos.y > maxLocY) maxLocY = locPos.y;
    }
  });

  const hasMultipleLocations = locations.length > 1 && isFinite(minLocX) && isFinite(maxLocX);
  const dX = hasMultipleLocations ? (maxLocX - minLocX) : 0;
  const dY = hasMultipleLocations ? (maxLocY - minLocY) : 0;

  let globalBoxWidth = 170;
  let globalBoxHeight = 120;

  if (locations.length === 1) {
    globalBoxWidth = Math.round(maxAllowedSpan * 0.5);
    globalBoxHeight = Math.round(maxAllowedSpan * 0.35);
  } else if (locations.length > 1) {
    const calcW = maxAllowedSpan - dX;
    globalBoxWidth = Math.round(Math.max(120, calcW));

    const calcH = maxAllowedSpan - dY;
    globalBoxHeight = Math.round(Math.max(90, Math.min(calcH, globalBoxWidth * 0.7)));
  }

  // Calculate dynamic 80% screen zoom scale when a location is clicked/focused
  const get80PercentZoomScale = (locId) => {
    if (!locId) return 1;

    // Expand location room box to fill up to 80% of screen viewport (width & height)
    const targetW = viewport.width * 0.8;
    const targetH = viewport.height * 0.8;

    const scaleW = targetW / (globalBoxWidth || 170);
    const scaleH = targetH / (globalBoxHeight || 120);

    const computedScale = Math.min(scaleW, scaleH);
    return Math.max(1.2, Math.min(computedScale, 5.0));
  };

  const currentScale = activeLocationMode ? get80PercentZoomScale(activeLocationMode) : 1;

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
    // Ignore clicks on object buttons or zoom status badge
    if (
      e.target.closest('.object-btn-node') ||
      e.target.closest('.object-tier-node') ||
      e.target.closest('.zoom-status-badge')
    ) {
      return;
    }

    const isInsideActiveRoomBox = e.target.closest('.location-room-box.active-zoomed');
    const isInsideAnyRoomBox = e.target.closest('.location-room-box');

    const { clientX, clientY } = getClientCoords(e);

    isBlankLongPressRef.current = false;
    blankLongPressTimerRef.current = setTimeout(() => {
      isBlankLongPressRef.current = true;
      setIsPanning(false);

      const canvasX = (clientX - (viewport.width / 2)) / currentScale - pan.x;
      const canvasY = (clientY - (viewport.height / 2)) / currentScale - pan.y;

      if (activeLocationMode && isInsideActiveRoomBox) {
        // 2. 위치모드 진입 시 위치 박스 내 사물 밖 공간 1초 꾹 누름 -> 사물 생성 모달
        if (onRequestCreateObject) {
          onRequestCreateObject({ locationId: activeLocationMode, pos: { x: canvasX, y: canvasY } });
        }
      } else if (!isInsideAnyRoomBox) {
        // 1. 위치 밖 빈화면 1초 꾹 누름 -> 위치 공간 생성 모달
        if (onRequestCreateLocation) {
          onRequestCreateLocation({ x: canvasX, y: canvasY });
        }
      }
    }, 1000); // 1.0s (1000ms) Long Press Threshold

    setIsPanning(true);
    setDragStart({ clientX, clientY, panX: pan.x, panY: pan.y });
  };

  const handleMove = (e) => {
    const { clientX, clientY } = getClientCoords(e);

    if (isPanning) {
      const dx = (clientX - dragStart.clientX) / currentScale;
      const dy = (clientY - dragStart.clientY) / currentScale;

      const movement = Math.hypot(clientX - dragStart.clientX, clientY - dragStart.clientY);
      if (movement > 5 && blankLongPressTimerRef.current) {
        clearTimeout(blankLongPressTimerRef.current);
      }

      let targetPanX = dragStart.panX + dx;
      let targetPanY = dragStart.panY + dy;

      // CLAMP PANNING: Limit canvas pan so screen cannot be dragged off into empty black space!
      if (!activeLocationMode) {
        const panLimitX = Math.max(20, viewport.width * 0.2);
        const panLimitY = Math.max(20, viewport.height * 0.2);
        targetPanX = Math.max(-panLimitX, Math.min(panLimitX, targetPanX));
        targetPanY = Math.max(-panLimitY, Math.min(panLimitY, targetPanY));
      }

      setPan({
        x: targetPanX,
        y: targetPanY
      });
    } else if (draggingNode) {
      const dx = (clientX - draggingNode.startX) / currentScale;
      const dy = (clientY - draggingNode.startY) / currentScale;

      let newX = draggingNode.initialNodeX + dx;
      let newY = draggingNode.initialNodeY + dy;

      if (draggingNode.type === 'location') {
        // ENFORCE VIEWPORT BOUNDS: Clamp Location Box position so ALL location boxes stay inside screen!
        const halfW = (globalBoxWidth || 170) / 2;
        const halfH = (globalBoxHeight || 120) / 2;

        const minX = -(viewport.width / 2) + halfW + 16;
        const maxX = (viewport.width / 2) - halfW - 16;
        const minY = -(viewport.height / 2) + halfH + 65; // navbar offset
        const maxY = (viewport.height / 2) - halfH - 16;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

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

  const handleNodeMouseDown = (e, nodeId, type, customStartPos) => {
    // RULE 1: 위치 박스의 이동은 전체 화면에서만 이동 가능, 위치 줌인 진입 시 비활성화
    if (type === 'location' && activeLocationMode !== null) {
      return;
    }

    // RULE 2: 사물 박스의 이동은 위치 줌인 진입 시에만 이동 가능, 전체 화면에서는 비활성화
    if (type === 'object' && activeLocationMode === null) {
      return;
    }

    const { clientX, clientY } = customStartPos || getClientCoords(e);

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

  const handleCanvasClick = (e) => {
    if (activeLocationMode) {
      const isInsideActiveBox = e.target.closest('.location-room-box.active-zoomed');
      const isInsideObject = e.target.closest('.object-btn-node') || e.target.closest('.object-tier-node');
      const isInsideBadge = e.target.closest('.zoom-status-badge');
      const isInsideNeighbor = e.target.closest('.location-room-box.neighbor-relation');
      const isInsideModal = e.target.closest('.modal-backdrop') || e.target.closest('.modal-content');

      if (!isInsideActiveBox && !isInsideObject && !isInsideBadge && !isInsideNeighbor && !isInsideModal) {
        if (!isBlankLongPressRef.current) {
          handleExitLocationMode();
        }
      }
    }
  };

  const activeLocObj = locations.find(l => l.id === activeLocationMode);

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
      onClick={handleCanvasClick}
    >
      {/* FLOATING ZOOM STATUS & CONTROL BADGE (WHEN ZOOMED IN AT 80%) */}
      {activeLocationMode && (
        <div className="zoom-status-badge glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-dot" style={{ backgroundColor: activeLocObj?.color || '#6366f1' }} />
            <span style={{ fontWeight: '800', fontSize: '13px' }}>{activeLocObj?.name}</span>
            <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: '700' }}>
              80% 줌인 (주변 관계 위치 표시)
            </span>
          </div>
          <button
            className="glass-btn primary"
            onClick={handleExitLocationMode}
            style={{ padding: '5px 12px', fontSize: '11px', minHeight: '28px', borderRadius: '8px' }}
          >
            전체 보기 (Reset)
          </button>
        </div>
      )}

      {/* SVG CONNECTING LINES FOR INTER-LOCATION RELATIONSHIPS */}
      <svg className="svg-layer">
        <g
          style={{
            transform: `translate(${viewport.width / 2 + pan.x * currentScale}px, ${viewport.height / 2 + pan.y * currentScale}px) scale(${currentScale})`,
            transformOrigin: '0 0',
            transition: isPanning || draggingNode ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          {locations.map((locA, idx) => {
            return locations.slice(idx + 1).map((locB) => {
              const posA = positions.locationPositions[locA.id];
              const posB = positions.locationPositions[locB.id];
              if (!posA || !posB) return null;

              const isConnectedToActive = activeLocationMode && (locA.id === activeLocationMode || locB.id === activeLocationMode);
              const pathD = getBezierPath(posA.x, posA.y, posB.x, posB.y, 0.2);

              return (
                <path
                  key={`rel-${locA.id}-${locB.id}`}
                  d={pathD}
                  stroke={isConnectedToActive ? '#818cf8' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={(isConnectedToActive ? 2.5 : 1.2) / currentScale}
                  strokeDasharray={isConnectedToActive ? `${6 / currentScale} ${4 / currentScale}` : `${4 / currentScale} ${4 / currentScale}`}
                  fill="none"
                  opacity={activeLocationMode ? (isConnectedToActive ? 0.95 : 0.25) : 0.5}
                  className={isConnectedToActive ? 'mindmap-connector flow-anim' : 'mindmap-connector'}
                />
              );
            });
          })}
        </g>
      </svg>

      {/* CANVAS NODES LAYER WITH SMOOTH 80% SCREEN ZOOM TRANSFORM */}
      <div
        className="nodes-layer"
        style={{
          transform: `translate(${viewport.width / 2 + pan.x * currentScale}px, ${viewport.height / 2 + pan.y * currentScale}px) scale(${currentScale})`,
          transformOrigin: '0 0',
          transition: isPanning || draggingNode ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {/* 1. ROOM BOX CONTAINERS (LOCATIONS) */}
        {locations.map((loc) => {
          const locPos = positions.locationPositions[loc.id] || { x: 0, y: 0 };
          const objCount = objects.filter(o => o.locationId === loc.id).length;
          const isActive = activeLocationMode === loc.id;
          const isNeighbor = activeLocationMode && activeLocationMode !== loc.id;

          return (
            <div 
              key={loc.id}
              style={{
                opacity: isNeighbor ? 0.75 : 1,
                transition: 'opacity 0.3s',
                cursor: isNeighbor ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (isNeighbor) {
                  handleEnterLocationMode(loc);
                }
              }}
            >
              <LocationNode
                location={loc}
                pos={locPos}
                objectCount={objCount}
                boxWidth={globalBoxWidth}
                boxHeight={globalBoxHeight}
                isActive={isActive}
                isNeighbor={isNeighbor}
                isOverviewMode={!activeLocationMode}
                onMouseDown={handleNodeMouseDown}
                onOpenModal={(locationObj) => onLocationClick && onLocationClick(locationObj)}
                onEnterLocationMode={(locationObj) => handleEnterLocationMode(locationObj)}
              />
            </div>
          );
        })}

        {/* OVERVIEW MODE: MINI PREVIEW CHIPS */}
        {!activeLocationMode && objects.map((objItem) => {
          const loc = locations.find(l => l.id === objItem.locationId);
          if (!loc) return null;

          if (globalBoxWidth < 100) return null;

          const objPos = positions.objectPositions[objItem.id] || { x: 0, y: 0 };

          return (
            <MiniObjectPreviewChip
              key={`mini-${objItem.id}`}
              objectItem={objItem}
              pos={objPos}
              location={loc}
              boxWidth={globalBoxWidth}
              boxHeight={globalBoxHeight}
            />
          );
        })}

        {/* ROOM ZOOMED MODE: FULL INTERACTIVE OBJECT FURNITURE NODES */}
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
              boxWidth={globalBoxWidth}
              boxHeight={globalBoxHeight}
              onMouseDown={handleNodeMouseDown}
              onOpenObjectModal={(locObj, obj) => onObjectClick && onObjectClick(locObj, obj)}
            />
          );
        })}
      </div>
    </div>
  );
}

