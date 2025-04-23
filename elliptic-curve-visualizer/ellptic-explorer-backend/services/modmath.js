/**
 * Retourne n mod p, toujours positif dans [0..p-1]
 */
function mod(n, p) {
    return ((n % p) + p) % p;
  }
  
  /**
   * Calcule l'inverse de a modulo p (a * x ≡ 1 mod p).
   * Algorithme d'Euclide étendu.
   * Retourne 0 si l'inverse n'existe pas (p n'est pas forcément premier).
   */
  function modInverse(a, p) {
    a = mod(a, p);
    if (a === 0) return 0; // pas d'inverse
  
    let t = 0, newT = 1;
    let r = p, newR = a;
  
    while (newR !== 0) {
      const q = Math.floor(r / newR);
      [t, newT] = [newT, t - q * newT];
      [r, newR] = [newR, r - q * newR];
    }
    // Si r > 1, pas d'inverse
    if (r > 1) return 0;
  
    // Ajustement si < 0
    if (t < 0) t += p;
    return mod(t, p);
  }
  
  /**
   * Renvoie toutes les solutions y (0 <= y < p) telles que y^2 ≡ n (mod p).
   * Recherche naïve : on teste y=0..p-1, 
   * => O(p) (lent pour p très grand).
   */
  function modSqrtAll(n, p) {
    n = mod(n, p);
    const solutions = [];
    for (let y = 0; y < p; y++) {
      if (mod(y * y, p) === n) {
        solutions.push(y);
      }
    }
    return solutions;
  }
  
  /**
   * (Facultatif) Vérifie naïvement si p est premier (O(√p)).
   * Peut servir à s'assurer que p est premier si on veut des propriétés de corps fini.
   */
  function isPrime(p) {
    if (p < 2) return false;
    for (let i = 2; i*i <= p; i++) {
      if (p % i === 0) return false;
    }
    return true;
  }
  
  module.exports = {
    mod,
    modInverse,
    modSqrtAll,
    isPrime
  };
  