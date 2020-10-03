<script>
    export let styles = "";
    export let canvas;
    import { onMount } from 'svelte';
    import Vector from '../game/Vector.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let outerWidth, outerHeight;
    let scale = 1;
    $: canvasSize = Math.min(outerWidth, outerHeight) * scale;

    onMount(() => {
        scale = devicePixelRatio;
        let ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        let oldTimestamp;

        function clear () {
            ctx.clearRect(0, 0, canvasSize, canvasSize);
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

        function step (timestamp) {
            if (oldTimestamp === undefined) {
                oldTimestamp = timestamp;
            }
            let delta = timestamp - oldTimestamp;
            oldTimestamp = timestamp
            dispatch('update', {ctx, delta, canvasSize, clear, circle});
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
        class="m-auto {outerHeight > outerWidth ? 'w-full' : 'h-full'} {styles}"
        bind:this={canvas}
        width={canvasSize}
        height={canvasSize}
    ></canvas>
</div>
