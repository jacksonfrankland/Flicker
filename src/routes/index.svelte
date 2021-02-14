<script>
    import { createGameChannel, players, pusher, gameChannel } from '../store.js';
    import Screen from '../components/Screen.svelte';
    import { Spinner } from '@jacksonfrankland/game-kit';
    import { stores } from '@sapper/app';
	const { session } = stores();

    function newGame () {
        loadingGame = (async () => {
            await fetch('api/games', {method: 'delete'});
            pusher.unsubscribe($gameChannel.name);
            const res = await fetch('api/games', {method: 'post'});
            $gameChannel = null;
            $players = [];
            return await res.json();
        })();
    }

    let loadingGame = process.browser ? (async () => $session.game)() : false;

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
{:else}
    <Screen game={$session.game} />
{/if}

