/**
 * This file defines the mathematical models for various types of elliptic curves.
 * It includes implementations for Weierstrass, Montgomery, and Edwards curves,
 * as well as their homogeneous forms.
 */

function mod(n, p) {
  // Computes the modulo operation ensuring a positive result.
  return ((n % p) + p) % p;
}

class Weierstrass {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  // Evaluates the Weierstrass curve equation: y² = x³ + ax + b
  evaluate(x, field = "real", p = null) {
    const val = x ** 3 + this.a * x + this.b;
    return (field === "modulo" && p) ? mod(val, p) : val;
  }
}

class Montgomery {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  // y² = x³ + ax² + bx
  evaluate(x, field = "real", p = null) {
    const val = x ** 3 + this.a * x ** 2 + this.b * x;
    return (field === "modulo" && p) ? mod(val, p) : val;
  }
}

class Edwards {
  constructor(d) {
    this.d = d;
  }

  // x² + y² = 1 + d x² y²
  // y² = (1 - x²)/(1 - d x²)
  evaluate(x, field = "real", p = null) {
    const num = 1 - x * x;
    const den = 1 - this.d * x * x;
    if (Math.abs(den) < 1e-14) return -1; // singularité
    const val = num / den;
    return (field === "modulo" && p) ? mod(val, p) : val;
  }
}

class WeierstrassHomogeneous {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  // Y²Z = X³ + aXZ² + bZ³
  evaluate(X, Y, Z, field = "real", p = null) {
    const lhs = Y * Y * Z;
    const rhs = X ** 3 + this.a * X * Z ** 2 + this.b * Z ** 3;
    const val = lhs - rhs;
    return (field === "modulo" && p) ? mod(val, p) : val;
  }
}

class MontgomeryHomogeneous {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  // Y²Z = X³ + aX²Z + bXZ²
  evaluate(X, Y, Z, field = "real", p = null) {
    const lhs = Y * Y * Z;
    const rhs = X ** 3 + this.a * X ** 2 * Z + this.b * X * Z ** 2;
    const val = lhs - rhs;
    return (field === "modulo" && p) ? mod(val, p) : val;
  }
}

class EdwardsHomogeneous {
  constructor(d) {
    this.d = d;
  }

  // X²Z² + Y²Z² = Z⁴ + dX²Y²
  evaluate(X, Y, Z, field = "real", p = null) {
    const lhs = (X * X + Y * Y) * (Z * Z);
    const rhs = Z ** 4 + this.d * X * X * Y * Y;
    const val = lhs - rhs;
    return (field === "modulo" && p) ? mod(val, p) : val;
  }
}

module.exports = {
  Weierstrass,
  Montgomery,
  Edwards,
  WeierstrassHomogeneous,
  MontgomeryHomogeneous,
  EdwardsHomogeneous
};

