<script>
    export let game;
    import Disc from '../game/Disc.js';
    import {Vector, GameCanvas, MouseEvents, Prose} from '@jacksonfrankland/game-kit';


    let discs = [];
    let canvas;

    $: if ($game.flick && discs.length) {
        discs[0].transform.addForce(Vector.construct($game.flick).multiply(.008));
    }

    function update ({detail}) {
        detail.clear();
        Disc.collisionDetection(discs);
        discs.forEach(disc => disc.update(detail));
        discs.forEach(disc => disc.draw(detail));
        if ($game && $game.flick && discs.length && discs[0].transform.velocity.magnitudeSquared === 0) {
        }
    }

    function click({detail: point}) {
        if (point.x < 0 || point.x > (16/9) || point.y < 0 || point.y > 1) return;
        discs.push(new Disc(point, discs.length === 0 ? 'black' : 'white'));
    }
</script>

<Prose styles="absolute top-0 right-1 z-50"> <a href={'javascript:void(0)'} on:click={game.newGame()}> New Game </a> </Prose>
<MouseEvents element={canvas} on:click={click} />
<GameCanvas bind:canvas ratio={16/9} on:update={update} styles="bg-teal-400" />
