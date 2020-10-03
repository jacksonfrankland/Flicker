export default class Vector {

    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static create (x, y) {
        return new Vector(x, y);
    }

    static right (x = 1) {
        return new Vector(x, 0);
    }

    static left (x = 1) {
        return new Vector(x * -1, 0);
    }

    static up (y = 1) {
        return new Vector(0, y * -1);
    }

    static down (y = 1) {
        return new Vector(0, y);
    }

    get round () {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }

    get magnitudeSquared () {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }

    get magnitude () {
        return Math.sqrt(this.magnitudeSquared);
    }

    get unit () {
        let magnitude = this.magnitude;
        return new Vector (this.x / magnitude, this.y / magnitude);
    }

    get degrees () {
        if (this.x === 0) {
            return this.y > 0 ? 180 : 0;
        }
        return Math.atan (this.y / this.x) * 180 / Math.PI + (this.x > 0 ? 90 : -90);
    }

    add (other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    subtract (other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    multiply (scalar) {
        return new Vector (this.x * scalar, this.y *scalar);
    }

    distanceSquared (other) {
        return this.subtract(other).magnitudeSquared;
    }

    withMagnitude (magnitude) {
        return this.unit.multiply(magnitude);
    }

    dot (other) {
        return this.x * other.x + this.y * other.y;
    }

    angleBetween (other) {
        return Math.acos(this.dot(other) / (this.magnitude * other.magnitude))
    }

    projectOnto (other) {
        return other.withMagnitude(this.dot(other.unit));
    }

}
