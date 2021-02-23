<script>
    import { host, gameChannel } from '../store.js';
    import { stores } from '@sapper/app';
    import { Button, Card, Input, Prose, Label, Spinner } from '@jacksonfrankland/game-kit';
    const { session } = stores();

    let code;
    let name = $session.player.name || '';
    let errors = [];
    let loaded = (async () => true)();

    function update () {
        loaded = (async () => {
            const res = await fetch('api/players', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({code, name}),
            });
            let data = await res.json();
            errors = data.errors ?? [];
            $session.player = data.errors ? $session.player : data;
        })();
    }

    function startGame () {
        loaded = (async () => {
            const res = await fetch('api/games', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({started_at: true}),
            });
            $session.player.game = await res.json();
        })();
    }
</script>

<div class="card grid grid-cols-1 max-w-2xl gap-8 bg-white">
    {#if errors.length}
        <div class="card text-sm text-red-700 bg-red-50 shadow-none">
            <ul class="list-disc pl-5 space-y-1">
                {#each errors as error}
                    <li> {error} </li>
                {/each}
            </ul>
        </div>
    {/if}
    {#if $session.player.game}
        {#if $host?.id === $session.player.id}
            {#await loaded}
                <Button color="gray-700" disabled styles="mx-auto px-8"> <Spinner size="6" padding="0" /> </Button>
            {:then complete}
                <Button color="gray-700" styles="mx-auto px-8" on:click={startGame}> Everybody is ready </Button>
            {/await}
        {:else}
            <h1 class="mx-auto"> Waiting to start </h1>
        {/if}
    {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
        <div>
            <label for="name"> Name </label>
            <input bind:value={name} id="name" />
        </div>
        <div>
            <label for="code"> Code </label>
            <input bind:value={code} id="code" class="uppercase" maxlength="4" />
        </div>
    </div>
    {#await loaded}
        <button class="bg-gray-700 ml-auto" disabled> <Spinner size="6" padding="0" /> </button>
    {:then player}
        <button class="bg-gray-700 ml-auto" on:click={update}> Join </button>
    {/await}
    {/if}
</div>
