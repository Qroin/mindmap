import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import HeaderNav from './components/HeaderNav.jsx';
import MindmapCanvas from './components/MindmapCanvas.jsx';
import MobileRelationView from './components/MobileRelationView.jsx';
import { LocationListModal, QuickTagModal } from './components/LocationListModal.jsx';

import { LOCATION_CATEGORIES, OBJECT_NODES, FEATURE_ATTRIBUTES, INITIAL_PHOTOS } from './utils/sampleData.js';
import { calculateDomain3TierPositions } from './utils/layoutEngine.js';

export default function App() {
  const [viewMode, setViewMode] = useState('mindmap'); // 'mobile-relation' | 'mindmap'

  const [locations, setLocations] = useState(LOCATION_CATEGORIES);
  const [objects, setObjects] = useState(OBJECT_NODES);
  const [features, setFeatures] = useState(FEATURE_ATTRIBUTES);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [positions, setPositions] = useState({ locationPositions: {}, objectPositions: {}, featurePositions: {} });
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals State
  const [isLocationListOpen, setIsLocationListOpen] = useState(false);
  const [tagModalLocation, setTagModalLocation] = useState(null);

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
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#3b82f6', '#f59e0b']
      });
    } catch (e) {}
  };

  const handleReassignCategory = (photoId, targetCategoryId) => {
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, categoryId: targetCategoryId } : p));
    triggerConfetti();
  };

  const handleResetData = () => {
    setLocations(LOCATION_CATEGORIES);
    setObjects(OBJECT_NODES);
    setFeatures(FEATURE_ATTRIBUTES);
    setPhotos(INITIAL_PHOTOS);
    setCurrentIndex(0);
    setZoom(0.85);
    setPan({ x: 0, y: 0 });
    const newPos = calculateDomain3TierPositions(LOCATION_CATEGORIES, OBJECT_NODES, FEATURE_ATTRIBUTES);
    setPositions(newPos);
  };

  const handleAddLocation = (newLoc) => {
    setLocations(prev => [...prev, newLoc]);
    triggerConfetti();
  };

  const handleAddObjectToLocation = (locationId, newObjName) => {
    const newObj = {
      id: `obj-custom-${Date.now()}`,
      locationId: locationId,
      name: newObjName,
      icon: '📦'
    };
    setObjects(prev => [...prev, newObj]);
    triggerConfetti();
  };

  const handleAddTagToLocationObject = (locationId, objectId, newTagText) => {
    const newFeature = {
      id: `feat-custom-${Date.now()}`,
      objectId: objectId,
      name: newTagText.startsWith('#') ? newTagText : `#${newTagText}`,
      tagType: '사용자 태그'
    };

    setFeatures(prev => [...prev, newFeature]);
    triggerConfetti();
  };

  return (
    <div className="app-container">
      {/* Header */}
      <HeaderNav
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetData={handleResetData}
        onOpenLocationList={() => setIsLocationListOpen(true)}
      />

      {viewMode === 'mobile-relation' ? (
        /* FAST MATCHER & QUICK TAGGING UI */
        <MobileRelationView
          categories={locations}
          photos={photos}
          onReassignCategory={handleReassignCategory}
          onOpenTagModal={(loc) => setTagModalLocation(loc)}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      ) : (
        /* 100% FULLSCREEN CLEAN MINDMAP CANVAS (Click 1st-level Location -> Open Custom Tagging Modal) */
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
          onLocationClick={(loc) => setTagModalLocation(loc)}
        />
      )}

      {/* Location List Settings Modal */}
      <LocationListModal
        isOpen={isLocationListOpen}
        onClose={() => setIsLocationListOpen(false)}
        locations={locations}
        onSelectLocation={(loc) => setTagModalLocation(loc)}
        onAddLocation={handleAddLocation}
      />

      {/* Quick Tagging Modal (1차 위치 클릭 시 팝업: 사물 세로 List & 하단 +사물추가 / 사물 누르면 태깅 List & 하단 +태깅추가) */}
      <QuickTagModal
        location={tagModalLocation}
        isOpen={!!tagModalLocation}
        onClose={() => setTagModalLocation(null)}
        objects={objects}
        features={features}
        onAddObject={handleAddObjectToLocation}
        onAddTag={handleAddTagToLocationObject}
      />
    </div>
  );
}
