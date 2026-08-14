import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import HeaderNav from './components/HeaderNav.jsx';
import MindmapCanvas from './components/MindmapCanvas.jsx';
import {
  LocationListModal,
  QuickTagModal,
  CreateLocationAtPositionModal,
  CreateObjectAtPositionModal,
  ObjectDetailCenterModal
} from './components/LocationListModal.jsx';

import { LOCATION_CATEGORIES, OBJECT_NODES, INITIAL_PHOTOS, getRandomColor } from './utils/sampleData.js';
import { calculateDomain3TierPositions } from './utils/layoutEngine.js';

export default function App() {
  const [locations, setLocations] = useState(LOCATION_CATEGORIES);
  const [objects, setObjects] = useState(OBJECT_NODES);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);

  const [activeLocationMode, setActiveLocationMode] = useState(null);

  const [positions, setPositions] = useState(() => calculateDomain3TierPositions(LOCATION_CATEGORIES, OBJECT_NODES));
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals State
  const [isLocationListOpen, setIsLocationListOpen] = useState(false);
  const [tagModalLocation, setTagModalLocation] = useState(null);
  const [selectedObjectInfo, setSelectedObjectInfo] = useState(null);

  // New Creation States (1-Sec Press Rules)
  const [createLocPos, setCreateLocPos] = useState(null);
  const [createObjPos, setCreateObjPos] = useState(null);

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

  const handleResetData = () => {
    setLocations(LOCATION_CATEGORIES);
    setObjects(OBJECT_NODES);
    setPhotos(INITIAL_PHOTOS);
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

  const handleAddObjectAtPosition = (locationId, newObjName, pos) => {
    const newObj = {
      id: `obj-custom-${Date.now()}`,
      locationId: locationId,
      name: newObjName
    };
    setObjects(prev => [...prev, newObj]);
    setPositions(prev => ({
      ...prev,
      objectPositions: {
        ...prev.objectPositions,
        [newObj.id]: { x: pos.x, y: pos.y, relX: 0, relY: 0 }
      }
    }));
    triggerConfetti();
  };

  const openTagModal = (locObj) => {
    setTagModalLocation(locObj);
  };

  return (
    <div className="app-container">
      {/* Header Floating Controls */}
      <HeaderNav
        onResetData={handleResetData}
        onOpenLocationList={() => setIsLocationListOpen(true)}
      />

      {/* 100% FULLSCREEN STREAMLINED MINDMAP (Pure Text & Random Colors) */}
      <MindmapCanvas
        locations={locations}
        objects={objects}
        positions={positions}
        setPositions={setPositions}
        pan={pan}
        setPan={setPan}
        searchTerm={searchTerm}
        onLocationClick={(loc) => openTagModal(loc)}
        onObjectClick={(loc, obj) => setSelectedObjectInfo({ location: loc, object: obj })}
        activeLocationMode={activeLocationMode}
        setActiveLocationMode={setActiveLocationMode}
        onRequestCreateLocation={(pos) => setCreateLocPos(pos)}
        onRequestCreateObject={({ locationId, pos }) => setCreateObjPos({ locationId, pos })}
      />

      {/* 1. Rule 1: Location Creation Modal (위치 밖 빈화면 1초 꾹 누름) */}
      <CreateLocationAtPositionModal
        isOpen={!!createLocPos}
        position={createLocPos}
        onClose={() => setCreateLocPos(null)}
        onCreateLocation={handleAddLocationAtPosition}
      />

      {/* 2. Rule 2: Object Creation Modal (위치모드 진입 후 방 박스 내 빈 영역 1초 꾹 누름) */}
      <CreateObjectAtPositionModal
        isOpen={!!createObjPos}
        location={locations.find(l => l.id === createObjPos?.locationId)}
        position={createObjPos?.pos}
        onClose={() => setCreateObjPos(null)}
        onCreateObject={handleAddObjectAtPosition}
      />

      {/* Location List Settings Modal */}
      <LocationListModal
        isOpen={isLocationListOpen}
        onClose={() => setIsLocationListOpen(false)}
        locations={locations}
        onSelectLocation={(loc) => {
          setActiveLocationMode(loc.id);
          const locPos = positions.locationPositions[loc.id];
          if (locPos) {
            setPan({ x: -locPos.x, y: -locPos.y });
          }
          setIsLocationListOpen(false);
        }}
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

      {/* Dead-Centered Object Info Modal */}
      <ObjectDetailCenterModal
        isOpen={!!selectedObjectInfo}
        location={selectedObjectInfo?.location}
        objectItem={selectedObjectInfo?.object}
        photos={photos}
        onClose={() => setSelectedObjectInfo(null)}
      />
    </div>
  );
}
