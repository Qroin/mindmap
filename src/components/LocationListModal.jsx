import React, { useState, useEffect } from 'react';
import { X, Settings, Plus, Tag, GripVertical, ChevronRight, ArrowLeft, MapPin } from 'lucide-react';

/* NEW LOCATION CREATION MODAL AT TOUCH POSITION */
export function CreateLocationAtPositionModal({
  isOpen,
  position,
  onClose,
  onCreateLocation
}) {
  if (!isOpen || !position) return null;

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏕️');
  const [color, setColor] = useState('#10B981');

  const iconsList = ['🏕️', '🏖️', '🏬', '🚘', '🎨', '🍳', '☕', '🏡', '🎪', '✈️'];
  const colorsList = ['#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B', '#EC4899'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateLocation({
      id: `loc-custom-${Date.now()}`,
      name: `${icon} ${name.trim()}`,
      icon: icon,
      color: color,
      x: position.x,
      y: position.y
    });

    setName('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#10B981" />
            <h2 style={{ fontSize: '15px', fontWeight: '800' }}>터치 위치에 새 위치 공간 생성</h2>
          </div>
          <button className="glass-btn" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            선택한 캔버스 위치에 새로운 방 박스 공간을 생성합니다.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>아이콘 선택</label>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {iconsList.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '20px',
                    background: icon === ic ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${icon === ic ? '#10B981' : 'rgba(255,255,255,0.1)'}`,
                    cursor: 'pointer'
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>위치 이름</label>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>테마 색상</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {colorsList.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: c,
                    cursor: 'pointer',
                    border: color === c ? '2.5px solid #ffffff' : 'none',
                    boxShadow: color === c ? `0 0 12px ${c}` : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="glass-btn primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}>
            <Plus size={16} /> 새 위치 공간 생성
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
      icon: '📍',
      color: '#3B82F6'
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
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            위치 노드를 클릭하면 깔끔한 사물 전용 List가 열립니다.
          </div>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GripVertical size={16} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                  <span style={{ fontSize: '20px' }}>{loc.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: '800' }}>{loc.name}</span>
                </div>

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
              placeholder="새 위치 목차 추가 (예: 🏕️ 캠핑장)..."
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

/* REUSABLE DEAD-CENTER POPUP MODAL */
export function QuickTagModal({
  location,
  initialObject = null,
  isOpen,
  onClose,
  objects,
  features,
  onAddObject,
  onAddTag
}) {
  if (!isOpen || !location) return null;

  const locObjs = objects.filter(o => o.locationId === location.id);
  const [activeObject, setActiveObject] = useState(initialObject);

  useEffect(() => {
    setActiveObject(initialObject);
  }, [initialObject, location]);

  const [newObjName, setNewObjName] = useState('');
  const [isAddingObj, setIsAddingObj] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleAddObjSubmit = (e) => {
    e.preventDefault();
    if (!newObjName.trim()) return;

    onAddObject(location.id, newObjName.trim());
    setNewObjName('');
    setIsAddingObj(false);
  };

  const handleAddTagSubmit = (e) => {
    e.preventDefault();
    if (!tagInput.trim() || !activeObject) return;

    onAddTag(location.id, activeObject.id, tagInput.trim());
    setTagInput('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {activeObject ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                className="glass-btn" 
                onClick={() => setActiveObject(null)}
                style={{ padding: '6px' }}
                title="사물 리스트로 돌아가기"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: '800' }}>{activeObject.icon} {activeObject.name}</h2>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{location.name} 소속 태깅 관리</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>{location.icon}</span>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '800' }}>{location.name}</h2>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>소속 사물 List</p>
              </div>
            </div>
          )}

          <button className="glass-btn" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeObject ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#a5b4fc', display: 'block' }}>
                [{activeObject.name}] 에 등록된 특징 태깅 List
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '60px' }}>
                {features.filter(f => f.objectId === activeObject.id).length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>등록된 특징 태그가 없습니다. 아래에서 추가하세요.</div>
                ) : (
                  features.filter(f => f.objectId === activeObject.id).map((feat) => (
                    <span
                      key={feat.id}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        background: location.color ? `${location.color}35` : 'rgba(99,102,241,0.25)',
                        border: `1px solid ${location.color || '#6366f1'}66`,
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Tag size={12} />
                      {feat.name}
                    </span>
                  ))
                )}
              </div>

              <form onSubmit={handleAddTagSubmit} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="text"
                  className="search-input"
                  style={{ flex: 1, paddingLeft: '12px' }}
                  placeholder={`+ [${activeObject.name}]에 새 태그 추가...`}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="glass-btn primary">
                  <Plus size={14} /> 태깅 추가
                </button>
              </form>

              <button 
                type="button" 
                className="glass-btn"
                onClick={() => setActiveObject(null)}
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                &lt; 사물 List로 돌아가기
              </button>
            </div>
          ) : (
            <>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block' }}>
                소속 사물 List ({locObjs.length}개)
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {locObjs.map((obj) => {
                  const objFeatCount = features.filter(f => f.objectId === obj.id).length;

                  return (
                    <div
                      key={obj.id}
                      className="glass-panel location-list-row"
                      onClick={() => setActiveObject(obj)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '22px' }}>{obj.icon}</span>
                        <span style={{ fontSize: '14px', fontWeight: '800' }}>{obj.name}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span 
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: 'var(--text-secondary)',
                            background: 'rgba(255,255,255,0.08)',
                            padding: '3px 10px',
                            borderRadius: '12px'
                          }}
                        >
                          {objFeatCount}개 태그
                        </span>
                        <ChevronRight size={18} color="var(--text-muted)" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '8px' }}>
                {isAddingObj ? (
                  <form onSubmit={handleAddObjSubmit} className="glass-panel" style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="search-input"
                      style={{ flex: 1, paddingLeft: '12px' }}
                      placeholder="새 사물 이름 (예: 🐶 반려동물, 🚗 자동차)..."
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
