import {Howl} from 'howler';
import { Vector, Transform, boundaryBounce, manyToManyCollision, circleBounce, hexToRGBA } from '@jacksonfrankland/game-kit';
import {colors} from '../store.js';

export default class Disc {

    constructor (position = new Vector(), color = 'yellow', radius = .04) {
        this.transform = new Transform(position);
        this.transform.friction = .0015;
        this.particles = [];
        this.lightParticles = [];
        this.radius = radius;
        this.color = color;
        this.particalLife = 750;
        this.particleSpawn = 17;
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
        this.particles.forEach(particle => particle.transform.update(detail.delta));
    }

    draw (detail) {
        // particle effecrt

        if (!this.particles.length || this.particalLife - this.particles[this.particles.length - 1].timeLeft > this.particleSpawn) {
            let particle = {transform: new Transform(this.transform.position), timeLeft: this.particalLife, origin: new Vector(this.transform.position.x, this.transform.position.y)};
            particle.transform.velocity = new Vector(Math.random() * .00025 - .000125, Math.random() * .00025 - .000125);
            this.particles.push(particle);
            if (this.transform.velocity.magnitudeSquared > 0) {
                this.lightParticles.push(particle);
            }
        }
        this.particles = this.particles.map(particle => {
            return {...particle, timeLeft: particle.timeLeft - detail.delta}
        });
        this.lightParticles = this.lightParticles.map(particle => {
            return {...particle, timeLeft: particle.timeLeft - detail.delta}
        });
        this.particles = this.particles.filter(particle => particle.timeLeft > 0);
        this.lightParticles = this.lightParticles.filter(particle => particle.timeLeft > 0);
        this.particles.forEach(particle => {
            detail.circle(particle.transform.position, this.radius * particle.timeLeft / this.particalLife, colors[this.color][400]);
        });
        this.lightParticles.forEach(particle => {
            detail.circle(particle.origin.add(particle.transform.position.subtract(particle.origin).multiply(3)), this.radius * 2 * particle.timeLeft / this.particalLife, colors[this.color][400], true, 0, detail.additionalCtx[0]);
        });

        // actual position
        this.transform.position = this.transform.position.add(this.transform.velocity.multiply(detail.delta));
        detail.circle(this.transform.position, this.radius, colors[this.color][400]);
        detail.circle(this.transform.position, this.radius * this.transform.velocity.magnitudeSquared * 3, colors[this.color][400], true, 0, detail.additionalCtx[0]);

        detail.circle(this.transform.position.add(new Vector(this.radius * -.4, this.radius * -.3)), this.radius * .3, 'white');
        detail.circle(this.transform.position.add(new Vector(this.radius * -.4, this.radius * -.3)), this.radius * .1, colors[this.color][800]);
        detail.circle(this.transform.position.add(new Vector(this.radius * .4, this.radius * -.3)), this.radius * .3, 'white');
        detail.circle(this.transform.position.add(new Vector(this.radius * .4, this.radius * -.3)), this.radius * .1, colors[this.color][800]);

        if (this.transform.velocity.magnitudeSquared > 0) {
            detail.circle(this.transform.position.add(Vector.down(this.radius * .4)), this.radius * .3, colors[this.color][900]);
        } else {
            detail.ctx.save();
            detail.ctx.beginPath();
            detail.ctx.lineWidth = 10;
            detail.ctx.lineCap = 'round';
            detail.ctx.strokeStyle = colors[this.color][900];
            let centre = this.transform.position.add(Vector.down(this.radius * .3)).multiply(detail.canvasSize).round;
            detail.ctx.arc(centre.x, centre.y, Math.round(this.radius * .3 * detail.canvasSize), 0, Math.PI, false);
            detail.ctx.stroke();
            detail.ctx.restore();
        }
    }
}
