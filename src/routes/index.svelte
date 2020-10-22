<script context="module">
    export async function preload(page, session) {
        if (!session.game) {
            const res = await this.fetch('games');
            const game = await res.json();
            session.game = game;
        }
    }
</script>

<script>
    import { db } from '../store.js';
    import { stores } from '@sapper/app';
    import { onMount, onDestroy } from 'svelte';
    import Lobby from '../components/Lobby.svelte';
    import Screen from '../components/Screen.svelte';
    import Spinner from '../components/Spinner.svelte';
    import Fullscreen from '../components/Fullscreen.svelte';

    const { session } = stores();

    let subscriptions = [];

    onMount(async () => {
        if (!$session.game) {
            await newGame();
        }
        subscribe();
    });

    onDestroy(() => {
        unsubscribe();
    })

    async function newGame () {
        $session.game = null;
        const res = await fetch('games', {
            method: 'post'
        });
        $session.game = await res.json();
    }

    function unsubscribe () {
        subscriptions.forEach(subscription => $db.removeSubscription(subscription));
        subscriptions = [];
    }

    function subscribe () {
        subscriptions.push($db.from('games').eq('id', $session.game.id).on('UPDATE', async payload => {
            let players = $session.game.players;
            $session.game = {...payload.new, players};
            if ($session.game.deleted_at) {
                await newGame();
                unsubscribe();
                subscribe();
            }
        }).subscribe());
        subscriptions.push($db.from('players').eq('game_id', $session.game.id).on('*', payload => {
            console.log(payload);
            $session.game.players = [...$session.game.players.filter(player => player.id != payload.new.id), payload.new].filter(player => player.in_game);
        }).subscribe());
    }
</script>

{#if $session.game && $session.game.started_at}
    <Screen />
{:else if $session.game}
    <Lobby />
{:else}
    <Spinner />
{/if}
<Fullscreen />
