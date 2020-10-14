<script>
    export let styles = "";
    export let ratio = 1;
    export let canvas;

    import { onMount } from 'svelte';
    import Vector from '../game/Vector.js';
    import { createEventDispatcher } from 'svelte';
    import CanvasHelper from '../game/CanvasHelper.js';

    const dispatch = createEventDispatcher();

    let outerWidth, outerHeight;
    let scale = 1;
    let canvasHelper = new CanvasHelper;

    $: {
        canvasHelper.width = ratio > 1 ? ratio : 1;
        canvasHelper.height = ratio < 1 ? 1 / ratio : 1;
        if (canvas) {
            canvasHelper.canvasSize = Math.min(outerWidth * canvasHelper.width, outerHeight * canvasHelper.height) * scale;
        }
    }

    onMount(() => {
        scale = devicePixelRatio;
        canvasHelper.ctx = canvas.getContext('2d');
        canvasHelper.ctx.scale(scale, scale);
        let oldTimestamp;

        function step (timestamp) {
            if (oldTimestamp === undefined) {
                oldTimestamp = timestamp;
            }
            canvasHelper.delta = timestamp - oldTimestamp;
            oldTimestamp = timestamp
            dispatch('update', canvasHelper);
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
        class="m-auto {outerHeight * canvasHelper.width > outerWidth * canvasHelper.height ? 'w-full' : 'h-full'} {styles}"
        bind:this={canvas}
        width={canvasHelper.canvasSize * canvasHelper.width}
        height={canvasHelper.canvasSize * canvasHelper.height}
    ></canvas>
</div>
