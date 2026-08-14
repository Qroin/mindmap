import React from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  GripVertical, 
  Tag, 
  Trash2,
  Move
} from 'lucide-react';

export function RootNode({ pos, totalPhotos, totalCategories, onMouseDown }) {
  return (
    <div
      className="root-node"
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      onMouseDown={(e) => onMouseDown(e, 'root')}
    >
      <div className="root-icon">🧠</div>
      <div>
        <div className="root-title">Photo MindMap</div>
        <div className="root-stats">
          {totalCategories}개 객체 • {totalPhotos}장 사진
        </div>
      </div>
    </div>
  );
}

export function CategoryNode({
  category,
  pos,
  photoCount,
  isCollapsed,
  onToggleCollapse,
  onMouseDown,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop
}) {
  return (
    <div
      className={`category-node ${isDragOver ? 'drag-over' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: category.color ? `${category.color}80` : undefined,
        boxShadow: category.color ? `0 0 20px ${category.color}33` : undefined
      }}
      onMouseDown={(e) => onMouseDown(e, category.id, 'category')}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(category.id);
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, category.id)}
    >
      <div 
        className="category-icon"
        style={{
          background: category.color ? `${category.color}22` : 'transparent',
          padding: '4px 8px',
          borderRadius: '10px'
        }}
      >
        {category.icon || '📁'}
      </div>

      <div>
        <div className="category-name">{category.name}</div>
      </div>

      <span 
        className="category-badge"
        style={{
          background: category.color ? `${category.color}33` : undefined,
          color: category.color || '#fff'
        }}
      >
        {photoCount}
      </span>

      <button
        className="category-toggle-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggleCollapse(category.id);
        }}
        title={isCollapsed ? "펼치기" : "접기"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
      </button>
    </div>
  );
}

export function PhotoNode({
  photo,
  pos,
  category,
  isHighlighted,
  onMouseDown,
  onPhotoClick,
  onDeletePhoto,
  onDragStartNode
}) {
  return (
    <div
      className={`photo-card-node ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        borderColor: category?.color ? `${category.color}55` : undefined
      }}
      draggable
      onDragStart={(e) => onDragStartNode(e, photo.id)}
      onMouseDown={(e) => onMouseDown(e, photo.id, 'photo')}
    >
      {/* Photo Thumbnail */}
      <div className="photo-thumb-wrapper">
        <img
          src={photo.url}
          alt={photo.title}
          className="photo-thumb-img"
          loading="lazy"
        />

        {/* Hover Action Overlay */}
        <div className="photo-overlay-actions">
          <button
            className="glass-btn"
            style={{ padding: '6px', borderRadius: '50%' }}
            onClick={(e) => {
              e.stopPropagation();
              onPhotoClick(photo);
            }}
            title="상세보기"
          >
            <Eye size={14} />
          </button>
          <button
            className="glass-btn"
            style={{ padding: '6px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.6)' }}
            onClick={(e) => {
              e.stopPropagation();
              onDeletePhoto(photo.id);
            }}
            title="삭제"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="photo-card-body">
        <div className="photo-card-title">{photo.title}</div>
        
        <div className="photo-tags-container">
          {(photo.objects || []).slice(0, 3).map((obj, idx) => (
            <span 
              key={idx} 
              className="object-tag-pill"
              style={{
                background: category?.color ? `${category.color}22` : undefined,
                color: category?.color || '#a5b4fc'
              }}
            >
              #{obj}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
