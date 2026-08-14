import React from 'react';
import { Tag, MapPin, Package, Sparkles } from 'lucide-react';

/* INNER CORE: LOCATION NODE (안쪽 대분류 - 위치) */
export function LocationNode({ location, pos, objectCount, onMouseDown }) {
  return (
    <div
      className="location-tier-node"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: location.color ? `${location.color}bb` : undefined,
        boxShadow: location.color ? `0 0 35px ${location.color}55` : undefined
      }}
      onMouseDown={(e) => onMouseDown(e, location.id, 'location')}
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

/* MIDDLE TIER: OBJECT NODE (중간 계층 - 사물) */
export function ObjectNode({ objectItem, pos, location, featureCount, onMouseDown }) {
  return (
    <div
      className="object-tier-node"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: location?.color ? `${location.color}88` : 'rgba(255,255,255,0.2)',
        boxShadow: location?.color ? `0 0 20px ${location.color}33` : undefined
      }}
      onMouseDown={(e) => onMouseDown(e, objectItem.id, 'object')}
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

/* OUTER TIER: FEATURE / ATTRIBUTE PILL NODE (외곽 계층 - 특징/감성/속성) */
export function FeaturePillNode({ feature, pos, location, isHighlighted, onMouseDown, onHover, onHoverLeave }) {
  return (
    <div
      className={`feature-tier-node ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: location?.color ? `${location.color}66` : 'rgba(255,255,255,0.15)',
        boxShadow: location?.color ? `0 0 14px ${location.color}25` : undefined
      }}
      onMouseDown={(e) => onMouseDown(e, feature.id, 'feature')}
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
