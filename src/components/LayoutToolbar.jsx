import React from 'react';
import { 
  Compass, 
  GitBranch, 
  Grid, 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sliders,
  FolderOpen
} from 'lucide-react';

export default function LayoutToolbar({
  layoutMode,
  setLayoutMode,
  onAutoArrange,
  zoom,
  setZoom,
  onResetZoom,
  isTrayOpen,
  setIsTrayOpen,
  unassignedCount
}) {
  return (
    <div className="floating-toolbar glass-panel">
      {/* Layout Engine Selectors */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          className={`glass-btn ${layoutMode === 'radial' ? 'primary' : ''}`}
          onClick={() => setLayoutMode('radial')}
          title="방사형 마인드맵 레이아웃"
          style={{ padding: '6px 10px', fontSize: '12px' }}
        >
          <Compass size={14} />
          방사형 (Radial)
        </button>

        <button
          className={`glass-btn ${layoutMode === 'tree' ? 'primary' : ''}`}
          onClick={() => setLayoutMode('tree')}
          title="계층형 나무 마인드맵"
          style={{ padding: '6px 10px', fontSize: '12px' }}
        >
          <GitBranch size={14} />
          계층형 (Tree)
        </button>

        <button
          className={`glass-btn ${layoutMode === 'cluster' ? 'primary' : ''}`}
          onClick={() => setLayoutMode('cluster')}
          title="클러스터 객체 군집 레이아웃"
          style={{ padding: '6px 10px', fontSize: '12px' }}
        >
          <Network size={14} />
          클러스터 (Cluster)
        </button>

        <button
          className={`glass-btn ${layoutMode === 'grid' ? 'primary' : ''}`}
          onClick={() => setLayoutMode('grid')}
          title="그리드 배열"
          style={{ padding: '6px 10px', fontSize: '12px' }}
        >
          <Grid size={14} />
          그리드 (Grid)
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Auto Arrange */}
      <button 
        className="glass-btn" 
        onClick={onAutoArrange}
        title="노드 위치 자동 정렬"
        style={{ padding: '6px 10px', fontSize: '12px' }}
      >
        <Sliders size={14} />
        자동 재정렬
      </button>

      <div className="toolbar-divider" />

      {/* Zoom Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button 
          className="glass-btn" 
          onClick={() => setZoom(z => Math.max(0.2, z - 0.15))}
          title="축소"
          style={{ padding: '6px 8px' }}
        >
          <ZoomOut size={14} />
        </button>

        <span style={{ fontSize: '12px', fontWeight: '700', minWidth: '45px', textAlign: 'center', color: '#a5b4fc' }}>
          {Math.round(zoom * 100)}%
        </span>

        <button 
          className="glass-btn" 
          onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
          title="확대"
          style={{ padding: '6px 8px' }}
        >
          <ZoomIn size={14} />
        </button>

        <button 
          className="glass-btn" 
          onClick={onResetZoom}
          title="화면 맞춤 (100%)"
          style={{ padding: '6px 8px' }}
        >
          <Maximize2 size={14} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Tray Toggle */}
      <button
        className={`glass-btn ${isTrayOpen ? 'primary' : ''}`}
        onClick={() => setIsTrayOpen(open => !open)}
        title="미분류 사진 보관함 트레이"
        style={{ padding: '6px 10px', fontSize: '12px' }}
      >
        <FolderOpen size={14} />
        보관함 ({unassignedCount})
      </button>
    </div>
  );
}
