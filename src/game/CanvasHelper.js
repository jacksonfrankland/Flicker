export default class CanvasHelper {
    ctx;
    delta;
    canvasSize;
    width;
    height;

    clear () {
        this.ctx.clearRect(0, 0, this.canvasSize * this.width, this.canvasSize * this.height);
    }

    circle (position, radius, fill) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = fill;
        let centre = position.multiply(this.canvasSize).round;
        this.ctx.arc(centre.x, centre.y, Math.round(radius * this.canvasSize), 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.restore();
    }

    svgPath (d, position, xOffset, yOffset, vbWidth, vbHeight, width, height, fill) {
        this.ctx.save();
        this.ctx.translate(position.x * this.canvasSize, position.y * this.canvasSize);
        let path = new Path2D(d);
        this.ctx.scale(1 / vbWidth * this.canvasSize, 1 / vbHeight * this.canvasSize);
        this.ctx.scale(width, height);
        this.ctx.translate(vbWidth * (-.5 * (xOffset + 1)), vbHeight * (-.5 * (yOffset + 1)));
        this.ctx.fillStyle = fill;
        this.ctx.fill(path);
        this.ctx.restore();
    }
}
