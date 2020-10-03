<script>
    import { db } from '../store.js';
    import Disc from '../game/Disc.js';
    import Vector from '../game/Vector.js';
    import { onMount, onDestroy } from 'svelte';
    import GameCanvas from '../components/GameCanvas.svelte';
    import MouseEvents from '../components/MouseEvents.svelte';

    let discs = [];
    let canvas;
    let stopUpdates;

    onMount(async () => {
        setInterval(() => {
            if (discs.length > 0) {
                // console.log(discs[0].velocity);
            }
        }, 500)
        stopUpdates = $db.doc('games/IvZX12c3ceKR75285JEn').onSnapshot(doc => {
            if (discs.length === 0) return;
            let {flick} = doc.data();
            discs[0].addForce(Vector.create(flick.x, flick.y).multiply(.008));
        })
    });

    onDestroy(() => {
        if (stopUpdates) {
            stopUpdates();
        }
    })

    function update ({detail}) {
        Disc.collisionDetection(discs);
        discs.forEach(disc => disc.update(detail.delta));
        detail.clear();
        discs.forEach(disc => disc.draw(detail));
    }

    function click({detail: point}) {
        discs.push(new Disc(point, discs.length === 0 ? 'darkred' : 'yellow'));
    }
</script>

<MouseEvents element={canvas} on:click={click} />
<GameCanvas bind:canvas on:update={update} styles="bg-teal-400" />
