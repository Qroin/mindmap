// 3-Tier Domain Data Structure: Location (Inner) -> Object (Middle) -> Feature/Attribute (Outer)

export const LOCATION_CATEGORIES = [
  {
    id: 'loc-indoor',
    name: '🏠 실내 & 주거 (Indoor)',
    icon: '🏠',
    color: '#3B82F6', // Blue
    description: '집, 거실, 창가, 실내 주거 공간'
  },
  {
    id: 'loc-city',
    name: '🏙️ 도시 & 카페 (City & Cafe)',
    icon: '🏙️',
    color: '#EF4444', // Red
    description: '카페, 미식 맛집, 도시 거리 및 자동차'
  },
  {
    id: 'loc-nature',
    name: '🏞️ 야외 & 자연 (Nature & Outdoor)',
    icon: '🏞️',
    color: '#10B981', // Emerald
    description: '산, 바다, 하늘, 여행지 야외 자연 풍경'
  },
  {
    id: 'loc-office',
    name: '💼 데스크 & 작업실 (Office & Workspace)',
    icon: '💼',
    color: '#8B5CF6', // Purple
    description: '노트북, 기계식 키보드, 회의록 및 작업공간'
  }
];

export const OBJECT_NODES = [
  // Indoor
  { id: 'obj-pets', locationId: 'loc-indoor', name: '🐶 반려동물', icon: '🐶' },
  { id: 'obj-furniture', locationId: 'loc-indoor', name: '🛋️ 조명 & 인테리어', icon: '🛋️' },
  { id: 'obj-homefood', locationId: 'loc-indoor', name: '🍳 홈쿠킹 & 요리', icon: '🍳' },

  // City & Cafe
  { id: 'obj-cafe', locationId: 'loc-city', name: '☕ 커피 & 라떼아트', icon: '☕' },
  { id: 'obj-gourmet', locationId: 'loc-city', name: '🍔 미식 & 수제버거', icon: '🍔' },
  { id: 'obj-car', locationId: 'loc-city', name: '🚗 자동차 & 야경', icon: '🚗' },

  // Nature
  { id: 'obj-mountain', locationId: 'loc-nature', name: '🏔️ 산맥 & 일몰노을', icon: '🏔️' },
  { id: 'obj-sea', locationId: 'loc-nature', name: '🌊 바다 & 에메랄드해변', icon: '🌊' },
  { id: 'obj-tree', locationId: 'loc-nature', name: '🍁 공원 & 단풍나무', icon: '🍁' },

  // Office
  { id: 'obj-macbook', locationId: 'loc-office', name: '💻 맥북 & 워크스페이스', icon: '💻' },
  { id: 'obj-keyboard', locationId: 'loc-office', name: '⌨️ 커스텀 키보드', icon: '⌨️' },
  { id: 'obj-docs', locationId: 'loc-office', name: '📝 아이디어 메모 & 서류', icon: '📝' }
];

export const FEATURE_ATTRIBUTES = [
  // Pets Features
  { id: 'feat-1', objectId: 'obj-pets', name: '#골든리트리버', tagType: '품종' },
  { id: 'feat-2', objectId: 'obj-pets', name: '#햇살창가', tagType: '조명' },
  { id: 'feat-3', objectId: 'obj-pets', name: '#귀여움/휴식', tagType: '감성' },
  { id: 'feat-4', objectId: 'obj-pets', name: '#웰시코기', tagType: '품종' },

  // Furniture Features
  { id: 'feat-5', objectId: 'obj-furniture', name: '#무드조명', tagType: '인테리어' },
  { id: 'feat-6', objectId: 'obj-furniture', name: '#따뜻한감성', tagType: '색감' },

  // Cafe Features
  { id: 'feat-7', objectId: 'obj-cafe', name: '#라떼아트비주얼', tagType: '특징' },
  { id: 'feat-8', objectId: 'obj-cafe', name: '#크로플디저트', tagType: '메뉴' },
  { id: 'feat-9', objectId: 'obj-cafe', name: '#주말카페탐방', tagType: '일상' },

  // Gourmet Features
  { id: 'feat-10', objectId: 'obj-gourmet', name: '#수제패티', tagType: '식재료' },
  { id: 'feat-11', objectId: 'obj-gourmet', name: '#치즈풍미', tagType: '맛' },
  { id: 'feat-12', objectId: 'obj-gourmet', name: '#연어초밥오마카세', tagType: '메뉴' },

  // Car Features
  { id: 'feat-13', objectId: 'obj-car', name: '#스포츠카', tagType: '차종' },
  { id: 'feat-14', objectId: 'obj-car', name: '#도심야경보케', tagType: '촬영' },

  // Mountain Features
  { id: 'feat-15', objectId: 'obj-mountain', name: '#정상뷰', tagType: '지형' },
  { id: 'feat-16', objectId: 'obj-mountain', name: '#붉은노을', tagType: '색감' },

  // Sea Features
  { id: 'feat-17', objectId: 'obj-sea', name: '#에메랄드빛', tagType: '색감' },
  { id: 'feat-18', objectId: 'obj-sea', name: '#드론항공촬영', tagType: '장비' },

  // MacBook Features
  { id: 'feat-19', objectId: 'obj-macbook', name: '#미니멀데스크', tagType: '스타일' },
  { id: 'feat-20', objectId: 'obj-macbook', name: '#홈오피스세팅', tagType: '환경' },

  // Keyboard Features
  { id: 'feat-21', objectId: 'obj-keyboard', name: '#RGB라이팅', tagType: '조명' },
  { id: 'feat-22', objectId: 'obj-keyboard', name: '#기계식타건감', tagType: '특징' },

  // Docs Features
  { id: 'feat-23', objectId: 'obj-docs', name: '#아이디어노트', tagType: '형태' },
  { id: 'feat-24', objectId: 'obj-docs', name: '#브레인스토밍', tagType: '목적' }
];

export const INITIAL_PHOTOS = [
  {
    id: 'photo-1',
    categoryId: 'loc-indoor',
    objectId: 'obj-pets',
    title: '귀여운 Golden Retriever',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    objects: ['골든리트리버', '귀여움/휴식', '햇살창가'],
    date: '2026-08-10'
  },
  {
    id: 'photo-2',
    categoryId: 'loc-city',
    objectId: 'obj-cafe',
    title: '카페 라떼 아트 & 크로플',
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    objects: ['라떼아트비주얼', '크로플디저트', '주말카페탐방'],
    date: '2026-08-08'
  },
  {
    id: 'photo-3',
    categoryId: 'loc-office',
    objectId: 'obj-macbook',
    title: '미니멀 데스크 셋업',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    objects: ['미니멀데스크', '홈오피스세팅'],
    date: '2026-08-13'
  }
];

export const UNASSIGNED_PHOTOS_PRESET = [];
