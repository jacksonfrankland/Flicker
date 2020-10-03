<script>
    import Vector from '../game/Vector.js';
    import GameCanvas from '../components/GameCanvas.svelte';
    import MouseEvents from '../components/MouseEvents.svelte';
    import { db } from '../store.js';

    const RADIUS = .15;
    const ORIGIN = new Vector(.5, .5);
    const ORIGIN_TO_EDGE_MINUS_RADIUS = Vector.right(.5).subtract(Vector.right(RADIUS)).magnitude;

    let position = new Vector(.5, .5);
    let offset = new Vector();
    let dragging = false;
    let canvas;

    function update ({detail}) {
        detail.clear();
        detail.circle(position, RADIUS, 'darkred');
    }

    function mouseDown ({detail: point}) {
        if (point.distanceSquared(ORIGIN) > Math.pow(RADIUS, 2)) return

        dragging = true;
        offset = point.subtract(ORIGIN);
        position = point.subtract(offset);
    }

    function mouseMove ({detail: point}) {
        if (!dragging) return;

        position = point.subtract(offset);
        if (position.distanceSquared(ORIGIN) > Math.pow(ORIGIN_TO_EDGE_MINUS_RADIUS, 2)) {
            position = position.subtract(ORIGIN).withMagnitude(ORIGIN_TO_EDGE_MINUS_RADIUS).add(ORIGIN);
        }
    }

    async function mouseUp () {
        dragging = false;
        offset = new Vector;
        const {x, y} = ORIGIN.subtract(position);
        position = ORIGIN;
        await $db.doc('games/IvZX12c3ceKR75285JEn').update({
            flick: {x, y}
        });
    }
</script>

<MouseEvents element={canvas} on:mouseDown={mouseDown} on:mouseMove={mouseMove} on:mouseUp={mouseUp} />
<GameCanvas bind:canvas on:update={update} styles="bg-teal-400 rounded-full" />
