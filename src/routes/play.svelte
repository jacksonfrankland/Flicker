<script context="module">
    export async function preload(page, session) {
        if (!session.player) {
            const res = await this.fetch('players');
            const player = await res.json();
            session.player = player;
        }
    }
</script>

<script>
    import { db } from '../store.js';
    import { stores } from '@sapper/app';
    import { onMount, onDestroy } from 'svelte';
    import Join from '../components/Join.svelte';
    import { Spinner } from '@jacksonfrankland/game-kit';
    import Controller from '../components/Controller.svelte';

    const { session } = stores();

    let gameSubscription;
    let mounted = false;

    $: if (mounted && !gameSubscription && $session.player && $session.player.game) {
        gameSubscription = $db.from('games').eq('id', $session.player.game_id).on('UPDATE', async payload => {
            let players = $session.player.game.players;
            $session.player.game = {...payload.new, players};
            if ($session.player.game.deleted_at) {
                $session.player.game = null;
                unsubscribe();
            }
        }).subscribe();
    }

    onMount(async () => {
        if (!$session.player) {
            const res = await fetch('players', {
                method: 'post'
            });
            $session.player = await res.json();
        }
        mounted = true;
    });

    onDestroy(() => {
        unsubscribe();
    });

    function unsubscribe () {
        if (gameSubscription) {
            $db.removeSubscription(gameSubscription);
            gameSubscription = null;
        }
    }
</script>

{#if $session.player && $session.player.game && $session.player.game.started_at}
    <Controller />
{:else if $session.player}
    <Join />
{:else}
    <Spinner />
{/if}
