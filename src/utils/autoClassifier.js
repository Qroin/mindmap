// Smart Simulated AI Object Classifier Utility
import { DEFAULT_CATEGORIES } from './sampleData.js';

const KEYWORD_MAP = {
  'cat-pets': ['dog', 'cat', 'pet', 'puppy', 'kitten', 'animal', 'retriever', 'corgi', '개', '강아지', '고양이', '반려동물', '동물', '새', '토끼'],
  'cat-food': ['food', 'burger', 'coffee', 'latte', 'cake', 'sushi', 'pizza', 'noodle', 'dish', 'drink', 'dessert', '음식', '커피', '카페', '햄버거', '디저트', '초밥', '맛집', '요리', '빵', '치킨'],
  'cat-nature': ['mountain', 'sea', 'beach', 'sunset', 'sky', 'flower', 'tree', 'forest', 'nature', 'ocean', 'landscape', '산', '바다', '하늘', '노을', '꽃', '나무', '풍경', '자연', '여행', '해변'],
  'cat-tech': ['laptop', 'macbook', 'phone', 'computer', 'keyboard', 'desk', 'tech', 'screen', 'device', 'camera', '노트북', '컴퓨터', '맥북', '스마트폰', '키보드', '데스크', '테크', '전자기기', '카메라'],
  'cat-people': ['man', 'woman', 'people', 'person', 'portrait', 'face', 'smile', 'model', 'girl', 'boy', '인물', '사람', '얼굴', '프로필', '셀카', '스냅'],
  'cat-docs': ['doc', 'document', 'receipt', 'note', 'ticket', 'paper', 'text', 'book', 'bill', 'memo', '영수증', '문서', '메모', '노트', '티켓', '서류', '책']
};

/**
 * Classifies an incoming photo (file name, title, or objects array) into an existing category ID.
 */
export function classifyPhoto(photoInput, categories = DEFAULT_CATEGORIES) {
  const textToScan = [
    photoInput.title || '',
    photoInput.fileName || '',
    ...(photoInput.objects || [])
  ].join(' ').toLowerCase();

  let maxScore = 0;
  let matchedCategoryId = null;

  for (const [catId, keywords] of Object.entries(KEYWORD_MAP)) {
    let score = 0;
    for (const kw of keywords) {
      if (textToScan.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      matchedCategoryId = catId;
    }
  }

  // Fallback to random/first category if no match
  if (!matchedCategoryId && categories.length > 0) {
    // Pick based on hash of photo ID or name
    const hash = textToScan.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    matchedCategoryId = categories[hash % categories.length].id;
  }

  return matchedCategoryId || categories[0]?.id || 'cat-pets';
}

/**
 * Generates simulated detected objects for an uploaded file name.
 */
export function generateTagsForFile(fileName) {
  const name = fileName.toLowerCase();
  const tags = [];

  if (name.includes('dog') || name.includes('puppy') || name.includes('개') || name.includes('강아지')) {
    tags.push('강아지', '반려동물');
  } else if (name.includes('cat') || name.includes('고양이')) {
    tags.push('고양이', '반려동물');
  } else if (name.includes('food') || name.includes('eat') || name.includes('음식') || name.includes('카페')) {
    tags.push('음식', '디저트');
  } else if (name.includes('trip') || name.includes('travel') || name.includes('sea') || name.includes('풍경')) {
    tags.push('자연', '여행', '풍경');
  } else if (name.includes('code') || name.includes('work') || name.includes('desk') || name.includes('노트북')) {
    tags.push('테크', '노트북', '작업실');
  } else {
    tags.push('새 사진', '객체 감지됨');
  }

  return tags;
}
