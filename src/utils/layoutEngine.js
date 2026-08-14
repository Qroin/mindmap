// Dynamic Mindmap Layout Engine

/**
 * Calculates (x, y) spatial positions for Root, Categories, and Photo nodes based on layout mode.
 * @param {Array} categories List of category objects
 * @param {Array} photos List of photo objects
 * @param {String} mode 'radial' | 'tree' | 'cluster' | 'grid'
 * @returns {Object} { rootPos, categoryPositions, photoPositions }
 */
export function calculateMindmapPositions(categories, photos, mode = 'radial') {
  const rootPos = { x: 0, y: 0 };
  const categoryPositions = {};
  const photoPositions = {};

  if (mode === 'radial') {
    const numCats = categories.length;
    const catRadius = 380;
    const photoRadiusOffset = 260;

    categories.forEach((cat, index) => {
      // Angle around root
      const angle = (index / numCats) * Math.PI * 2 - Math.PI / 2;
      const catX = Math.cos(angle) * catRadius;
      const catY = Math.sin(angle) * catRadius;

      categoryPositions[cat.id] = { x: catX, y: catY };

      // Filter photos in this category
      const catPhotos = photos.filter(p => p.categoryId === cat.id);
      const numPhotos = catPhotos.length;

      // Arc spread for photos
      const arcSpread = Math.min(Math.PI * 0.8, numPhotos * 0.35);
      const startAngle = angle - arcSpread / 2;

      catPhotos.forEach((photo, pIdx) => {
        const photoAngle = numPhotos === 1 ? angle : startAngle + (pIdx / (numPhotos - 1)) * arcSpread;
        // Stagger distance slightly for visual interest
        const distance = catRadius + photoRadiusOffset + (pIdx % 2 === 0 ? 0 : 40);

        const px = Math.cos(photoAngle) * distance;
        const py = Math.sin(photoAngle) * distance;

        photoPositions[photo.id] = { x: px, y: py };
      });
    });
  } else if (mode === 'tree') {
    // Horizontal tree layout (Left to Right)
    rootPos.x = -500;
    rootPos.y = 0;

    const catX = -100;
    const photoX = 350;
    const verticalGap = 160;

    let currentY = -((categories.length * verticalGap) / 2);

    categories.forEach((cat) => {
      const catPhotos = photos.filter(p => p.categoryId === cat.id);
      const catHeight = Math.max(catPhotos.length * 140, verticalGap);
      const catCenterY = currentY + catHeight / 2;

      categoryPositions[cat.id] = { x: catX, y: catCenterY };

      let photoY = catCenterY - ((catPhotos.length - 1) * 140) / 2;
      catPhotos.forEach((photo) => {
        photoPositions[photo.id] = { x: photoX, y: photoY };
        photoY += 140;
      });

      currentY += catHeight + 40;
    });
  } else if (mode === 'cluster') {
    // Organic cluster layout
    rootPos.x = 0;
    rootPos.y = 0;

    const catDistances = [
      { x: -350, y: -250 },
      { x: 350, y: -250 },
      { x: -400, y: 200 },
      { x: 400, y: 200 },
      { x: 0, y: -450 },
      { x: 0, y: 450 }
    ];

    categories.forEach((cat, index) => {
      const basePos = catDistances[index % catDistances.length];
      categoryPositions[cat.id] = { ...basePos };

      const catPhotos = photos.filter(p => p.categoryId === cat.id);
      const cols = 2;
      catPhotos.forEach((photo, pIdx) => {
        const col = pIdx % cols;
        const row = Math.floor(pIdx / cols);
        const offsetX = (col - (cols - 1) / 2) * 220 + (row % 2 ? 20 : -20);
        const offsetY = (row + 1) * 160;

        photoPositions[photo.id] = {
          x: basePos.x + offsetX,
          y: basePos.y + offsetY
        };
      });
    });
  } else if (mode === 'grid') {
    // Structured grid layout
    rootPos.x = 0;
    rootPos.y = -400;

    let startX = -600;
    categories.forEach((cat, catIdx) => {
      const colX = startX + (catIdx % 3) * 420;
      const rowY = Math.floor(catIdx / 3) * 500 - 150;

      categoryPositions[cat.id] = { x: colX, y: rowY };

      const catPhotos = photos.filter(p => p.categoryId === cat.id);
      catPhotos.forEach((photo, pIdx) => {
        photoPositions[photo.id] = {
          x: colX + (pIdx % 2 === 0 ? -90 : 90),
          y: rowY + 140 + Math.floor(pIdx / 2) * 150
        };
      });
    });
  }

  return { rootPos, categoryPositions, photoPositions };
}

/**
 * Calculates a smooth SVG cubic bezier path string between two points (x1, y1) and (x2, y2).
 */
export function getBezierPath(x1, y1, x2, y2, curvature = 0.5) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Control points
  const cx1 = x1 + dx * curvature;
  const cy1 = y1;
  const cx2 = x2 - dx * curvature;
  const cy2 = y2;

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
}
