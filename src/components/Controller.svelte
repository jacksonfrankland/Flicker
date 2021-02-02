<script>
    import { stores } from '@sapper/app';
    import { gameChannel } from '../store.js';
    import {Vector, GameCanvas, MouseEvents, Prose} from '@jacksonfrankland/game-kit';
    const { session } = stores();

    const RADIUS = .15;
    const ORIGIN = new Vector(.5, .5);
    const ORIGIN_TO_EDGE_MINUS_RADIUS = Vector.right(.5).subtract(Vector.right(RADIUS)).magnitude;

    let position = ORIGIN;
    let offset = new Vector();
    let dragging = false;
    let canvas;

    // $: currentPlayer = $session.player && $session.player.game.players.find(player => player.id === $session.player.game.turn_order[0][0]);

    function update ({detail}) {
        detail.clear();
        detail.circle(position, RADIUS, 'black');
        if (position != ORIGIN) {
            detail.ctx.save();
            detail.ctx.translate(ORIGIN.x * detail.canvasSize, ORIGIN.y * detail.canvasSize);
            detail.ctx.rotate(ORIGIN.subtract(position).radians);
            detail.ctx.translate(ORIGIN.x * detail.canvasSize * -1, ORIGIN.y * detail.canvasSize * -1);
            let arrow = 'M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z';
            let scale = ORIGIN.subtract(position).magnitude;
            detail.svgPath(arrow, 'white', ORIGIN.add(Vector.up(.15)), new Vector(0, 1), new Vector(20, 20), new Vector(scale, scale));
            detail.ctx.restore();
        }
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
        let flick = ORIGIN.subtract(position).basic;
        position = ORIGIN;
        $gameChannel.trigger('client-flick', flick);
    }

</script>

<!-- {#if currentPlayer.id === $session.player.id} -->
    <MouseEvents element={canvas} on:mouseDown={mouseDown} on:mouseMove={mouseMove} on:mouseUp={mouseUp} />
    <GameCanvas bind:canvas on:update={update} styles="bg-teal-400 rounded-full" />
<!-- {:else}
    <Prose> <h1> It's {currentPlayer.name}'s turn </h1> </Prose>
{/if} -->
