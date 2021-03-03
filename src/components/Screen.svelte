<script>
    export let game;
    import Game from './Game.svelte';
    import Lobby from './Lobby.svelte';
    import {Fullscreen} from '@jacksonfrankland/game-kit';

    let fullscreen;
</script>

<div class="w-full h-full flex flex-col gap-4">
    {#if game.started_at && !game.deleted_at}
        <Game on:newGame fullscreen={fullscreen} />
    {:else}
        <Lobby url={process.env.URL} {game} on:newGame />
    {/if}
    <div class="w-full h-16">
        <Fullscreen styles="ml-auto" color="coolGray-400" bind:fullscreen={fullscreen} />
    </div>
</div>
