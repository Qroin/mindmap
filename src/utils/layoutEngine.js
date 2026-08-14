// Floorplan Room Layout Engine (Tagging Removed)

export function calculateDomain3TierPositions(locations, objects) {
  const locationPositions = {};
  const objectPositions = {};

  const sw = typeof window !== 'undefined' ? window.innerWidth : 800;
  const sh = typeof window !== 'undefined' ? window.innerHeight : 600;

  // Constrain coordinates based on screen size so all boxes fit perfectly on screen!
  const boxW = 170;
  const boxH = 120;
  
  const spanX = Math.max(0, (sw / 2) - (boxW / 2) - 20);
  const spanY = Math.max(0, (sh / 2) - (boxH / 2) - 80); // accommodate top nav

  const roomCenters = [
    { x: -spanX * 0.7, y: -spanY * 0.7 }, // Top-Left
    { x: spanX * 0.7, y: -spanY * 0.7 },  // Top-Right
    { x: -spanX * 0.7, y: spanY * 0.7 },  // Bottom-Left
    { x: spanX * 0.7, y: spanY * 0.7 }    // Bottom-Right
  ];

  locations.forEach((loc, index) => {
    const center = roomCenters[index % roomCenters.length];
    locationPositions[loc.id] = { x: center.x, y: center.y };

    const locObjs = objects.filter(o => o.locationId === loc.id);

    locObjs.forEach((obj, oIdx) => {
      const col = oIdx % 2;
      const row = Math.floor(oIdx / 2);
      
      const relX = col === 0 ? -42 : 42;
      const relY = row === 0 ? -24 : 24;

      const ox = center.x + relX;
      const oy = center.y + relY;

      objectPositions[obj.id] = { x: ox, y: oy, relX, relY };
    });
  });

  return { locationPositions, objectPositions, featurePositions: {} };
}

export function getBezierPath(x1, y1, x2, y2, curvature = 0.3) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const cx1 = x1 + dx * curvature;
  const cy1 = y1;
  const cx2 = x2 - dx * curvature;
  const cy2 = y2;

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
}
