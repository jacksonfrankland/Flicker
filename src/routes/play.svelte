<script>
    import { stores } from '@sapper/app';
    import { onMount } from 'svelte';
    import Join from '../components/Join.svelte';
    import { createGameChannel, gameChannel, pusher } from '../store.js';
    import { Spinner } from '@jacksonfrankland/game-kit';
    import Controller from '../components/Controller.svelte';

    const { session } = stores();

    $: if (process.browser && $session.player.game) {
        createGameChannel($session.player.game.code);
        console.log('gameChannel', $gameChannel);
        $gameChannel.bind('game-deleted', (data, metadata) => {
            pusher.unsubscribe($gameChannel.name);
            $session.player.game = null;
        });
        $gameChannel.bind('game-updated', (data, metadata) => {
            $session.player.game = data;
        });
    }

</script>
{#if $session.player.game && $session.player.game.started_at && !$session.player.game.deleted_at}
    <Controller />
{:else}
    <Join />
{/if}
