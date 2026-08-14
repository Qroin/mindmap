import React, { useState } from 'react';
import { X, Settings, Plus, MapPin } from 'lucide-react';
import { getRandomColor } from '../utils/sampleData.js';

/* 1. LOCATION CREATION MODAL (위치 밖 빈화면 1초 꾹 누름) */
export function CreateLocationAtPositionModal({
  isOpen,
  position,
  onClose,
  onCreateLocation
}) {
  if (!isOpen || !position) return null;

  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateLocation({
      id: `loc-custom-${Date.now()}`,
      name: name.trim(),
      color: getRandomColor(),
      x: position.x,
      y: position.y
    });

    setName('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#10B981" />
            <h2 style={{ fontSize: '15px', fontWeight: '800' }}>📍 새 위치 공간 생성</h2>
          </div>
          <button className="glass-btn" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            위치 밖의 빈 화면을 1초간 누른 좌표에 새로운 위치 공간(방 박스)을 생성합니다.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>위치 공간 이름</label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '14px', height: '42px', fontSize: '14px' }}
              placeholder="예: 캠핑장, 휴가지, 갤러리..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <button type="submit" className="glass-btn primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '4px' }}>
            <Plus size={16} /> 위치 공간 생성
          </button>
        </form>
      </div>
    </div>
  );
}

/* 2. OBJECT CREATION MODAL (위치모드 진입 후 방 박스 내 빈 공간 1초 꾹 누름) */
export function CreateObjectAtPositionModal({
  isOpen,
  location,
  position,
  onClose,
  onCreateObject
}) {
  if (!isOpen || !position || !location) return null;

  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateObject(location.id, name.trim(), position);
    setName('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="#818cf8" />
            <h2 style={{ fontSize: '15px', fontWeight: '800' }}>📦 새 사물 생성</h2>
          </div>
          <button className="glass-btn" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: location.color || '#818cf8' }}>[{location.name}]</strong> 위치 박스 내 빈 공간을 1초간 누른 지점에 새 사물을 생성합니다.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>사물 이름</label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '14px', height: '42px', fontSize: '14px' }}
              placeholder="예: 텐트, 조명, 맥북..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <button type="submit" className="glass-btn primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '4px' }}>
            <Plus size={16} /> 사물 생성
          </button>
        </form>
      </div>
    </div>
  );
}

export function LocationListModal({
  isOpen,
  onClose,
  locations,
  onSelectLocation,
  onAddLocation
}) {
  if (!isOpen) return null;

  const [newLocName, setNewLocName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    onAddLocation({
      id: `loc-custom-${Date.now()}`,
      name: newLocName.trim(),
      color: getRandomColor()
    });
    setNewLocName('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="#818cf8" />
            <h2 style={{ fontSize: '15px', fontWeight: '800' }}>위치 List 목차 설정</h2>
          </div>
          <button className="glass-btn" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="location-list-row glass-panel"
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${loc.color || '#6366f1'}`
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: '800' }}>{loc.name}</span>

                <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: '700' }}>
                  사물 List 보기 &gt;
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <input
              type="text"
              className="search-input"
              style={{ flex: 1, paddingLeft: '12px' }}
              placeholder="새 위치 목차 추가..."
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
            />
            <button type="submit" className="glass-btn primary" style={{ minHeight: '36px' }}>
              <Plus size={16} /> 추가
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function QuickTagModal({
  location,
  isOpen,
  onClose,
  objects,
  onAddObject
}) {
  if (!isOpen || !location) return null;

  const locObjs = objects.filter(o => o.locationId === location.id);
  const [newObjName, setNewObjName] = useState('');
  const [isAddingObj, setIsAddingObj] = useState(false);

  const handleAddObjSubmit = (e) => {
    e.preventDefault();
    if (!newObjName.trim()) return;

    onAddObject(location.id, newObjName.trim());
    setNewObjName('');
    setIsAddingObj(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800' }}>{location.name}</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>소속 사물 List</p>
            </div>
          </div>

          <button className="glass-btn" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block' }}>
            소속 사물 List ({locObjs.length}개)
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {locObjs.map((obj) => (
              <div
                key={obj.id}
                className="glass-panel location-list-row"
                style={{
                  padding: '14px 18px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: '800' }}>{obj.name}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '8px' }}>
            {isAddingObj ? (
              <form onSubmit={handleAddObjSubmit} className="glass-panel" style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="search-input"
                  style={{ flex: 1, paddingLeft: '12px' }}
                  placeholder="새 사물 이름..."
                  value={newObjName}
                  onChange={(e) => setNewObjName(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="glass-btn primary">
                  등록
                </button>
                <button type="button" className="glass-btn" onClick={() => setIsAddingObj(false)}>
                  취소
                </button>
              </form>
            ) : (
              <button
                className="glass-btn primary"
                onClick={() => setIsAddingObj(true)}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '13px' }}
              >
                <Plus size={16} /> + 사물 추가
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* DEAD-CENTER OBJECT INFORMATION MODAL (누르면 화면 중앙에 띄우는 사물 상세 모달) */
export function ObjectDetailCenterModal({
  isOpen,
  location,
  objectItem,
  photos = [],
  onClose
}) {
  if (!isOpen || !objectItem) return null;

  const objPhotos = photos.filter(p => p.objectId === objectItem.id);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: location?.color || '#6366f1'
              }}
            />
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800' }}>{objectItem.name}</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                소속 위치: <strong style={{ color: location?.color || '#818cf8' }}>{location?.name || '기본'}</strong>
              </p>
            </div>
          </div>

          <button className="glass-btn" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="glass-panel" style={{ padding: '14px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              사물 정보 상세
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
              📌 {objectItem.name}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              해당 위치({location?.name})에 배치된 사물 항목입니다. 사물별 관련 사진 및 메모를 연동하여 관리할 수 있습니다.
            </div>
          </div>

          {/* Linked Photos or Memory Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              연동 사진 ({objPhotos.length}장)
            </label>

            {objPhotos.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {objPhotos.map((photo) => (
                  <div key={photo.id} className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden', padding: '6px' }}>
                    <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ fontSize: '11px', fontWeight: '700', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {photo.title}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                등록된 사물 연동 사진이 없습니다.
              </div>
            )}
          </div>

          <button
            className="glass-btn primary"
            onClick={onClose}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '13px', marginTop: '4px' }}
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
