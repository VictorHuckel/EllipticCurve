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
    constructor(c, d) {
        this.c = c;
        this.d = d;
    }

    evaluate(x, y) {
        return this.c * x * x + y * y - 1 - this.d * x * x * y * y;
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

