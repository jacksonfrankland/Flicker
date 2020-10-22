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
    import { onMount } from 'svelte';
    import { stores } from '@sapper/app';
    import Join from '../components/Join.svelte';
    import Spinner from '../components/Spinner.svelte';
    import Controller from '../components/Controller.svelte';

    const { session } = stores();

    onMount(async () => {
        if (!$session.player) {
            const res = await fetch('players', {
                method: 'post'
            });
            $session.player = await res.json();
        }
    });
</script>

{#if $session.player && $session.player.game && $session.player.game.started_at}
    <Controller />
{:else if $session.player}
    <Join />
{:else}
    <Spinner />
{/if}
