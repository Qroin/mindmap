import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import HeaderNav from './components/HeaderNav.jsx';
import LayoutToolbar from './components/LayoutToolbar.jsx';
import MindmapCanvas from './components/MindmapCanvas.jsx';
import MobileRelationView from './components/MobileRelationView.jsx';
import PhotoDetailModal from './components/PhotoDetailModal.jsx';
import CategoryModal from './components/CategoryModal.jsx';

import { LOCATION_CATEGORIES, OBJECT_NODES, FEATURE_ATTRIBUTES, INITIAL_PHOTOS } from './utils/sampleData.js';
import { calculateDomain3TierPositions } from './utils/layoutEngine.js';

export default function App() {
  const [viewMode, setViewMode] = useState('mindmap'); // Default to domain mindmap view

  // 3-Tier Domain State
  const [locations, setLocations] = useState(LOCATION_CATEGORIES);
  const [objects, setObjects] = useState(OBJECT_NODES);
  const [features, setFeatures] = useState(FEATURE_ATTRIBUTES);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);

  const [layoutMode, setLayoutMode] = useState('radial');
  const [positions, setPositions] = useState({ locationPositions: {}, objectPositions: {}, featurePositions: {} });
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleAutoArrange = () => {
    const newPos = calculateDomain3TierPositions(locations, objects, features);
    setPositions(newPos);
  };

  useEffect(() => {
    handleAutoArrange();
  }, [locations.length, objects.length, features.length]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#3b82f6']
      });
    } catch (e) {}
  };

  const handleResetData = () => {
    setLocations(LOCATION_CATEGORIES);
    setObjects(OBJECT_NODES);
    setFeatures(FEATURE_ATTRIBUTES);
    setPhotos(INITIAL_PHOTOS);
    setZoom(0.85);
    setPan({ x: 0, y: 0 });
    const newPos = calculateDomain3TierPositions(LOCATION_CATEGORIES, OBJECT_NODES, FEATURE_ATTRIBUTES);
    setPositions(newPos);
  };

  const handleAddCategory = (newCategory) => {
    setLocations(prev => [...prev, newCategory]);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ locations, objects, features, photos }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "domain-hierarchy-export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="app-container">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        accept="image/*"
      />

      <HeaderNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetData={handleResetData}
        onAddCategory={() => setIsCategoryModalOpen(true)}
        onUploadClick={() => fileInputRef.current?.click()}
        onExportJSON={handleExportJSON}
        onExportPNG={handleExportJSON}
        photoCount={photos.length}
        categoryCount={locations.length}
      />

      {viewMode === 'mobile-relation' ? (
        <MobileRelationView
          categories={locations}
          photos={photos}
          unassignedPhotos={[]}
          onReassignCategory={() => {}}
          onUpdatePhoto={() => {}}
          onAddCategory={() => setIsCategoryModalOpen(true)}
          onPhotoClick={(photo) => setSelectedPhoto(photo)}
        />
      ) : (
        <>
          <MindmapCanvas
            locations={locations}
            objects={objects}
            features={features}
            positions={positions}
            setPositions={setPositions}
            zoom={zoom}
            setZoom={setZoom}
            pan={pan}
            setPan={setPan}
            searchTerm={searchTerm}
          />

          <LayoutToolbar
            layoutMode={layoutMode}
            setLayoutMode={setLayoutMode}
            onAutoArrange={handleAutoArrange}
            zoom={zoom}
            setZoom={setZoom}
            onResetZoom={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            isTrayOpen={false}
            setIsTrayOpen={() => {}}
            unassignedCount={0}
          />
        </>
      )}

      <PhotoDetailModal
        photo={selectedPhoto}
        categories={locations}
        onClose={() => setSelectedPhoto(null)}
        onUpdatePhoto={() => {}}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}
