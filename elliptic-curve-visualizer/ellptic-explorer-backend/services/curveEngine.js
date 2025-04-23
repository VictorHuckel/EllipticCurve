const {
  Weierstrass,
  Montgomery,
  Edwards,
  WeierstrassHomogeneous,
  MontgomeryHomogeneous,
  EdwardsHomogeneous
} = require("../models/Curve");

const { modSqrtAll } = require("./modmath");
const { projectTorus, projectiveToSphere } = require("./projection");

function generateCurvePoints({
  type,
  field = "real",
  a,
  b,
  d,
  p = 97,
  xMin = -5,
  xMax = 5,
  resolution = 300
}) {
  const curve = getCurveInstance(type, a, b, d);
  const homogeneousCurve = getCurveInstance(type + "_homogeneous", a, b, d);

  let points2D = [], homogeneousPoints2D = [];
  let torusPoints = [], spherePoints = [];

  if (field === "real") {
    // Courbe standard (x, y)
    points2D = computeReal2D_Combined(curve, xMin, xMax, resolution);

    // Homogeneous uniquement si ce n’est pas Edwards
    if (!type.includes("edwards")) {
      homogeneousPoints2D = computeReal2D_Homogeneous(homogeneousCurve, xMin, xMax, resolution);
    }

    // Projection des points standards + homogènes
    const projectedStandard = points2D.flatMap(pt => [
      projectiveToSphere(pt.x, pt.y, 1),
      projectiveToSphere(-pt.x, -pt.y, -1)
    ]);

    const projectedHomogeneous = homogeneousPoints2D.flatMap(pt => [
      projectiveToSphere(pt.X, pt.Y, pt.Z),
      projectiveToSphere(-pt.X, -pt.Y, -pt.Z)
    ]);

    spherePoints = [...projectedStandard, ...projectedHomogeneous].filter(Boolean);
  } else {
    // Mode modulo
    points2D = computeModulo2D(curve, p);
    torusPoints = points2D.map(pt => projectTorus(pt.x, pt.y, p));
    spherePoints = points2D.map(pt => projectiveToSphere(pt.x, pt.y, 1)).filter(Boolean);
  }

  return {
    points2D,
    homogeneousPoints2D,
    points3D: [], // Extrusion non utilisée ici
    torus: field === "modulo" ? torusPoints : [],
    sphere: field === "real" ? spherePoints : []
  };
}

// Courbes classiques (x, y)
function computeReal2D_Combined(curve, xMin, xMax, resolution = 300, epsilon = 1e-6) {
  const plus = [], minus = [];
  const dx = (xMax - xMin) / resolution;

  for (let i = 0; i <= resolution; i++) {
    const x = xMin + i * dx;
    const val = curve.evaluate(x, "real");
    if (val >= 0) {
      let y = Math.sqrt(val);
      if (Math.abs(y) < epsilon) y = 0;
      plus.push({ x, y });
      minus.push({ x, y: -y });
    }
  }

  minus.reverse();
  return [...plus, ...minus];
}

// Courbes homogènes (X:Y:Z)
function computeReal2D_Homogeneous(curve, xMin, xMax, resolution = 300) {
  const pts = [];
  const dx = (xMax - xMin) / resolution;

  for (let i = 0; i <= resolution; i++) {
    const Z = xMin + i * dx;
    const X = 1; // uniquement X = 1 ici (comme dans le frontend d'origine)
    let F;

    switch (curve.constructor.name) {
      case "WeierstrassHomogeneous":
        F = X**3 + curve.a * X * Z**2 + curve.b * Z**3;
        break;
      case "MontgomeryHomogeneous":
        F = X**3 + curve.a * X**2 * Z + curve.b * X * Z**2;
        break;
      case "EdwardsHomogeneous":
        if (Math.abs(Z**2 - curve.d * X**2) < 1e-8) continue;
        F = (Z**4 - X**2 * Z**2) / (Z**2 - curve.d * X**2);
        break;
      default:
        continue;
    }

    const Y2 = F / Z;
    if (Y2 >= 0) {
      const Y = Math.sqrt(Y2);
      pts.push({ X, Y, Z });
      if (Y !== 0) pts.push({ X, Y: -Y, Z });
    }
  }

  return pts;
}

// Courbes modulo p
function computeModulo2D(curve, p) {
  const arr = [];
  for (let x = 0; x < p; x++) {
    const val = curve.evaluate(x, "modulo", p);
    const roots = modSqrtAll(val, p);
    for (const y of roots) {
      arr.push({ x, y });
    }
  }
  return arr;
}

// Instanciation de la courbe
function getCurveInstance(type, a, b, d) {
  switch (type) {
    case "weierstrass": return new Weierstrass(a, b);
    case "montgomery": return new Montgomery(a, b);
    case "edwards": return new Edwards(d);
    case "weierstrass_homogeneous": return new WeierstrassHomogeneous(a, b);
    case "montgomery_homogeneous": return new MontgomeryHomogeneous(a, b);
    case "edwards_homogeneous": return new EdwardsHomogeneous(d);
    default: throw new Error("Type de courbe non reconnu: " + type);
  }
}

module.exports = {
  generateCurvePoints
};
