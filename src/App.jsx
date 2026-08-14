import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import HeaderNav from './components/HeaderNav.jsx';
import MindmapCanvas from './components/MindmapCanvas.jsx';
import MobileRelationView from './components/MobileRelationView.jsx';
import { LocationListModal, QuickTagModal, CreateLocationAtPositionModal } from './components/LocationListModal.jsx';

import { LOCATION_CATEGORIES, OBJECT_NODES, INITIAL_PHOTOS, getRandomColor } from './utils/sampleData.js';
import { calculateDomain3TierPositions } from './utils/layoutEngine.js';

export default function App() {
  const [viewMode, setViewMode] = useState('mindmap');

  const [locations, setLocations] = useState(LOCATION_CATEGORIES);
  const [objects, setObjects] = useState(OBJECT_NODES);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLocationMode, setActiveLocationMode] = useState(null);

  const [positions, setPositions] = useState(() => calculateDomain3TierPositions(LOCATION_CATEGORIES, OBJECT_NODES));
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals State
  const [isLocationListOpen, setIsLocationListOpen] = useState(false);
  const [tagModalLocation, setTagModalLocation] = useState(null);

  // New Location Creation at Touch Position State
  const [createLocPos, setCreateLocPos] = useState(null);

  const handleAutoArrange = () => {
    const newPos = calculateDomain3TierPositions(locations, objects);
    setPositions(prev => ({
      locationPositions: { ...newPos.locationPositions, ...prev.locationPositions },
      objectPositions: { ...newPos.objectPositions, ...prev.objectPositions }
    }));
  };

  useEffect(() => {
    handleAutoArrange();
  }, [locations.length, objects.length]);

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
    setPhotos(INITIAL_PHOTOS);
    setCurrentIndex(0);
    setActiveLocationMode(null);
    setPan({ x: 0, y: 0 });
    const newPos = calculateDomain3TierPositions(LOCATION_CATEGORIES, OBJECT_NODES);
    setPositions(newPos);
  };

  const handleAddLocationAtPosition = (newLoc) => {
    const locWithRandomColor = {
      ...newLoc,
      color: newLoc.color || getRandomColor()
    };

    setLocations(prev => [...prev, locWithRandomColor]);

    setPositions(prev => ({
      ...prev,
      locationPositions: {
        ...prev.locationPositions,
        [locWithRandomColor.id]: { x: locWithRandomColor.x, y: locWithRandomColor.y }
      }
    }));

    triggerConfetti();
  };

  const handleAddObjectToLocation = (locationId, newObjName) => {
    const newObj = {
      id: `obj-custom-${Date.now()}`,
      locationId: locationId,
      name: newObjName
    };
    setObjects(prev => [...prev, newObj]);
    triggerConfetti();
  };

  const openTagModal = (locObj) => {
    setTagModalLocation(locObj);
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
        <MobileRelationView
          categories={locations}
          photos={photos}
          onReassignCategory={handleReassignCategory}
          onOpenTagModal={(loc) => openTagModal(loc)}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      ) : (
        /* 100% FULLSCREEN STREAMLINED MINDMAP (Pure Text & Random Colors) */
        <MindmapCanvas
          locations={locations}
          objects={objects}
          positions={positions}
          setPositions={setPositions}
          pan={pan}
          setPan={setPan}
          searchTerm={searchTerm}
          onLocationClick={(loc) => openTagModal(loc)}
          onObjectClick={(loc, obj) => {}}
          activeLocationMode={activeLocationMode}
          setActiveLocationMode={setActiveLocationMode}
          onRequestCreateLocation={(pos) => setCreateLocPos(pos)}
        />
      )}

      {/* New Location Creation */}
      <CreateLocationAtPositionModal
        isOpen={!!createLocPos}
        position={createLocPos}
        onClose={() => setCreateLocPos(null)}
        onCreateLocation={handleAddLocationAtPosition}
      />

      {/* Location List Settings Modal */}
      <LocationListModal
        isOpen={isLocationListOpen}
        onClose={() => setIsLocationListOpen(false)}
        locations={locations}
        onSelectLocation={(loc) => openTagModal(loc)}
        onAddLocation={(newLoc) => handleAddLocationAtPosition({ ...newLoc, x: 0, y: 0 })}
      />

      {/* Object List Modal */}
      <QuickTagModal
        location={tagModalLocation}
        isOpen={!!tagModalLocation}
        onClose={() => setTagModalLocation(null)}
        objects={objects}
        onAddObject={handleAddObjectToLocation}
      />
    </div>
  );
}
