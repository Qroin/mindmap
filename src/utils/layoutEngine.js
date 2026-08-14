// Floorplan Room Layout Engine (Tagging Removed)

export function calculateDomain3TierPositions(locations, objects) {
  const locationPositions = {};
  const objectPositions = {};

  const roomCenters = [
    { x: -280, y: -200 }, // Top-Left: Indoor
    { x: 280, y: -200 },  // Top-Right: City/Cafe
    { x: -280, y: 200 },  // Bottom-Left: Nature
    { x: 280, y: 200 }    // Bottom-Right: Office
  ];

  locations.forEach((loc, index) => {
    const center = roomCenters[index % roomCenters.length];
    locationPositions[loc.id] = { x: center.x, y: center.y };

    const locObjs = objects.filter(o => o.locationId === loc.id);

    locObjs.forEach((obj, oIdx) => {
      const col = oIdx % 2;
      const row = Math.floor(oIdx / 2);
      
      const relX = col === 0 ? -80 : 80;
      const relY = row === 0 ? -20 : 50;

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
