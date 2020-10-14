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

    svgPath (d, fill, position, offset, viewBox, scale) {
        this.ctx.save();
        this.ctx.translate(position.x * this.canvasSize, position.y * this.canvasSize);
        let path = new Path2D(d);
        this.ctx.scale(1 / viewBox.x * this.canvasSize, 1 / viewBox.y * this.canvasSize);
        this.ctx.scale(scale.x, scale.y);
        this.ctx.translate(viewBox.x * (-.5 * (offset.x + 1)), viewBox.y * (-.5 * (offset.y + 1)));
        this.ctx.fillStyle = fill;
        this.ctx.fill(path);
        this.ctx.restore();
    }
}
