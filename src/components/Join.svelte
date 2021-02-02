<script>
    import { host, gameChannel } from '../store.js';
    import { stores } from '@sapper/app';
    import { Button, Card, Input, Prose, Label } from '@jacksonfrankland/game-kit';
    const { session } = stores();

    let code;
    let name = $session.player.name || '';

    console.log('join');

    async function update () {
        const res = await fetch('api/players', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({code, name}),
        });
        $session.player = await res.json();
    }

    function startGame () {
        fetch('api/games', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({started_at: true}),
        });
    }
</script>

<Card transition>
    <Prose styles="mx-auto">
        {#if $session.player.game}
            {#if $host && ($host.id === $session.player.id)}
                <Button styles="mt-6" on:click={startGame}> Everybody is ready </Button>
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
