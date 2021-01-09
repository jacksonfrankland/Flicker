import {Howl} from 'howler';
import { Vector, Transform, boundaryBounce, manyToManyCollision, circleBounce } from '@jacksonfrankland/game-kit';

export default class Disc {

    constructor (position = new Vector(), color = 'yellow', radius = .03) {
        this.transform = new Transform(position);
        this.transform.friction = .0015;
        this.trails = [];
        this.radius = radius;
        this.color = color;
    }

    get collider () {
        return {
            shape: 'circle',
            radius: this.radius,
            position: this.transform.position
        }
    }

    static collisionDetection (discs) {
        manyToManyCollision(discs, (a, b) => circleBounce(a, b, intensity => Disc.hitSound(intensity)));
    }

    static hitSound (volume) {
        const sound = new Howl({
            src: ['sounds/Powerup20.wav'],
            volume: volume * 500
        });
        sound.play();
    }

    update (detail) {
        this.transform.update(detail.delta);

        // bounce off bondaries
        let soundDirection = {
            top: this.transform.velocity.y * -1,
            right: this.transform.velocity.x,
            bottom: this.transform.velocity.y,
            left: this.transform.velocity.x * -1
        }
        boundaryBounce(this.transform, this.radius, new Vector, new Vector(detail.width, detail.height), direction => {
            Disc.hitSound(soundDirection[direction]);
        });
    }

    draw (detail) {
        // trail effecrt
        this.trails.push({position: this.transform.position, timeLeft: 200});
        this.trails = this.trails.map(trail => {
            return {position: trail.position, timeLeft: trail.timeLeft - detail.delta}
        });
        this.trails = this.trails.filter(trail => trail.timeLeft > 0);
        this.trails.forEach(trail => detail.circle(trail.position, this.radius * trail.timeLeft / 200, this.color));

        // actual position
        this.transform.position = this.transform.position.add(this.transform.velocity.multiply(detail.delta));
        detail.circle(this.transform.position, this.radius, this.color);
    }
}
