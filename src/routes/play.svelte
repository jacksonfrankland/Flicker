<script context="module">
    export async function preload(page, session) {
        if (!session.player) {
            const res = await this.fetch('player', {
                method: process.browser ? 'post' : 'get'
            });
            const player = await res.json();
            session.player = player;
        }
    }
</script>

<script>
    import { stores } from '@sapper/app';
    import { onMount, onDestroy } from 'svelte';
    import Join from '../components/Join.svelte';
    import { createGameStore } from '../database.js';
    import { Spinner } from '@jacksonfrankland/game-kit';
    import { createClient } from '@supabase/supabase-js';
    import Controller from '../components/Controller.svelte';

    const { session } = stores();
    let game;
    $: player = $game ? $game.players.find(player => player.id === $session.player.id) : $session.player;
    $: if (player && player.game) {
        console.log('test');
        game = createGameStore(player.game);
    }

    onDestroy(() => {
        game && game.unsubscribe();
    });

</script>
{#if $game && $game.started_at && !$game.deleted_at}
    <Controller {game} />
{:else if player}
    <Join {game} {player} on:playerReady={updatedPlayer => $session.player = updatedPlayer.detail} />
{:else}
    <Spinner />
{/if}
