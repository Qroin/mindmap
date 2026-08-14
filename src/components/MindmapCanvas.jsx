import React, { useRef, useState, useEffect } from 'react';
import { RootNode, CategoryNode, PhotoNode } from './MindmapNode.jsx';
import { getBezierPath } from '../utils/layoutEngine.js';

export default function MindmapCanvas({
  categories,
  photos,
  collapsedCategories,
  setCollapsedCategories,
  positions,
  setPositions,
  zoom,
  setZoom,
  pan,
  setPan,
  searchTerm,
  onPhotoClick,
  onDeletePhoto,
  onReassignCategory,
  onFileDrop,
  onTrayDrop
}) {
  const containerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState(null); // { id, type, startX, startY, initialNodeX, initialNodeY }
  const [dragOverCategoryId, setDragOverCategoryId] = useState(null);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);

  // Filter photos by search query
  const searchLower = searchTerm.toLowerCase();
  const isSearchActive = searchLower.trim().length > 0;

  const matchesSearch = (photo) => {
    if (!isSearchActive) return false;
    const titleMatch = (photo.title || '').toLowerCase().includes(searchLower);
    const objMatch = (photo.objects || []).some(o => o.toLowerCase().includes(searchLower));
    return titleMatch || objMatch;
  };

  // Canvas Mouse Panning Handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.root-node') || e.target.closest('.category-node') || e.target.closest('.photo-card-node')) {
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

      if (draggingNode.type === 'root') {
        setPositions(prev => ({
          ...prev,
          rootPos: { x: newX, y: newY }
        }));
      } else if (draggingNode.type === 'category') {
        setPositions(prev => ({
          ...prev,
          categoryPositions: {
            ...prev.categoryPositions,
            [draggingNode.id]: { x: newX, y: newY }
          }
        }));
      } else if (draggingNode.type === 'photo') {
        setPositions(prev => ({
          ...prev,
          photoPositions: {
            ...prev.photoPositions,
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

  // Wheel Zoom Handler
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom(z => Math.max(0.2, Math.min(2.5, z * zoomFactor)));
  };

  // Node Dragging Start Handler
  const handleNodeMouseDown = (e, nodeId, type) => {
    e.stopPropagation();
    let initialX = 0;
    let initialY = 0;

    if (type === 'root') {
      initialX = positions.rootPos.x;
      initialY = positions.rootPos.y;
    } else if (type === 'category') {
      initialX = positions.categoryPositions[nodeId]?.x || 0;
      initialY = positions.categoryPositions[nodeId]?.y || 0;
    } else if (type === 'photo') {
      initialX = positions.photoPositions[nodeId]?.x || 0;
      initialY = positions.photoPositions[nodeId]?.y || 0;
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

  // HTML5 Drag & Drop Re-categorization Handlers
  const handleDragStartNode = (e, photoId) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'photo-node', photoId }));
  };

  const handleCategoryDrop = (e, categoryId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCategoryId(null);

    const rawData = e.dataTransfer.getData('text/plain');
    if (rawData) {
      try {
        const payload = JSON.parse(rawData);
        if (payload.type === 'photo-node' || payload.type === 'tray-photo') {
          onReassignCategory(payload.photoId, categoryId);
        }
      } catch (err) {
        console.error('Drag drop error', err);
      }
    }
  };

  // File Drop onto Canvas
  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    setIsDragOverCanvas(true);
  };

  const handleCanvasDragLeave = () => {
    setIsDragOverCanvas(false);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setIsDragOverCanvas(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(Array.from(e.dataTransfer.files));
    }
  };

  const toggleCategoryCollapse = (catId) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const rootPos = positions.rootPos || { x: 0, y: 0 };

  return (
    <div
      className="canvas-viewport"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onDragOver={handleCanvasDragOver}
      onDragLeave={handleCanvasDragLeave}
      onDrop={handleCanvasDrop}
    >
      {/* File Drag Overlay */}
      {isDragOverCanvas && (
        <div className="drag-overlay">
          <div style={{ fontSize: '48px' }}>🖼️</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff' }}>
            사진을 떨어뜨려 마인드맵에 추가하세요!
          </h2>
          <p style={{ color: '#a5b4fc', fontSize: '14px' }}>
            AI가 객체를 자동 분석하여 카테고리 가지에 연결합니다
          </p>
        </div>
      )}

      {/* SVG Connectors & Node Tree Container */}
      <div
        className="nodes-layer"
        style={{
          transform: `translate(${pan.x + window.innerWidth / 2}px, ${pan.y + window.innerHeight / 2}px) scale(${zoom})`
        }}
      >
        {/* SVG Bezier Connection Lines */}
        <svg className="svg-layer">
          <defs>
            <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Root to Category Lines */}
          {categories.map((cat) => {
            const catPos = positions.categoryPositions[cat.id] || { x: 0, y: 0 };
            const pathStr = getBezierPath(rootPos.x, rootPos.y, catPos.x, catPos.y, 0.4);

            return (
              <path
                key={`root-edge-${cat.id}`}
                d={pathStr}
                className="mindmap-connector flow-anim"
                stroke={cat.color || 'url(#rootGrad)'}
                strokeWidth={3 / zoom}
              />
            );
          })}

          {/* Category to Photo Card Lines */}
          {categories.map((cat) => {
            if (collapsedCategories[cat.id]) return null;

            const catPos = positions.categoryPositions[cat.id] || { x: 0, y: 0 };
            const catPhotos = photos.filter(p => p.categoryId === cat.id);

            return catPhotos.map((photo) => {
              const photoPos = positions.photoPositions[photo.id] || { x: 0, y: 0 };
              const pathStr = getBezierPath(catPos.x, catPos.y, photoPos.x, photoPos.y, 0.3);

              return (
                <path
                  key={`cat-edge-${photo.id}`}
                  d={pathStr}
                  className="mindmap-connector"
                  stroke={cat.color ? `${cat.color}77` : 'rgba(255,255,255,0.2)'}
                  strokeWidth={2 / zoom}
                />
              );
            });
          })}
        </svg>

        {/* Root Node */}
        <RootNode
          pos={rootPos}
          totalPhotos={photos.length}
          totalCategories={categories.length}
          onMouseDown={handleNodeMouseDown}
        />

        {/* Category Nodes */}
        {categories.map((cat) => {
          const catPos = positions.categoryPositions[cat.id] || { x: 0, y: 0 };
          const catPhotoCount = photos.filter(p => p.categoryId === cat.id).length;

          return (
            <CategoryNode
              key={cat.id}
              category={cat}
              pos={catPos}
              photoCount={catPhotoCount}
              isCollapsed={collapsedCategories[cat.id]}
              onToggleCollapse={toggleCategoryCollapse}
              onMouseDown={handleNodeMouseDown}
              isDragOver={dragOverCategoryId === cat.id}
              onDragOver={(id) => setDragOverCategoryId(id)}
              onDragLeave={() => setDragOverCategoryId(null)}
              onDrop={handleCategoryDrop}
            />
          );
        })}

        {/* Photo Card Nodes */}
        {categories.map((cat) => {
          if (collapsedCategories[cat.id]) return null;

          const catPhotos = photos.filter(p => p.categoryId === cat.id);

          return catPhotos.map((photo) => {
            const photoPos = positions.photoPositions[photo.id] || { x: 0, y: 0 };

            return (
              <PhotoNode
                key={photo.id}
                photo={photo}
                pos={photoPos}
                category={cat}
                isHighlighted={matchesSearch(photo)}
                onMouseDown={handleNodeMouseDown}
                onPhotoClick={onPhotoClick}
                onDeletePhoto={onDeletePhoto}
                onDragStartNode={handleDragStartNode}
              />
            );
          });
        })}
      </div>
    </div>
  );
}
