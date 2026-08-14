import React, { useState } from 'react';
import { 
  Link, 
  Unlink, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus, 
  Tag, 
  Folder, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function MobileRelationView({
  categories,
  photos,
  unassignedPhotos,
  onReassignCategory,
  onUpdatePhoto,
  onAddCategory,
  onPhotoClick
}) {
  const allPhotos = [...photos, ...unassignedPhotos];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRelationCatId, setSelectedRelationCatId] = useState(null);
  const [customRelationLabel, setCustomRelationLabel] = useState('');
  const [activeTab, setActiveTab] = useState('deck'); // 'deck' | 'grid' | 'network'

  const currentPhoto = allPhotos[currentIndex] || allPhotos[0];
  if (!currentPhoto) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        등록된 사진이 없습니다.
      </div>
    );
  }

  const currentCategory = categories.find(c => c.id === currentPhoto.categoryId);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  const handleCategorySelect = (catId) => {
    onReassignCategory(currentPhoto.id, catId);
  };

  return (
    <div className="mobile-relation-container">
      {/* Mobile Sub Header / View Tabs */}
      <div className="mobile-tab-bar">
        <button 
          className={`mobile-tab-btn ${activeTab === 'deck' ? 'active' : ''}`}
          onClick={() => setActiveTab('deck')}
        >
          <Layers size={16} />
          관계 덱 (Deck)
        </button>
        <button 
          className={`mobile-tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
          onClick={() => setActiveTab('grid')}
        >
          <Folder size={16} />
          그룹별 관계
        </button>
      </div>

      {activeTab === 'deck' ? (
        /* DECK VIEW: Thumb-first card swipe & 1-tap relationship mapping */
        <div className="mobile-deck-layout">
          {/* Card Carousel Frame */}
          <div className="mobile-card-carousel">
            <button className="carousel-arrow left" onClick={handlePrev}>
              <ChevronLeft size={20} />
            </button>

            <div className="mobile-photo-card glass-panel">
              <div className="mobile-card-img-wrapper" onClick={() => onPhotoClick(currentPhoto)}>
                <img src={currentPhoto.url} alt={currentPhoto.title} />
                
                {/* Current Category Badge */}
                <div 
                  className="mobile-category-pill"
                  style={{
                    background: currentCategory?.color ? `${currentCategory.color}dd` : '#6366f1'
                  }}
                >
                  {currentCategory?.icon || '📦'} {currentCategory?.name || '미분류'}
                </div>

                <div className="mobile-index-counter">
                  {currentIndex + 1} / {allPhotos.length}
                </div>
              </div>

              <div className="mobile-card-info">
                <h3 className="mobile-card-title">{currentPhoto.title}</h3>
                
                <div className="mobile-tags-row">
                  {(currentPhoto.objects || []).map((obj, i) => (
                    <span key={i} className="mobile-tag-chip">
                      #{obj}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button className="carousel-arrow right" onClick={handleNext}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Quick Relationship Touch Bar (Thumb Zone) */}
          <div className="mobile-thumb-panel glass-panel">
            <div className="thumb-panel-label">
              <Sparkles size={14} color="#818cf8" />
              <span>터치하여 객체 관계 연결 (1-Tap Relation)</span>
            </div>

            <div className="mobile-category-chips-grid">
              {categories.map((cat) => {
                const isSelected = currentPhoto.categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={`mobile-chip-btn ${isSelected ? 'selected' : ''}`}
                    style={{
                      borderColor: isSelected ? cat.color : 'rgba(255,255,255,0.1)',
                      background: isSelected ? `${cat.color}33` : 'rgba(255,255,255,0.05)',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)'
                    }}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                    <span>{cat.name.split(' ')[0]}</span>
                    {isSelected && <Check size={14} color={cat.color} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* GRID VIEW: Category Pillars for easy mobile scanning */
        <div className="mobile-pillars-layout">
          {categories.map((cat) => {
            const catPhotos = photos.filter(p => p.categoryId === cat.id);

            return (
              <div key={cat.id} className="mobile-pillar-card glass-panel">
                <div className="pillar-header" style={{ borderLeftColor: cat.color }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                    <span className="pillar-title">{cat.name}</span>
                  </div>
                  <span className="pillar-count">{catPhotos.length}장</span>
                </div>

                <div className="pillar-photos-scroll">
                  {catPhotos.length === 0 ? (
                    <div className="pillar-empty">사진을 이 그룹으로 드래그하거나 터치하여 연결하세요</div>
                  ) : (
                    catPhotos.map((photo) => (
                      <div 
                        key={photo.id} 
                        className="pillar-photo-thumb"
                        onClick={() => onPhotoClick(photo)}
                      >
                        <img src={photo.url} alt={photo.title} />
                        <div className="pillar-photo-label">{photo.title}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
