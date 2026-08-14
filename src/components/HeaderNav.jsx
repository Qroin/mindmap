import React from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  RotateCcw, 
  FolderPlus, 
  Smartphone,
  Compass
} from 'lucide-react';

export default function HeaderNav({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  onResetData,
  onAddCategory,
  onUploadClick,
  onExportJSON,
  onExportPNG,
  photoCount,
  categoryCount
}) {
  return (
    <header className="header-nav">
      {/* Title & Brand Logo */}
      <div className="header-title-group">
        <div className="logo-badge">🧠</div>
        <div>
          <h1 className="header-title">Photo Relation App</h1>
          <p className="header-subtitle">사진 객체 관계화 & 터치 UX</p>
        </div>
      </div>

      {/* View Mode Switcher (Mobile Relation vs Mindmap View) */}
      <div className="view-mode-toggle">
        <button
          className={`view-toggle-btn ${viewMode === 'mobile-relation' ? 'active' : ''}`}
          onClick={() => setViewMode('mobile-relation')}
          title="모바일 관계화 뷰 (터치 최적화)"
        >
          <Smartphone size={15} />
          관계 매핑
        </button>

        <button
          className={`view-toggle-btn ${viewMode === 'mindmap' ? 'active' : ''}`}
          onClick={() => setViewMode('mindmap')}
          title="데스크톱 마인드맵 캔버스"
        >
          <Compass size={15} />
          마인드맵
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="search-box">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="객체, 파일명 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="glass-btn" onClick={onResetData} title="샘플 데이터 초기화">
          <RotateCcw size={14} />
          초기화
        </button>

        <button className="glass-btn" onClick={onAddCategory} title="카테고리 추가">
          <FolderPlus size={14} />
          카테고리
        </button>

        <button className="glass-btn primary" onClick={onUploadClick} title="사진 업로드">
          <Plus size={16} />
          사진 추가 ({photoCount})
        </button>
      </div>
    </header>
  );
}
