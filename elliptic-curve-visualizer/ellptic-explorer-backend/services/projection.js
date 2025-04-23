function projectiveToSphere(X, Y, Z, R = 3) {
  const norm = Math.sqrt(X * X + Y * Y + Z * Z);
  if (norm < 1e-8) return null;
  return {
    x: R * X / norm,
    y: R * Y / norm,
    z: R * Z / norm
  };
}

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
function projectSphere(x, y, p) {
  const theta = (2 * Math.PI * x) / p;
  const phi = (2 * Math.PI * y) / p;
  const R = 3;
  return {
    x: R * Math.sin(phi) * Math.cos(theta),
    y: R * Math.sin(phi) * Math.sin(theta),
    z: R * Math.cos(phi)
  };
}

module.exports = {
  projectiveToSphere,
  projectTorus,
  projectSphere
};
