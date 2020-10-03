import Vector from './Vector';

export default class Disc {

    constructor (position = new Vector(), color = 'yellow', radius = .03) {
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.velocity = new Vector();
        this.acceleration = new Vector();
    }

    static collisionDetection (discs) {
        discs.forEach((a, i) => {
            discs.slice(i + 1, discs.length).forEach(b => {
                if (a.position.distanceSquared(b.position) <= Math.pow(a.radius + b.radius, 2)) {
                    let aToB = b.position.subtract(a.position);
                    a.addForce(a.velocity.multiply(-1).projectOnto(aToB));
                    a.addForce(b.velocity.projectOnto(aToB));
                    b.addForce(b.velocity.multiply(-1).projectOnto(aToB));
                    b.addForce(a.velocity.projectOnto(aToB));
                }
            });
        })
    }

    update (detail) {
        // friction
        this.addForce(this.velocity.multiply(-.0015 * detail.delta));

        // apply acceleration
        this.velocity = this.velocity.add(this.acceleration);
        this.acceleration = new Vector();

        // bounce off bondaries
        if (this.position.x > detail.width - this.radius && this.velocity.x > 0) { // right
            this.addForce(Vector.left(this.velocity.x * 2));
        }
        if (this.position.x < 0 + this.radius && this.velocity.x < 0) { // left
            this.addForce(Vector.left(this.velocity.x * 2));
        }
        if (this.position.y > detail.height - this.radius && this.velocity.y > 0) { // bottom
            this.addForce(Vector.up(this.velocity.y * 2));
        }
        if (this.position.y < 0 + this.radius && this.velocity.y < 0) { // top
            this.addForce(Vector.up(this.velocity.y * 2));
        }
    }

    draw (detail) {
        this.position = this.position.add(this.velocity.multiply(detail.delta));
        detail.circle(this.position, this.radius, this.color);
    }

    addForce (force) {
        this.acceleration = this.acceleration.add(force);
    }
}
