<script context="module">
    export async function preload (page, session) {
        let res = await this.fetch('api/games', { method: 'get' });
        let game = await res.json();
        return {game};
    }
</script>

<script>
    export let game;
    import { createGameChannel, players, pusher, gameChannel } from '../store.js';
    import { onMount } from 'svelte';
    import Lobby from '../components/Lobby.svelte';
    import Screen from '../components/Screen.svelte';
    import { Fullscreen, Spinner } from '@jacksonfrankland/game-kit';

    async function loadGame () {
        if (!game) {
            let res = await fetch('api/games', { method: 'post' });
            game = await res.json();
        }
        return game;
    }

    function newGame () {
        loadingGame = (async () => {
            await fetch('api/games', {method: 'delete'});
            pusher.unsubscribe($gameChannel.name);
            const res = await fetch('api/games', {method: 'post'});
            $gameChannel = null;
            return await res.json();
        })();
    }

    let loadingGame = process.browser ? loadGame() : false;

    $: if (loadingGame) {
        loadingGame.then(game => {
            if ($gameChannel) return;

            createGameChannel(game.code);
            $gameChannel.bind('game-updated', (data, metadata) => {
                loadingGame = (async () => data)();
            });
        });
    }
</script>

{#if process.browser}
    {#await loadingGame}
        <Spinner />
    {:then game}
        <Screen {game} on:newGame={newGame} />
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
{:else if game}
    <Screen {game} />
{/if}

