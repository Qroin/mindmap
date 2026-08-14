// 3-Tier Concentric Domain Layout Engine (Location -> Object -> Feature)

/**
 * Calculates (x, y) spatial coordinates for 3-tier domain hierarchy.
 * Inner Ring R1 (Location) -> Middle Ring R2 (Object) -> Outer Ring R3 (Feature/Attribute)
 */
export function calculateDomain3TierPositions(locations, objects, features) {
  const locationPositions = {};
  const objectPositions = {};
  const featurePositions = {};

  const numLocs = locations.length;
  const r1 = 180; // Inner Radius (Location)
  const r2 = 380; // Middle Radius (Object)
  const r3 = 620; // Outer Radius (Feature)

  // 1. Position Location Nodes in Inner Ring (Centered around 0,0 - NO central root node)
  locations.forEach((loc, index) => {
    const locAngle = (index / numLocs) * Math.PI * 2 - Math.PI / 2;
    const lx = Math.cos(locAngle) * r1;
    const ly = Math.sin(locAngle) * r1;

    locationPositions[loc.id] = { x: lx, y: ly, angle: locAngle };

    // 2. Position Object Nodes in Middle Ring (Radiating from parent Location)
    const locObjs = objects.filter(o => o.locationId === loc.id);
    const numObjs = locObjs.length;
    const locArc = (Math.PI * 2) / numLocs * 0.85;
    const startObjAngle = locAngle - locArc / 2;

    locObjs.forEach((obj, oIdx) => {
      const objAngle = numObjs === 1 ? locAngle : startObjAngle + (oIdx / (numObjs - 1)) * locArc;
      const ox = Math.cos(objAngle) * r2;
      const oy = Math.sin(objAngle) * r2;

      objectPositions[obj.id] = { x: ox, y: oy, angle: objAngle };

      // 3. Position Feature Nodes in Outer Ring (Radiating from parent Object)
      const objFeats = features.filter(f => f.objectId === obj.id);
      const numFeats = objFeats.length;
      const objArc = locArc / Math.max(numObjs, 1) * 0.9;
      const startFeatAngle = objAngle - objArc / 2;

      objFeats.forEach((feat, fIdx) => {
        const featAngle = numFeats === 1 ? objAngle : startFeatAngle + (fIdx / (numFeats - 1)) * objArc;
        const fx = Math.cos(featAngle) * (r3 + (fIdx % 2 === 0 ? 0 : 35));
        const fy = Math.sin(featAngle) * (r3 + (fIdx % 2 === 0 ? 0 : 35));

        featurePositions[feat.id] = { x: fx, y: fy };
      });
    });
  });

  return { locationPositions, objectPositions, featurePositions };
}

/**
 * Calculates smooth SVG bezier path between two nodes.
 */
export function getBezierPath(x1, y1, x2, y2, curvature = 0.4) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const cx1 = x1 + dx * curvature;
  const cy1 = y1;
  const cx2 = x2 - dx * curvature;
  const cy2 = y2;

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
}
