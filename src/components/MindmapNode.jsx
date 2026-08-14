import React, { useRef, useState } from 'react';
import { Tag } from 'lucide-react';

/* INNER CORE: LOCATION NODE */
export function LocationNode({ location, pos, objectCount, onMouseDown, onOpenModal }) {
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
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isLongPressedRef.current) {
      onOpenModal(location);
    }
    setIsDragReady(false);
  };

  return (
    <div
      className={`location-tier-node ${isDragReady ? 'drag-active' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: isDragReady ? '#f59e0b' : (location.color ? `${location.color}bb` : undefined),
        boxShadow: isDragReady ? '0 0 40px #f59e0b' : (location.color ? `0 0 35px ${location.color}55` : undefined)
      }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <div 
        className="location-icon"
        style={{
          background: location.color ? `${location.color}30` : 'transparent'
        }}
      >
        {location.icon}
      </div>

      <div>
        <div className="location-title">{location.name}</div>
        <div className="location-subtitle">{objectCount}개 사물 그룹</div>
      </div>
    </div>
  );
}

/* MIDDLE TIER: OBJECT NODE (Click -> Opens Central Tagging Modal) */
export function ObjectNode({ objectItem, pos, location, featureCount, onMouseDown, onOpenObjectModal }) {
  const timerRef = useRef(null);
  const isLongPressedRef = useRef(false);

  const handleStart = (e) => {
    isLongPressedRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressedRef.current = true;
      onMouseDown(e, objectItem.id, 'object');
    }, 280);
  };

  const handleEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!isLongPressedRef.current) {
      onOpenObjectModal(location, objectItem);
    }
  };

  return (
    <div
      className="object-tier-node"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: location?.color ? `${location.color}88` : 'rgba(255,255,255,0.2)',
        boxShadow: location?.color ? `0 0 20px ${location.color}33` : undefined
      }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <span className="object-tier-icon">{objectItem.icon}</span>
      <span className="object-tier-name">{objectItem.name}</span>
      <span 
        className="object-tier-count"
        style={{
          background: location?.color ? `${location.color}33` : 'rgba(255,255,255,0.1)',
          color: location?.color || '#a5b4fc'
        }}
      >
        {featureCount}
      </span>
    </div>
  );
}

/* OUTER TIER: FEATURE PILL NODE */
export function FeaturePillNode({ feature, pos, location, isHighlighted, onMouseDown, onHover, onHoverLeave }) {
  const timerRef = useRef(null);

  const handleStart = (e) => {
    timerRef.current = setTimeout(() => {
      onMouseDown(e, feature.id, 'feature');
    }, 280);
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
      <Tag size={12} color={location?.color || '#a5b4fc'} style={{ flexShrink: 0 }} />
      <span className="feature-tier-name">{feature.name}</span>
      {feature.tagType && (
        <span className="feature-type-badge">{feature.tagType}</span>
      )}
    </div>
  );
}
