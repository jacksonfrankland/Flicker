<script context="module">
    export async function preload(page, session) {
        if (!session.game) {
            const res = await this.fetch('game', {
                method: process.browser ? 'post' : 'get'
            });
            const game = await res.json();
            session.game = game;
        }
    }
</script>

<script>
    import { createGameStore } from '../database.js';
    import { stores } from '@sapper/app';
    import { onMount, onDestroy } from 'svelte';
    import Lobby from '../components/Lobby.svelte';
    import Screen from '../components/Screen.svelte';
    import { Fullscreen, Spinner } from '@jacksonfrankland/game-kit';

    const { session } = stores();
    let game, players;

    onMount(() => {
        game = createGameStore($session.game);
    });

    onDestroy(() => {
        game && game.unsubscribe();
    })
</script>

{#if $game && $game.started_at}
    <Screen {game} />
{:else if $game}
    <Lobby {game} ip={$session.ip} />
{/if}
<Fullscreen />
