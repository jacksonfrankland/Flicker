<script context="module">
    export async function preload(page, session) {
        if (!session.game) {
            const res = await this.fetch('api/games', {
                method: process.browser ? 'post' : 'get'
            });
            session.game = await res.json();
        }
    }
</script>

<script>
    import { createGameChannel, gameChannel, players, newGame, pusher } from '../store.js';
    import { stores } from '@sapper/app';
    import { onMount } from 'svelte';
    import Lobby from '../components/Lobby.svelte';
    import Screen from '../components/Screen.svelte';
    import { Fullscreen, Spinner } from '@jacksonfrankland/game-kit';

    const { session } = stores();

    onMount(() => {
        createGameChannel($session.game.code);
    });

    $: if ($gameChannel) {
        $gameChannel.bind('game-deleted', async (data, metadata) => {
            pusher.unsubscribe($gameChannel.name);
            const res = await fetch('api/games', {method: 'post'});
            $session.game = await res.json();
            createGameChannel($session.game.code);
        });
        $gameChannel.bind('game-updated', (data, metadata) => {
            $session.game = data;
        });
    }

</script>
<!-- {#if $game && $game.started_at}
    <Screen {game} />
{:else if $game}
    <Lobby {game} ip={$session.ip} />
{/if}
<Fullscreen /> -->

{#if $session.game && $session.game.started_at && !$session.game.deleted_at}
    <Screen />
{:else if $gameChannel}
    <Lobby ip={$session.ip} code={$session.game.code} />
{/if}
<Fullscreen />
