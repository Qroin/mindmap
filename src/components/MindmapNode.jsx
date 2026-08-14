import React, { useRef, useState } from 'react';
import { Tag } from 'lucide-react';

/* 1ST-LEVEL ROOM BOX CONTAINER (CENTERED LOCATION NAME BUTTON) */
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
      {/* Centered Streamlined Location Name Button */}
      <div 
        className="room-centered-label"
        onClick={(e) => {
          e.stopPropagation();
          onEnterLocationMode(location);
        }}
        title="터치하여 방 진입"
      >
        <span className="room-icon">{location.icon}</span>
        <span className="room-title">{location.name}</span>
      </div>
    </div>
  );
}

/* 2ND-LEVEL OBJECT NODE */
export function ObjectNode({ objectItem, pos, location, featureCount, onMouseDown, onOpenObjectModal }) {
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

    if (!isLongPressedRef.current) {
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
      title="드래그하여 가구배치 이동 | 클릭시 태그 설정"
    >
      <span className="object-tier-icon">{objectItem.icon}</span>
      <span className="object-tier-name">{objectItem.name}</span>
      <span 
        className="object-tier-count"
        style={{
          background: location?.color ? `${location.color}40` : 'rgba(255,255,255,0.15)',
          color: location?.color || '#a5b4fc'
        }}
      >
        {featureCount}
      </span>
    </div>
  );
}

/* MINI 3-LETTER SQUARE PREVIEW CHIP (READ-ONLY IN OVERVIEW MODE) */
export function MiniObjectPreviewChip({ objectItem, pos, location }) {
  const rawText = (objectItem.name || '').replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
  const shortText = rawText.slice(0, 3) || objectItem.name.slice(0, 3);

  return (
    <div
      className="mini-preview-chip"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: location?.color ? `${location.color}55` : 'rgba(255,255,255,0.12)'
      }}
    >
      <span style={{ fontSize: '11px' }}>{objectItem.icon}</span>
      <span>{shortText}</span>
    </div>
  );
}

/* 3RD-LEVEL FEATURE PILL NODE */
export function FeaturePillNode({ feature, pos, location, isHighlighted, onMouseDown, onHover, onHoverLeave }) {
  const timerRef = useRef(null);

  const handleStart = (e) => {
    timerRef.current = setTimeout(() => {
      onMouseDown(e, feature.id, 'feature');
    }, 220);
  };

  const handleEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div
      className={`feature-tier-node ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: location?.color ? `${location.color}66` : 'rgba(255,255,255,0.15)',
        boxShadow: location?.color ? `0 0 14px ${location.color}25` : undefined
      }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseEnter={() => onHover && onHover(feature.id)}
      onMouseLeave={() => onHoverLeave && onHoverLeave()}
    >
      <Tag size={11} color={location?.color || '#a5b4fc'} style={{ flexShrink: 0 }} />
      <span className="feature-tier-name">{feature.name}</span>
    </div>
  );
}
