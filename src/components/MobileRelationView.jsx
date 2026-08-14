import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Camera
} from 'lucide-react';

export default function MobileRelationView({
  categories,
  photos,
  onReassignCategory,
  onOpenTagModal,
  currentIndex,
  setCurrentIndex
}) {
  const [lastAssigned, setLastAssigned] = useState(null);
  const longPressTimer = useRef(null);

  if (!photos || photos.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        등록된 사진이 없습니다.
      </div>
    );
  }

  const currentPhoto = photos[currentIndex] || photos[0];
  const currentCategory = categories.find(c => c.id === currentPhoto.categoryId);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTapLocation = (catId) => {
    onReassignCategory(currentPhoto.id, catId);
    const cat = categories.find(c => c.id === catId);
    setLastAssigned(cat?.name || '매칭 완료');

    setTimeout(() => {
      setLastAssigned(null);
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 250);
  };

  const handleTouchStart = (cat) => {
    longPressTimer.current = setTimeout(() => {
      onOpenTagModal(cat);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <div className="fast-matcher-container">
      {/* Stage Area */}
      <div className="matcher-stage">
        <button className="stage-arrow left" onClick={handlePrev}>
          <ChevronLeft size={22} />
        </button>

        <div className="matcher-photo-card glass-panel">
          <div className="matcher-img-wrapper">
            <img src={currentPhoto.url} alt={currentPhoto.title} />

            <div 
              className="matcher-badge"
              style={{
                background: currentCategory?.color ? `${currentCategory.color}dd` : '#6366f1'
              }}
            >
              {currentCategory?.name || '미분류'}
            </div>

            {lastAssigned && (
              <div className="matcher-toast-overlay">
                <Zap size={32} color="#f59e0b" />
                <span>{lastAssigned} 매칭!</span>
              </div>
            )}
          </div>

          <div className="matcher-info">
            <h3 className="matcher-title">{currentPhoto.title}</h3>
          </div>
        </div>

        <button className="stage-arrow right" onClick={handleNext}>
          <ChevronRight size={22} />
        </button>
      </div>

      {/* LOCATION BUTTONS */}
      <div className="matcher-touch-panel glass-panel">
        <div className="matcher-panel-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#f59e0b" />
            <span>터치하여 빠른 위치 매칭</span>
          </div>
        </div>

        <div className="matcher-buttons-grid">
          {categories.map((cat) => {
            const isSelected = currentPhoto.categoryId === cat.id;

            return (
              <div
                key={cat.id}
                className={`matcher-btn ${isSelected ? 'selected' : ''}`}
                style={{
                  borderColor: isSelected ? cat.color : 'rgba(255,255,255,0.12)',
                  background: isSelected ? `${cat.color}40` : 'rgba(255,255,255,0.06)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
                onClick={() => handleTapLocation(cat.id)}
                onTouchStart={() => handleTouchStart(cat)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={() => handleTouchStart(cat)}
                onMouseUp={handleTouchEnd}
              >
                <span className="btn-label">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
