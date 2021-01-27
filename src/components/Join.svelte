<script>
    export let player, game;
    import { stores } from '@sapper/app';
    import { createEventDispatcher } from 'svelte';
    import { Button, Card, Input, Prose, Label } from '@jacksonfrankland/game-kit';
    const { session } = stores();

    const dispatch = createEventDispatcher();

    let code;
    let name = player.name || '';
    let typingTimeout;

    async function update () {
        const res = await fetch('player', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({code, name}),
        });
        player = await res.json();
        dispatch('playerReady', player);
    }
</script>

<Card transition>
    <Prose styles="mx-auto">
        {#if $session.player.game}
            {#if $session.player.host}
                <Button styles="mt-6" on:click={() => {game.start()}}> Everybody is ready </Button>
            {:else}
                <h1> Waiting to start </h1>
            {/if}
        {:else}
            <Label control="code"> Code </Label>
            <Input bind:value={code} id="code" styles="uppercase mb-4" placeholder="ABCD" />
            <Label control="name"> Name </Label>
            <Input bind:value={name} id="name" styles="mb-4" />
            <br />
            <Button on:click={update}> Join </Button>
        {/if}
    </Prose>
</Card>
