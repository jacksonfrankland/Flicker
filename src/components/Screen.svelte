<script>
    import Disc from '../game/Disc.js';
    import { stores } from '@sapper/app';
    import Vector from '../game/Vector.js';
    import GameCanvas from './GameCanvas.svelte';
    import MouseEvents from './MouseEvents.svelte';

    const { session } = stores();

    let discs = [];
    let canvas;

    $: if ($session.game && discs.length) {
        discs[0].addForce(Vector.construct($session.game.flick).multiply(.008));
    }

    function update ({detail}) {
        detail.clear();
        Disc.collisionDetection(discs);
        discs.forEach(disc => disc.update(detail));
        discs.forEach(disc => disc.draw(detail));
    }

    function click({detail: point}) {
        if (point.x < 0 || point.x > (16/9) || point.y < 0 || point.y > 1) return;
        discs.push(new Disc(point, discs.length === 0 ? 'black' : 'white'));
    }
</script>

<MouseEvents element={canvas} on:click={click} />
<GameCanvas bind:canvas ratio={16/9} on:update={update} styles="bg-teal-400" />
