// Preset Sample Data for Photo Object Mindmap
export const DEFAULT_CATEGORIES = [
  {
    id: 'cat-pets',
    name: '반려동물 (Pets)',
    icon: '🐶',
    color: '#3B82F6', // Blue
    gradient: 'from-blue-500 to-cyan-400',
    description: '강아지, 고양이 및 기타 반려동물 사진'
  },
  {
    id: 'cat-food',
    name: '음식 & 미식 (Food)',
    icon: '🍔',
    color: '#EF4444', // Red
    gradient: 'from-red-500 to-amber-500',
    description: '디저트, 카페, 요리 및 음식 사진'
  },
  {
    id: 'cat-nature',
    name: '풍경 & 여행 (Nature)',
    icon: '🏞️',
    color: '#10B981', // Emerald
    gradient: 'from-emerald-500 to-teal-400',
    description: '산, 바다, 하늘, 여행지 자연 풍경'
  },
  {
    id: 'cat-tech',
    name: 'IT & 테크 (Tech)',
    icon: '💻',
    color: '#8B5CF6', // Purple
    gradient: 'from-purple-500 to-indigo-500',
    description: '노트북, 스마트폰, 데스크셋업 및 전자기기'
  },
  {
    id: 'cat-people',
    name: '인물 & 초상 (People)',
    icon: '👤',
    color: '#F59E0B', // Amber
    gradient: 'from-amber-500 to-yellow-400',
    description: '스냅샷, 인물 프로필, 스튜디오 촬영'
  },
  {
    id: 'cat-docs',
    name: '문서 & 티켓 (Docs)',
    icon: '📝',
    color: '#EC4899', // Pink
    gradient: 'from-pink-500 to-rose-400',
    description: '영수증, 메모, 티켓 및 서류 사진'
  }
];

