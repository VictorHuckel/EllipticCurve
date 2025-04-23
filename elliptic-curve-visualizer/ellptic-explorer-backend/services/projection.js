/**
 * Projette un point (x, y) en champ fini Z/pZ sur un tore 3D.
 * - theta = 2π x / p
 * - phi   = 2π y / p
 * Coordonnées : 
 *   X = (R + r cos(phi)) cos(theta)
 *   Y = (R + r cos(phi)) sin(theta)
 *   Z = r sin(phi)
 */
function projectTorus(x, y, p) {
  const R = 3;
  const r = 1;
  const theta = (2 * Math.PI * x) / p;
  const phi = (2 * Math.PI * y) / p;

  const X = (R + r * Math.cos(phi)) * Math.cos(theta);
  const Y = (R + r * Math.cos(phi)) * Math.sin(theta);
  const Z = r * Math.sin(phi);

  return { x: X, y: Y, z: Z };
}

/**
 * Projette un point (x, y) en champ fini Z/pZ sur une sphère 3D.
 * - theta = 2π x / p
 * - phi   = 2π y / p
 * Coordonnées sphériques classiques :
 *   X = R sin(phi) cos(theta)
 *   Y = R sin(phi) sin(theta)
 *   Z = R cos(phi)
 */
function projectSphere(x, y, p) {
  const R = 3;
  const theta = (2 * Math.PI * x) / p;
  const phi = (2 * Math.PI * y) / p;

  const X = R * Math.sin(phi) * Math.cos(theta);
  const Y = R * Math.sin(phi) * Math.sin(theta);
  const Z = R * Math.cos(phi);

  return { x: X, y: Y, z: Z };
}

module.exports = {
  projectTorus,
  projectSphere
};
