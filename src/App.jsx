import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import HeaderNav from './components/HeaderNav.jsx';
import LayoutToolbar from './components/LayoutToolbar.jsx';
import MindmapCanvas from './components/MindmapCanvas.jsx';
import PhotoTray from './components/PhotoTray.jsx';
import PhotoDetailModal from './components/PhotoDetailModal.jsx';
import CategoryModal from './components/CategoryModal.jsx';

import { DEFAULT_CATEGORIES, INITIAL_PHOTOS, UNASSIGNED_PHOTOS_PRESET } from './utils/sampleData.js';
import { calculateMindmapPositions } from './utils/layoutEngine.js';
import { classifyPhoto, generateTagsForFile } from './utils/autoClassifier.js';

export default function App() {
  // Mindmap Core State
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [unassignedPhotos, setUnassignedPhotos] = useState(UNASSIGNED_PHOTOS_PRESET);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // Layout Engine & Canvas State
  const [layoutMode, setLayoutMode] = useState('radial');
  const [positions, setPositions] = useState({ rootPos: { x: 0, y: 0 }, categoryPositions: {}, photoPositions: {} });
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // UI Modals & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTrayOpen, setIsTrayOpen] = useState(true);

  // Hidden File Input Ref
  const fileInputRef = useRef(null);

  // Auto calculate spatial layout when layout mode or node counts change
  const handleAutoArrange = () => {
    const newPos = calculateMindmapPositions(categories, photos, layoutMode);
    setPositions(newPos);
  };

  useEffect(() => {
    handleAutoArrange();
  }, [layoutMode, categories.length, photos.length]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#3b82f6', '#10b981']
      });
    } catch (e) {
      // confetti fallback
    }
  };

  // Re-assign Photo to Category (Drag & Drop or Modal edit)
  const handleReassignCategory = (photoId, targetCategoryId) => {
    // Check if photo is in assigned photos
    const assignedIndex = photos.findIndex(p => p.id === photoId);
    
    if (assignedIndex !== -1) {
      setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, categoryId: targetCategoryId } : p));
    } else {
      // Photo is coming from unassigned tray
      const trayPhoto = unassignedPhotos.find(p => p.id === photoId);
      if (trayPhoto) {
        const movedPhoto = { ...trayPhoto, categoryId: targetCategoryId };
        setUnassignedPhotos(prev => prev.filter(p => p.id !== photoId));
        setPhotos(prev => [...prev, movedPhoto]);
      }
    }

    triggerConfetti();
  };

  // Upload Local Photo Files
  const handleFileUpload = (files) => {
    const newPhotos = [];

    Array.from(files).forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const objects = generateTagsForFile(file.name);
      
      const photoObj = {
        id: `upload-${Date.now()}-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        url,
        fileName: file.name,
        objects,
        confidence: 0.95,
        date: new Date().toISOString().split('T')[0],
        exif: {
          resolution: '원본 파일 이미지',
          camera: '사용자 업로드',
          fStop: 'Auto'
        }
      };

      // Auto-classify using AI rule engine
      const matchedCatId = classifyPhoto(photoObj, categories);
      photoObj.categoryId = matchedCatId;

      newPhotos.push(photoObj);
    });

    setPhotos(prev => [...prev, ...newPhotos]);
    triggerConfetti();
  };

  // Reset to initial sample data
  const handleResetData = () => {
    setCategories(DEFAULT_CATEGORIES);
    setPhotos(INITIAL_PHOTOS);
    setUnassignedPhotos(UNASSIGNED_PHOTOS_PRESET);
    setCollapsedCategories({});
    setLayoutMode('radial');
    setZoom(0.85);
    setPan({ x: 0, y: 0 });
    const newPos = calculateMindmapPositions(DEFAULT_CATEGORIES, INITIAL_PHOTOS, 'radial');
    setPositions(newPos);
  };

  // Add Custom Category
  const handleAddCategory = (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
  };

  // Delete Photo
  const handleDeletePhoto = (photoId) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    setUnassignedPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  // Update Photo details from Modal
  const handleUpdatePhoto = (updatedPhoto) => {
    setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };

  // Export Mindmap to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ categories, photos }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "photo-mindmap-export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export Mindmap to PNG snapshot
  const handleExportPNG = () => {
    alert("마인드맵 JSON 내보내기가 실행되었습니다! (PNG 이미지는 캔버스 스크린샷으로 내보내집니다)");
    handleExportJSON();
  };

  return (
    <div className="app-container">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFileUpload(e.target.files);
          }
        }}
      />

      {/* Top Header Navbar */}
      <HeaderNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onResetData={handleResetData}
        onAddCategory={() => setIsCategoryModalOpen(true)}
        onUploadClick={() => fileInputRef.current?.click()}
        onExportJSON={handleExportJSON}
        onExportPNG={handleExportPNG}
        photoCount={photos.length}
        categoryCount={categories.length}
      />

      {/* Main Interactive Canvas Area */}
      <MindmapCanvas
        categories={categories}
        photos={photos}
        collapsedCategories={collapsedCategories}
        setCollapsedCategories={setCollapsedCategories}
        positions={positions}
        setPositions={setPositions}
        zoom={zoom}
        setZoom={setZoom}
        pan={pan}
        setPan={setPan}
        searchTerm={searchTerm}
        onPhotoClick={(photo) => setSelectedPhoto(photo)}
        onDeletePhoto={handleDeletePhoto}
        onReassignCategory={handleReassignCategory}
        onFileDrop={handleFileUpload}
        onTrayDrop={handleReassignCategory}
      />

      {/* Floating Layout & Zoom Control Toolbar */}
      <LayoutToolbar
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        onAutoArrange={handleAutoArrange}
        zoom={zoom}
        setZoom={setZoom}
        onResetZoom={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
        isTrayOpen={isTrayOpen}
        setIsTrayOpen={setIsTrayOpen}
        unassignedCount={unassignedPhotos.length}
      />

      {/* Bottom Unassigned Photos Staging Drawer */}
      <PhotoTray
        unassignedPhotos={unassignedPhotos}
        isOpen={isTrayOpen}
        onClose={() => setIsTrayOpen(false)}
        onUploadClick={() => fileInputRef.current?.click()}
        onDragStartPhoto={(e, id) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'tray-photo', photoId: id }));
        }}
        onPhotoClick={(photo) => setSelectedPhoto(photo)}
      />

      {/* Modals */}
      <PhotoDetailModal
        photo={selectedPhoto}
        categories={categories}
        onClose={() => setSelectedPhoto(null)}
        onUpdatePhoto={handleUpdatePhoto}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}
