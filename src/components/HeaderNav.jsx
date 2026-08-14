import React from 'react';
import { Smartphone, Compass, Settings, RotateCcw } from 'lucide-react';

export default function HeaderNav({
  viewMode,
  setViewMode,
  onResetData,
  onOpenLocationList
}) {
  if (viewMode === 'mindmap') {
    // 100% Fullscreen mindmap mode with floating corner toggle
    return (
      <div 
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 50,
          display: 'flex',
          gap: '8px'
        }}
      >
        <button
          className="glass-btn primary"
          onClick={() => setViewMode('mobile-relation')}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)'
          }}
        >
          <Smartphone size={14} />
          관계 매핑으로 이동
        </button>

        <button
          className="glass-btn"
          onClick={onResetData}
          style={{ padding: '8px' }}
          title="초기화"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    );
  }

  // Relation Mapping mode header with top-right Location List Settings button
  return (
    <header className="header-nav" style={{ padding: '10px 16px', minHeight: '52px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '18px' }}>⚡</span>
        <span style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>목차 태깅 & 매칭</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Top-Right Location List Settings Button */}
        <button
          className="glass-btn"
          onClick={onOpenLocationList}
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          <Settings size={14} />
          위치 List 설정
        </button>

        <button
          className="glass-btn primary"
          onClick={() => setViewMode('mindmap')}
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          <Compass size={14} />
          마인드맵 전체화면
        </button>
      </div>
    </header>
  );
}