export const INITIAL_PHOTOS = [
  // Pets
  {
    id: 'photo-1',
    categoryId: 'cat-pets',
    title: '귀여운 Golden Retriever',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    objects: ['강아지', '골든리트리버', '잔디', '야외'],
    confidence: 0.98,
    date: '2026-08-10',
    exif: { resolution: '3840 x 2160', camera: 'Sony A7 IV', fStop: 'f/1.8' },
    note: '공원에서 뛰어놀 때 촬영함'
  },
  {
    id: 'photo-2',
    categoryId: 'cat-pets',
    title: '휴식 중인 아기 고양이',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    objects: ['고양이', '반려동물', '실내', '귀여움'],
    confidence: 0.96,
    date: '2026-08-11',
    exif: { resolution: '2048 x 1536', camera: 'iPhone 15 Pro', fStop: 'f/2.2' },
    note: '햇살 드는 창가에서 졸고 있는 모슬'
  },
  {
    id: 'photo-3',
    categoryId: 'cat-pets',
    title: '장난치는 웰시코기',
    url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
    objects: ['강아지', '웰시코기', '웃음'],
    confidence: 0.94,
    date: '2026-08-12',
    exif: { resolution: '4000 x 3000', camera: 'Canon EOS R6', fStop: 'f/2.8' },
    note: '꼬리 흔드는 코기'
  },

  // Food
  {
    id: 'photo-4',
    categoryId: 'cat-food',
    title: '수제 햄버거 & 프렌치 프라이',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    objects: ['햄버거', '패스트푸드', '감자튀김', '치즈'],
    confidence: 0.99,
    date: '2026-08-09',
    exif: { resolution: '3000 x 2000', camera: 'Fujifilm X-T4', fStop: 'f/2.0' },
    note: '수제버거 맛집 탐방'
  },
  {
    id: 'photo-5',
    categoryId: 'cat-food',
    title: '카페 라떼 아트 & 크로플',
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    objects: ['커피', '라떼아트', '디저트', '카페'],
    confidence: 0.97,
    date: '2026-08-08',
    exif: { resolution: '2400 x 1800', camera: 'Galaxy S24 Ultra', fStop: 'f/1.7' },
    note: '주말 분위기 좋은 카페'
  },
  {
    id: 'photo-6',
    categoryId: 'cat-food',
    title: '신선한 연어 초밥 세트',
    url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    objects: ['일식', '초밥', '연어', '해산물'],
    confidence: 0.95,
    date: '2026-08-05',
    exif: { resolution: '3600 x 2400', camera: 'Sony A7C', fStop: 'f/2.8' },
    note: '오마카세 저녁식사'
  },

  // Nature
  {
    id: 'photo-7',
    categoryId: 'cat-nature',
    title: '노을 젖은 산맥과 일몰',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    objects: ['산', '노을', '일몰', '하늘', '풍경'],
    confidence: 0.99,
    date: '2026-08-01',
    exif: { resolution: '6000 x 4000', camera: 'Nikon Z7 II', fStop: 'f/8.0' },
    note: '등산 정상에서 본 노을 View'
  },
  {
    id: 'photo-8',
    categoryId: 'cat-nature',
    title: '에메랄드빛 해변과 파도',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    objects: ['바다', '해변', '모래사장', '휴양지'],
    confidence: 0.98,
    date: '2026-07-28',
    exif: { resolution: '4000 x 2667', camera: 'DJI Mini 4 Pro', fStop: 'f/2.8' },
    note: '여름 휴가 바닷가 사진'
  },

  // Tech
  {
    id: 'photo-9',
    categoryId: 'cat-tech',
    title: '미니멀 데스크 셋업 & 맥북',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    objects: ['맥북', '노트북', '키보드', '데스크', '워크스페이스'],
    confidence: 0.97,
    date: '2026-08-13',
    exif: { resolution: '4500 x 3000', camera: 'Sony A7 IV', fStop: 'f/2.8' },
    note: '새로 세팅한 홈오피스 공간'
  },
  {
    id: 'photo-10',
    categoryId: 'cat-tech',
    title: '기계식 키보드 & RGB 라이트',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    objects: ['키보드', '기계식키보드', '조명', '테크'],
    confidence: 0.96,
    date: '2026-08-04',
    exif: { resolution: '3000 x 2000', camera: 'iPhone 15 Pro', fStop: 'f/1.7' },
    note: '커스텀 키보드 빌드 완공'
  },

  // People
  {
    id: 'photo-11',
    categoryId: 'cat-people',
    title: '감성 야외 스냅 프로필',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    objects: ['인물', '프로필', '여성', '햇살'],
    confidence: 0.95,
    date: '2026-07-30',
    exif: { resolution: '3500 x 5000', camera: 'Sony A7R V', fStop: 'f/1.4' },
    note: '스튜디오 인물 스냅 촬영'
  },

  // Docs
  {
    id: 'photo-12',
    categoryId: 'cat-docs',
    title: '아이디어 메모 노트 & 매직펜',
    url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    objects: ['메모', '노트', '문서', '펜', '아이디어'],
    confidence: 0.94,
    date: '2026-08-02',
    exif: { resolution: '3000 x 2000', camera: 'iPad Air Scan', fStop: 'f/2.4' },
    note: '프로젝트 브레인스토밍 회의록'
  }
];

export const UNASSIGNED_PHOTOS_PRESET = [
  {
    id: 'tray-1',
    categoryId: null,
    title: '카페의 감성 조명',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    objects: ['조명', '인테리어', '카페'],
    confidence: 0.91,
    date: '2026-08-14'
  },
  {
    id: 'tray-2',
    categoryId: null,
    title: '공원의 단풍나무',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    objects: ['나무', '단풍', '자연'],
    confidence: 0.89,
    date: '2026-08-14'
  },
  {
    id: 'tray-3',
    categoryId: null,
    title: '스포츠카 야간 드라이브',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    objects: ['자동차', '스포츠카', '야경'],
    confidence: 0.97,
    date: '2026-08-14'
  }
];
