import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Zap, 
  Tag,
  Settings,
  GripVertical
} from 'lucide-react';

export default function MobileRelationView({
  categories,
  photos,
  onReassignCategory,
  onOpenTagModal,
  onReorderCategories,
  currentIndex,
  setCurrentIndex
}) {
  const [lastAssigned, setLastAssigned] = useState(null);
  const [draggingIdx, setDraggingIdx] = useState(null);
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

  // Single Tap: Fast Match Location + Auto Advance
  const handleTapLocation = (catId) => {
    onReassignCategory(currentPhoto.id, catId);
    const cat = categories.find(c => c.id === catId);
    setLastAssigned(cat?.name || '매칭 완료');

    setTimeout(() => {
      setLastAssigned(null);
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 250);
  };

  // Long Press Touch Event Handlers
  const handleTouchStart = (cat) => {
    longPressTimer.current = setTimeout(() => {
      // Long press triggered -> Open Quick Tag modal or enable drag move!
      onOpenTagModal(cat);
    }, 500); // 500ms long press
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
              {currentCategory?.icon || '📍'} {currentCategory?.name || '미분류'}
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
            <div className="matcher-tags">
              {(currentPhoto.objects || []).map((obj, i) => (
                <span key={i} className="matcher-tag-chip">
                  #{obj}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button className="stage-arrow right" onClick={handleNext}>
          <ChevronRight size={22} />
        </button>
      </div>

      {/* LOCATION INDEX LIST BUTTONS (클릭: 매칭 / 꾹누르기: 사물태깅모달 & 이동) */}
      <div className="matcher-touch-panel glass-panel">
        <div className="matcher-panel-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#f59e0b" />
            <span>터치: 매칭 | 꾹 누르기: 사물태깅 모달</span>
          </div>
        </div>

        <div className="matcher-buttons-grid">
          {categories.map((cat, idx) => {
            const isSelected = currentPhoto.categoryId === cat.id;

            return (
              <div
                key={cat.id}
                className={`matcher-btn ${isSelected ? 'selected' : ''}`}
                style={{
                  borderColor: isSelected ? cat.color : 'rgba(255,255,255,0.12)',
                  background: isSelected ? `${cat.color}40` : 'rgba(255,255,255,0.06)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)'
                }}
                onClick={() => handleTapLocation(cat.id)}
                onTouchStart={() => handleTouchStart(cat)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={() => handleTouchStart(cat)}
                onMouseUp={handleTouchEnd}
              >
                <span className="btn-icon">{cat.icon}</span>
                <span className="btn-label">{cat.name.split(' ')[0]}</span>
                
                {/* Quick Tag Modal Trigger Button */}
                <button
                  className="glass-btn"
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    padding: '3px 6px',
                    borderRadius: '8px',
                    fontSize: '10px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTagModal(cat);
                  }}
                  title="사물 & 태깅 모달"
                >
                  <Tag size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
