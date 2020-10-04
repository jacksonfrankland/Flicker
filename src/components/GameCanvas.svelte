<script>
    export let styles = "";
    export let ratio = 1;
    export let canvas;

    import { onMount } from 'svelte';
    import Vector from '../game/Vector.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let outerWidth, outerHeight;
    let scale = 1;
    $: width = ratio > 1 ? ratio : 1;
    $: height = ratio < 1 ? 1 / ratio : 1;
    $: canvasSize = Math.min(outerWidth * width, outerHeight * height) * scale;

    onMount(() => {
        scale = devicePixelRatio;
        let ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        let oldTimestamp;

        function clear () {
            ctx.clearRect(0, 0, canvasSize * width, canvasSize * height);
        }

        function circle (position, radius, fill) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = fill;
            let centre = position.multiply(canvasSize).round;
            ctx.arc(centre.x, centre.y, Math.round(radius * canvasSize), 0, Math.PI * 2, false);
            ctx.fill();
            ctx.restore();
        }

    // detail.svgPath(arrow, ORIGIN.add(Vector.up(.15)), .5, 1, 20, 20, scale, scale, 'yellow');
        function svgPath (d, position, xOffset, yOffset, vbWidth, vbHeight, width, height, fill) {
            ctx.save();
            ctx.translate(position.x * canvasSize, position.y * canvasSize);
            let path = new Path2D(d);
            ctx.scale(1 / vbWidth * canvasSize, 1 / vbHeight * canvasSize);
            ctx.scale(width, height);
            ctx.translate(vbWidth * (-.5 * (xOffset + 1)), vbHeight * (-.5 * (yOffset + 1)));
            ctx.fillStyle = fill;
            ctx.fill(path);
            ctx.restore();
        }

        function step (timestamp) {
            if (oldTimestamp === undefined) {
                oldTimestamp = timestamp;
            }
            let delta = timestamp - oldTimestamp;
            oldTimestamp = timestamp
            dispatch('update', {ctx, delta, canvasSize, clear, circle, width, height, svgPath});
            requestAnimationFrame(step);
        }
        let animationFrame = requestAnimationFrame(step);
        return () => {
            cancelAnimationFrame(animationFrame);
        }
    });
</script>

<div class="w-full h-full flex" bind:clientWidth={outerWidth} bind:clientHeight={outerHeight}>
    <canvas
        class="m-auto {outerHeight * width > outerWidth * height ? 'w-full' : 'h-full'} {styles}"
        bind:this={canvas}
        width={canvasSize * width}
        height={canvasSize * height}
    ></canvas>
</div>
