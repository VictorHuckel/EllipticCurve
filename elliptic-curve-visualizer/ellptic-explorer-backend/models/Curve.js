class Weierstrass {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    evaluate(x) {
        return Math.pow(x, 3) + this.a * x + this.b;
    }
}

class Montgomery {
    constructor(A, B) {
        this.A = A;
        this.B = B;
    }

    evaluate(x) {
        return Math.sqrt(x * (x * x + this.A * x + this.B));
    }
}

class Edwards {
    constructor(d) {
        this.d = d;
    }

    evaluate(x) {
        const numerator = 1 - Math.pow(x, 2);
        const denominator = 1 - this.d * Math.pow(x, 2);

        if (denominator === 0) {
            throw new Error("Division par zéro, valeur de x non valide sur la courbe.");
        }

        const y = Math.sqrt(numerator / denominator);
        return y;
    }
}
class TwistedEdwards {
    constructor(a, d) {
        this.a = a;
        this.d = d;
    }

    evaluate(x, y) {
        return this.a * x * x + y * y - 1 - this.d * x * x * y * y;
    }
}

module.exports = { Weierstrass, Montgomery, Edwards, TwistedEdwards };

