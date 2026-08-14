import React, { useRef, useState } from 'react';
import { LocationNode, ObjectNode, FeaturePillNode } from './MindmapNode.jsx';
import { getBezierPath } from '../utils/layoutEngine.js';

export default function MindmapCanvas({
  locations,
  objects,
  features,
  positions,
  setPositions,
  zoom,
  setZoom,
  pan,
  setPan,
  searchTerm,
  onLocationClick
}) {
  const containerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const searchLower = searchTerm.toLowerCase().trim();
  const isSearchActive = searchLower.length > 0;

  const matchesSearch = (feat) => {
    if (!isSearchActive) return false;
    return feat.name.toLowerCase().includes(searchLower);
  };

  // Pan Handlers
  const handleMouseDown = (e) => {
    if (
      e.target.closest('.location-tier-node') ||
      e.target.closest('.object-tier-node') ||
      e.target.closest('.feature-tier-node')
    ) {
      return;
    }
    setIsPanning(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (draggingNode) {
      const dx = (e.clientX - draggingNode.startX) / zoom;
      const dy = (e.clientY - draggingNode.startY) / zoom;

      const newX = draggingNode.initialNodeX + dx;
      const newY = draggingNode.initialNodeY + dy;

      if (draggingNode.type === 'location') {
        setPositions(prev => ({
          ...prev,
          locationPositions: {
            ...prev.locationPositions,
            [draggingNode.id]: { ...prev.locationPositions[draggingNode.id], x: newX, y: newY }
          }
        }));
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

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNode(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom(z => Math.max(0.2, Math.min(2.5, z * zoomFactor)));
  };

  const handleNodeMouseDown = (e, nodeId, type) => {
    e.stopPropagation();
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
      startX: e.clientX,
      startY: e.clientY,
      initialNodeX: initialX,
      initialNodeY: initialY
    });
  };

  return (
    <div
      className="canvas-viewport"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <div
        className="nodes-layer"
        style={{
          transform: `translate(${pan.x + window.innerWidth / 2}px, ${pan.y + window.innerHeight / 2}px) scale(${zoom})`
        }}
      >
        {/* SVG Concentric Bezier Connections */}
        <svg className="svg-layer">
          <defs>
            <linearGradient id="domainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* 1. Location (R1) -> Object (R2) Lines */}
          {locations.map((loc) => {
            const locPos = positions.locationPositions[loc.id] || { x: 0, y: 0 };
            const locObjs = objects.filter(o => o.locationId === loc.id);

            return locObjs.map((objItem) => {
              const objPos = positions.objectPositions[objItem.id] || { x: 0, y: 0 };
              const pathStr = getBezierPath(locPos.x, locPos.y, objPos.x, objPos.y, 0.4);
              const isHovered = hoveredNodeId === loc.id || hoveredNodeId === objItem.id;

              return (
                <path
                  key={`loc-obj-${objItem.id}`}
                  d={pathStr}
                  className="mindmap-connector flow-anim"
                  stroke={isHovered ? '#6366f1' : (loc.color || 'url(#domainGrad)')}
                  strokeWidth={(isHovered ? 4 : 2.5) / zoom}
                />
              );
            });
          })}

          {/* 2. Object (R2) -> Feature Attribute (R3) Lines */}
          {objects.map((objItem) => {
            const loc = locations.find(l => l.id === objItem.locationId);
            const objPos = positions.objectPositions[objItem.id] || { x: 0, y: 0 };
            const objFeats = features.filter(f => f.objectId === objItem.id);

            return objFeats.map((feat) => {
              const featPos = positions.featurePositions[feat.id] || { x: 0, y: 0 };
              const pathStr = getBezierPath(objPos.x, objPos.y, featPos.x, featPos.y, 0.3);
              const isHovered = hoveredNodeId === objItem.id || hoveredNodeId === feat.id;

              return (
                <path
                  key={`obj-feat-${feat.id}`}
                  d={pathStr}
                  className="mindmap-connector"
                  stroke={isHovered ? '#818cf8' : (loc?.color ? `${loc.color}77` : 'rgba(255,255,255,0.25)')}
                  strokeWidth={(isHovered ? 3 : 1.5) / zoom}
                />
              );
            });
          })}
        </svg>

        {/* 1. INNER CORE TIER: LOCATION NODES (위치 기반 1차 대분류 - 클릭 시 모달 오픈) */}
        {locations.map((loc) => {
          const locPos = positions.locationPositions[loc.id] || { x: 0, y: 0 };
          const objCount = objects.filter(o => o.locationId === loc.id).length;

          return (
            <div 
              key={loc.id}
              onClick={(e) => {
                e.stopPropagation();
                onLocationClick && onLocationClick(loc);
              }}
            >
              <LocationNode
                location={loc}
                pos={locPos}
                objectCount={objCount}
                onMouseDown={handleNodeMouseDown}
              />
            </div>
          );
        })}

        {/* 2. MIDDLE TIER: OBJECT NODES (사물 기반 중분류) */}
        {objects.map((objItem) => {
          const loc = locations.find(l => l.id === objItem.locationId);
          const objPos = positions.objectPositions[objItem.id] || { x: 0, y: 0 };
          const featCount = features.filter(f => f.objectId === objItem.id).length;

          return (
            <ObjectNode
              key={objItem.id}
              objectItem={objItem}
              pos={objPos}
              location={loc}
              featureCount={featCount}
              onMouseDown={handleNodeMouseDown}
            />
          );
        })}

        {/* 3. OUTER TIER: FEATURE PILL NODES (특징/감성 기반 소분류) */}
        {features.map((feat) => {
          const objItem = objects.find(o => o.id === feat.objectId);
          const loc = locations.find(l => l.id === objItem?.locationId);
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
