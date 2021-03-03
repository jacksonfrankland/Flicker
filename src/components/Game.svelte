<script>
    export let fullscreen;

    import Disc from '../game/Disc.js';
    import { gameChannel, colors } from '../store.js';
    import {Vector, GameCanvas, MouseEvents, Prose} from '@jacksonfrankland/game-kit';
    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    let discs = [];
    let canvas;

    discs.push(new Disc(new Vector(.5, .5), 'pink'));

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

<a class="text-coolGray-400 hover:underline text-lg pr-2 ml-auto" href={'javascript:void(0)'} on:click={() => {dispatch('newGame')}}> New Game </a>
<!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-16 w-16 inline" style="fill: {$colors.rose[300]}; stroke: {$colors.rose[900]}">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg> -->
<MouseEvents element={canvas} on:click={click} />
<GameCanvas bleed={new Vector(2, fullscreen ? 4 : 8)} bind:canvas ratio={16/9} on:update={update} styles="bg-coolGray-600 border-dashed border-4 border-cool-gray-800 p-0 rounded-lg" />
