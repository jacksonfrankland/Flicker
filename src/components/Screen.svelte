<script>
    export let game;
    import Game from './Game.svelte';
    import Lobby from './Lobby.svelte';
    import {Fullscreen} from '@jacksonfrankland/game-kit';
</script>

{#if game.started_at && !game.deleted_at}
    <Game on:newGame />
{:else}
    <Lobby url={process.env.URL} code={game.code} on:newGame />
{/if}
<Fullscreen />
