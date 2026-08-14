// Streamlined Sample Data (Tagging Features Completely Removed)

export const LOCATION_CATEGORIES = [
  {
    id: 'loc-indoor',
    name: '🏠 실내',
    icon: '🏠',
    color: '#3B82F6',
    description: '집, 거실, 실내 공간'
  },
  {
    id: 'loc-city',
    name: '🏙️ 도시/카페',
    icon: '🏙️',
    color: '#EF4444',
    description: '카페, 맛집, 자동차'
  },
  {
    id: 'loc-nature',
    name: '🏞️ 자연',
    icon: '🏞️',
    color: '#10B981',
    description: '산, 바다, 여행'
  },
  {
    id: 'loc-office',
    name: '💼 작업실',
    icon: '💼',
    color: '#8B5CF6',
    description: '노트북, 키보드, 메모'
  }
];

export const OBJECT_NODES = [
  // Indoor
  { id: 'obj-pets', locationId: 'loc-indoor', name: '🐶 반려동물', icon: '🐶' },
  { id: 'obj-furniture', locationId: 'loc-indoor', name: '🛋️ 조명', icon: '🛋️' },
  { id: 'obj-homefood', locationId: 'loc-indoor', name: '🍳 요리', icon: '🍳' },

  // City & Cafe
  { id: 'obj-cafe', locationId: 'loc-city', name: '☕ 커피', icon: '☕' },
  { id: 'obj-gourmet', locationId: 'loc-city', name: '🍔 수제버거', icon: '🍔' },
  { id: 'obj-car', locationId: 'loc-city', name: '🚗 자동차', icon: '🚗' },

  // Nature
  { id: 'obj-mountain', locationId: 'loc-nature', name: '🏔️ 산맥', icon: '🏔️' },
  { id: 'obj-sea', locationId: 'loc-nature', name: '🌊 바다', icon: '🌊' },
  { id: 'obj-tree', locationId: 'loc-nature', name: '🍁 단풍', icon: '🍁' },

  // Office
  { id: 'obj-macbook', locationId: 'loc-office', name: '💻 맥북', icon: '💻' },
  { id: 'obj-keyboard', locationId: 'loc-office', name: '⌨️ 키보드', icon: '⌨️' },
  { id: 'obj-docs', locationId: 'loc-office', name: '📝 회의록', icon: '📝' }
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
