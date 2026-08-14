import React from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Download, 
  RotateCcw, 
  FolderPlus, 
  Image as ImageIcon 
} from 'lucide-react';

export default function HeaderNav({
  searchTerm,
  setSearchTerm,
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
        <div className="logo-badge">
          🧠
        </div>
        <div>
          <h1 className="header-title">Photo Object Mindmap</h1>
          <p className="header-subtitle">
            객체별 자동 분류 & 마인드맵 드래그 앤 드롭 테스트
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="search-box">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="객체 태그, 파일명 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          className="glass-btn" 
          onClick={onResetData}
          title="샘플 사진 세트로 다시 초기화합니다"
        >
          <RotateCcw size={14} />
          샘플 데이터
        </button>

        <button 
          className="glass-btn" 
          onClick={onAddCategory}
          title="새로운 객체 카테고리를 추가합니다"
        >
          <FolderPlus size={14} />
          카테고리 추가
        </button>

        <button 
          className="glass-btn primary" 
          onClick={onUploadClick}
          title="컴퓨터의 사진 파일 업로드"
        >
          <Plus size={16} />
          사진 추가 ({photoCount})
        </button>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

        <button 
          className="glass-btn" 
          onClick={onExportPNG}
          title="현재 마인드맵을 이미지로 내보냅니다"
        >
          <Download size={14} />
          PNG 내보내기
        </button>
      </div>
    </header>
  );
}
