import React, { useRef, useState } from 'react';

/* 1ST-LEVEL ROOM BOX CONTAINER (PURE TEXT LOCATION ROOM WITH CENTERED TITLE & WALL HEADER) */
export function LocationNode({
  location,
  pos,
  objectCount,
  onMouseDown,
  onOpenModal,
  onEnterLocationMode,
  boxWidth,
  boxHeight,
  isActive,
  isNeighbor,
  isOverviewMode
}) {
  const [isDragReady, setIsDragReady] = useState(false);
  const timerRef = useRef(null);
  const isLongPressedRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const getClientCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handleStart = (e) => {
    isLongPressedRef.current = false;
    const { clientX, clientY } = getClientCoords(e);
    startPosRef.current = { x: clientX, y: clientY };

    // RULE 1: 위치 박스 이동은 전체 보기(Overview Mode)에서만 가능, 줌인 진입 시 비활성화
    if (!isOverviewMode) {
      return;
    }

    // 500ms (0.5s) Long-Press threshold for location box dragging in Overview Mode
    timerRef.current = setTimeout(() => {
      isLongPressedRef.current = true;
      setIsDragReady(true);
      if (onMouseDown) {
        onMouseDown(e, location.id, 'location', startPosRef.current);
      }
    }, 500);
  };

  const handleMove = (e) => {
    if (!isLongPressedRef.current && timerRef.current) {
      const { clientX, clientY } = getClientCoords(e);
      const dist = Math.hypot(clientX - startPosRef.current.x, clientY - startPosRef.current.y);
      if (dist > 5) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleEnd = (e) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsDragReady(false);
  };

  const handleClick = (e) => {
    if (!isLongPressedRef.current) {
      e.stopPropagation();
      onEnterLocationMode(location);
    }
  };

  return (
    <div
      className={`location-room-box ${isDragReady ? 'drag-active' : ''} ${isActive ? 'active-zoomed' : ''} ${isNeighbor ? 'neighbor-relation' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: boxWidth ? `${boxWidth}px` : undefined,
        height: boxHeight ? `${boxHeight}px` : undefined,
        borderColor: isDragReady
          ? '#f59e0b'
          : isActive
          ? '#818cf8'
          : location.color
          ? `${location.color}cc`
          : undefined,
        boxShadow: isDragReady
          ? '0 0 40px #f59e0b'
          : isActive
          ? `0 0 45px ${location.color || '#6366f1'}88`
          : location.color
          ? `0 0 30px ${location.color}44`
          : undefined
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onClick={handleClick}
      title={isNeighbor ? "클릭: 위치 줌인 | 0.5초 꾹 누르기: 위치 이동" : "터치: 위치 줌인 | 0.5초 꾹 누르기: 위치 이동"}
    >
      {/* 1. Zoomed Mode: Top Wall Header */}
      {isActive && (
        <div className="room-wall-header">
          <span className="room-wall-title" style={{ color: location.color || '#ffffff' }}>
            {location.name}
          </span>
        </div>
      )}

      {/* 2. Overview Mode: Centered Location Title Label Pill (Front & Center Title) */}
      {!isActive && (
        <div
          className="room-centered-label"
          style={{
            background: location.color
              ? `linear-gradient(135deg, ${location.color} 0%, rgba(30, 41, 59, 0.95) 100%)`
              : undefined
          }}
        >
          <span className="room-title">{location.name}</span>
          {isNeighbor && (
            <span className="neighbor-tag">관계 위치</span>
          )}
        </div>
      )}
    </div>
  );
}

/* 2ND-LEVEL OBJECT NODE (PROPORTIONALLY SCALED BUTTON STYLE CHIP WITH DYNAMIC FONT SHRINKING) */
export function ObjectNode({
  objectItem,
  pos,
  location,
  boxWidth = 170,
  boxHeight = 120,
  onMouseDown,
  onOpenObjectModal
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const timerRef = useRef(null);
  const isLongPressedRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Proportional Object Box Sizing based on parent Location Box ratio
  const objWidth = Math.round(Math.max(54, Math.min(180, boxWidth * 0.42)));
  const objHeight = Math.round(Math.max(26, Math.min(56, boxHeight * 0.28)));

  // Dynamic Font Size Shrinking logic (글자 크기 자동 조절)
  const nameText = objectItem?.name || '';
  const charCount = nameText.length || 1;
  const baseFontSize = Math.round(objHeight * 0.38);

  // Calculate font size that fits without overflowing
  const calculatedFontSize = Math.max(
    8,
    Math.min(baseFontSize, Math.floor((objWidth - 12) / (charCount * 0.75)))
  );

  const getClientCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handleStart = (e) => {
    isLongPressedRef.current = false;
    const { clientX, clientY } = getClientCoords(e);
    startPosRef.current = { x: clientX, y: clientY };

    // 500ms (0.5s) Long-Press threshold to initiate position dragging inside the box
    timerRef.current = setTimeout(() => {
      isLongPressedRef.current = true;
      setIsDragActive(true);
      if (onMouseDown) {
        onMouseDown(e, objectItem.id, 'object', startPosRef.current);
      }
    }, 500);
  };

  const handleMove = (e) => {
    if (!isLongPressedRef.current && timerRef.current) {
      const { clientX, clientY } = getClientCoords(e);
      const dist = Math.hypot(clientX - startPosRef.current.x, clientY - startPosRef.current.y);
      if (dist > 5) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsDragActive(false);
  };

  const handleClick = (e) => {
    if (!isLongPressedRef.current && onOpenObjectModal) {
      e.stopPropagation();
      onOpenObjectModal(location, objectItem);
    }
  };

  return (
    <button
      type="button"
      className={`object-btn-node ${isDragActive ? 'drag-active' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${objWidth}px`,
        height: `${objHeight}px`,
        padding: '2px 6px',
        borderColor: isDragActive
          ? '#f59e0b'
          : location?.color
          ? `${location.color}dd`
          : 'rgba(129, 140, 248, 0.6)',
        boxShadow: isDragActive
          ? '0 0 25px #f59e0b'
          : location?.color
          ? `0 4px 16px ${location.color}44`
          : '0 4px 16px rgba(99, 102, 241, 0.3)'
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onClick={handleClick}
      title="단순 클릭: 모달창 띄우기 | 꾹 누르기: 사물 위치 이동"
    >
      <span
        className="object-btn-name"
        style={{
          fontSize: `${calculatedFontSize}px`,
          lineHeight: '1.2',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          display: 'inline-block'
        }}
      >
        {nameText}
      </span>
    </button>
  );
}

/* MINI PREVIEW CHIP (READ-ONLY IN OVERVIEW MODE) */
export function MiniObjectPreviewChip({ objectItem, pos, location, boxWidth = 170, boxHeight = 120 }) {
  const shortText = (objectItem.name || '').slice(0, 3);
  const chipWidth = Math.round(Math.max(28, Math.min(50, boxWidth * 0.22)));
  const chipHeight = Math.round(Math.max(16, Math.min(26, boxHeight * 0.16)));
  const fontSize = Math.max(8, Math.min(10, Math.floor(chipHeight * 0.55)));

  return (
    <div
      className="mini-preview-chip"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${chipWidth}px`,
        height: `${chipHeight}px`,
        fontSize: `${fontSize}px`,
        borderColor: location?.color ? `${location.color}55` : 'rgba(255,255,255,0.12)'
      }}
    >
      <span>{shortText}</span>
    </div>
  );
}
