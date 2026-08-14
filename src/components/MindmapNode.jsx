import React, { useRef, useState } from 'react';

/* 1ST-LEVEL ROOM BOX CONTAINER (ICON-FREE PURE TEXT) */
export function LocationNode({ location, pos, objectCount, onMouseDown, onOpenModal, onEnterLocationMode }) {
  const [isDragReady, setIsDragReady] = useState(false);
  const timerRef = useRef(null);
  const isLongPressedRef = useRef(false);

  const handleStart = (e) => {
    isLongPressedRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressedRef.current = true;
      setIsDragReady(true);
      onMouseDown(e, location.id, 'location');
    }, 320);
  };

  const handleEnd = (e) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsDragReady(false);
  };

  return (
    <div
      className={`location-room-box ${isDragReady ? 'drag-active' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: isDragReady ? '#f59e0b' : (location.color ? `${location.color}bb` : undefined),
        boxShadow: isDragReady ? '0 0 40px #f59e0b' : (location.color ? `0 0 30px ${location.color}44` : undefined)
      }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      {/* Centered Pure Text Location Name Button */}
      <div 
        className="room-centered-label"
        onClick={(e) => {
          e.stopPropagation();
          onEnterLocationMode(location);
        }}
        title="터치하여 방 진입"
      >
        <span className="room-title">{location.name}</span>
      </div>
    </div>
  );
}

/* 2ND-LEVEL OBJECT NODE (ICON-FREE PURE TEXT) */
export function ObjectNode({ objectItem, pos, location, onMouseDown, onOpenObjectModal }) {
  const timerRef = useRef(null);
  const isLongPressedRef = useRef(false);

  const handleStart = (e) => {
    isLongPressedRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressedRef.current = true;
      onMouseDown(e, objectItem.id, 'object');
    }, 220);
  };

  const handleEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!isLongPressedRef.current && onOpenObjectModal) {
      onOpenObjectModal(location, objectItem);
    }
  };

  return (
    <div
      className="object-tier-node furniture-style"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: location?.color ? `${location.color}aa` : 'rgba(255,255,255,0.25)',
        boxShadow: location?.color ? `0 4px 18px ${location.color}33` : undefined
      }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      title="드래그하여 방 내 가구배치 이동"
    >
      <span className="object-tier-name">{objectItem.name}</span>
    </div>
  );
}

/* MINI 3-LETTER SQUARE PREVIEW CHIP (PURE TEXT, ICON-FREE) */
export function MiniObjectPreviewChip({ objectItem, pos, location }) {
  const shortText = (objectItem.name || '').slice(0, 3);

  return (
    <div
      className="mini-preview-chip"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: location?.color ? `${location.color}55` : 'rgba(255,255,255,0.12)'
      }}
    >
      <span>{shortText}</span>
    </div>
  );
}
