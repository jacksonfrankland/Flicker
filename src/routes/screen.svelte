<script>
    import { db } from '../store.js';
    import Disc from '../game/Disc.js';
    import Vector from '../game/Vector.js';
    import { onMount, onDestroy } from 'svelte';
    import Fullscreen from '../components/Fullscreen.svelte';
    import GameCanvas from '../components/GameCanvas.svelte';
    import MouseEvents from '../components/MouseEvents.svelte';

    let discs = [];
    let canvas;
    let gameSubscription;

    onMount(async () => {
        gameSubscription = $db.from('games').on('UPDATE', payload => {
            if (discs.length === 0) return;
            discs[0].addForce(Vector.construct(payload.new.flick).multiply(.008));
        }).subscribe();
    });

    onDestroy(() => {
        if (gameSubscription) {
            gameSubscription.unsubscribe();
        }
    })

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
<Fullscreen />
