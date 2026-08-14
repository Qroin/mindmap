import React from 'react';
import { X, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function PhotoTray({
  unassignedPhotos,
  isOpen,
  onClose,
  onUploadClick,
  onDragStartPhoto,
  onPhotoClick
}) {
  if (!isOpen) return null;

  return (
    <div className="photo-tray-drawer glass-panel">
      <div className="photo-tray-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#818cf8" />
          <span>미분류 사진 보관함 (드래그하여 마인드맵에 배치)</span>
        </div>
        <button 
          className="glass-btn" 
          onClick={onClose} 
          style={{ padding: '4px' }}
        >
          <X size={16} />
        </button>
      </div>

      <div className="photo-tray-content">
        {/* Upload dropzone item */}
        <div className="tray-dropzone" onClick={onUploadClick}>
          <Upload size={20} />
          <span>사진 추가</span>
        </div>

        {unassignedPhotos.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', padding: '0 20px' }}>
            모든 사진이 마인드맵에 객체별로 분류되었습니다! 🚀
          </div>
        ) : (
          unassignedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="tray-photo-item"
              draggable
              onDragStart={(e) => onDragStartPhoto(e, photo.id)}
              onClick={() => onPhotoClick(photo)}
              title={`${photo.title} (드래그하여 마인드맵으로 이동)`}
            >
              <img src={photo.url} alt={photo.title} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.7)',
                padding: '2px 4px',
                fontSize: '10px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {photo.title}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
