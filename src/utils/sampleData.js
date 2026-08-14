// Pure Text Sample Data with Random Color Generator (All Icons Completely Removed)

export const RANDOM_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#D97706', // Gold
  '#06B6D4'  // Cyan
];

export function getRandomColor() {
  return RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
}

export const LOCATION_CATEGORIES = [
  {
    id: 'loc-indoor',
    name: '실내',
    color: '#3B82F6'
  },
  {
    id: 'loc-city',
    name: '도시/카페',
    color: '#EF4444'
  },
  {
    id: 'loc-nature',
    name: '자연',
    color: '#10B981'
  },
  {
    id: 'loc-office',
    name: '작업실',
    color: '#8B5CF6'
  }
];

export const OBJECT_NODES = [
  // Indoor
  { id: 'obj-pets', locationId: 'loc-indoor', name: '반려동물' },
  { id: 'obj-furniture', locationId: 'loc-indoor', name: '조명' },
  { id: 'obj-homefood', locationId: 'loc-indoor', name: '요리' },

  // City & Cafe
  { id: 'obj-cafe', locationId: 'loc-city', name: '커피' },
  { id: 'obj-gourmet', locationId: 'loc-city', name: '수제버거' },
  { id: 'obj-car', locationId: 'loc-city', name: '자동차' },

  // Nature
  { id: 'obj-mountain', locationId: 'loc-nature', name: '산맥' },
  { id: 'obj-sea', locationId: 'loc-nature', name: '바다' },
  { id: 'obj-tree', locationId: 'loc-nature', name: '단풍' },

  // Office
  { id: 'obj-macbook', locationId: 'loc-office', name: '맥북' },
  { id: 'obj-keyboard', locationId: 'loc-office', name: '키보드' },
  { id: 'obj-docs', locationId: 'loc-office', name: '회의록' }
];

export const INITIAL_PHOTOS = [
  {
    id: 'photo-1',
    categoryId: 'loc-indoor',
    objectId: 'obj-pets',
    title: '귀여운 리트리버',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    date: '2026-08-10'
  },
  {
    id: 'photo-2',
    categoryId: 'loc-city',
    objectId: 'obj-cafe',
    title: '카페 라떼 아트',
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    date: '2026-08-08'
  },
  {
    id: 'photo-3',
    categoryId: 'loc-office',
    objectId: 'obj-macbook',
    title: '미니멀 데스크',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    date: '2026-08-13'
  }
];

export const UNASSIGNED_PHOTOS_PRESET = [];
