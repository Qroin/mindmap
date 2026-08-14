import React, { useState } from 'react';
import { X, FolderPlus, Check } from 'lucide-react';

const PRESET_ICONS = ['🐶', '🍔', '🏞️', '💻', '👤', '📝', '🚗', '🐱', '☕', '👗', '🎮', '✈️', '🎵', '🏠'];
const PRESET_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16'];

export default function CategoryModal({ isOpen, onClose, onAddCategory }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');
  const [color, setColor] = useState('#3B82F6');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat = {
      id: `cat-custom-${Date.now()}`,
      name: name.trim(),
      icon,
      color,
      description: description.trim() || `${name} 관련 사진 객체`
    };

    onAddCategory(newCat);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderPlus size={18} color="#818cf8" />
            새 객체 카테고리 추가
          </h2>
          <button className="glass-btn" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              카테고리 이름
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%', paddingLeft: '12px' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 🚗 자동차, ☕ 카페 탐방"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              대표 이모지 아이콘
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {PRESET_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: icon === i ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                    background: icon === i ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              테마 하이라이트 색상
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? '3px solid #ffffff' : 'none',
                    cursor: 'pointer',
                    boxShadow: color === c ? `0 0 12px ${c}` : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="glass-btn primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
          >
            <Check size={16} />
            카테고리 생성하기
          </button>
        </form>
      </div>
    </div>
  );
}
