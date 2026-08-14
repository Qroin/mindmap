import React, { useState } from 'react';
import { X, Tag, Calendar, Camera, Maximize, Save, Check } from 'lucide-react';

export default function PhotoDetailModal({
  photo,
  categories,
  onClose,
  onUpdatePhoto
}) {
  if (!photo) return null;

  const [title, setTitle] = useState(photo.title || '');
  const [categoryId, setCategoryId] = useState(photo.categoryId || '');
  const [tagInput, setTagInput] = useState((photo.objects || []).join(', '));
  const [note, setNote] = useState(photo.note || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updatedObjects = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onUpdatePhoto({
      ...photo,
      title,
      categoryId,
      objects: updatedObjects,
      note
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 style={{ fontSize: '16px', fontWeight: '800' }}>사진 상세보기 & 객체 태그 수정</h2>
          <button className="glass-btn" onClick={onClose} style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Image Preview Column */}
            <div>
              <div style={{
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#000',
                height: '240px'
              }}>
                <img
                  src={photo.url}
                  alt={photo.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* EXIF Info */}
              {photo.exif && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '10px',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={12} /> {photo.exif.camera} • {photo.exif.fStop}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Maximize size={12} /> {photo.exif.resolution}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={12} /> {photo.date}
                  </div>
                </div>
              )}
            </div>

            {/* Editable Fields Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  사진 제목
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '12px' }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  소속 객체 카테고리
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  감지된 객체 태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '12px' }}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="예: 강아지, 골든리트리버, 잔디"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  노트 & 메모
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{
                    width: '100%',
                    height: '60px',
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    resize: 'none',
                    outline: 'none'
                  }}
                  placeholder="사진에 관련된 메모를 작성하세요..."
                />
              </div>

              <button
                className="glass-btn primary"
                onClick={handleSave}
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                {saved ? <Check size={16} /> : <Save size={16} />}
                {saved ? '저장 완료!' : '변경사항 저장'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
