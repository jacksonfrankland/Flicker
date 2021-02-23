<script>
    import Disc from '../game/Disc.js';
    import { gameChannel } from '../store.js';
    import {Vector, GameCanvas, MouseEvents, Prose} from '@jacksonfrankland/game-kit';
    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    let discs = [];
    let canvas;

    if (process.browser) {
        $gameChannel.bind('client-flick', (data, metadata) => {
            if (discs.length) {
                discs[0].transform.addForce(Vector.construct(data).multiply(.006));
            }
        });
    }

    function update ({detail}) {
        detail.clear();
        Disc.collisionDetection(discs);
        discs.forEach(disc => disc.update(detail));
        discs.forEach(disc => disc.draw(detail));
        discs.filter(disc => disc.transform.velocity.magnitudeSquared > 0 && disc.transform.velocity.magnitudeSquared < .0000000001).forEach(disc => {
            console.log('stop');
            disc.transform.velocity = new Vector();
        });
    }

    function click({detail: point}) {
        if (point.x < 0 || point.x > (16/9) || point.y < 0 || point.y > 1) return;
        discs.push(new Disc(point, discs.length === 0 ? 'black' : 'white'));
    }
</script>

<Prose styles="absolute top-0 right-1 z-50"> <a href={'javascript:void(0)'} on:click={() => {dispatch('newGame')}}> New Game </a> </Prose>
<MouseEvents element={canvas} on:click={click} />
<GameCanvas bind:canvas ratio={16/9} on:update={update} styles="bg-teal-400 card p-0" />
