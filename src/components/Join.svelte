<script>
    import Card from './Card.svelte';
    import Label from './Label.svelte';
    import Input from './Input.svelte';
    import Button from './Button.svelte';
    import Prose from './Prose.svelte';
    import { stores } from '@sapper/app';
    const { session } = stores();

    let code;
    let name = $session.player.name;
    let team = $session.player.team || 'blue';
    let typingTimeout;

    async function update () {
        const res = await fetch('players', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({code, name, team}),
        });
        $session.player = await res.json();
    }

    async function leaveGame () {
        const res = await fetch('players', {
            method: 'delete',
        });
        $session.player = await res.json();
        code = '';
        color = '';
    }

    function type () {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        typingTimeout = setTimeout(update, 1000);
    }
</script>

{#if $session.player.game}
    <Prose styles="absolute top-0 right-1"> <a href={'javascript:void(0)'} on:click={leaveGame}> Leave Game </a> </Prose>
{/if}
<Card transition>
    <Prose styles="mx-auto">
        {#if $session.player.game}
            <Label control="name"> Name </Label>
            <Input bind:value={name} on:input={type} id="name" styles="mb-4" />
            <Label control="team"> Team </Label>
            <div class="w-full h-10 grid gap-4 grid-cols-2">
                <div on:click={() => {team = 'blue'; update();}} class="bg-blue-400 rounded-md {team === 'blue' ? 'border-solid border-4 border-gray-500' : ''}"></div>
                <div on:click={() => {team = 'red'; update();}} class="bg-red-400 rounded-md {team === 'red' ? 'border-solid border-4 border-gray-500' : ''}"></div>
            </div>
        {:else}
            <Label control="code"> Code </Label>
            <Input bind:value={code} id="code" styles="uppercase mb-4" placeholder="ABCDEF" />
            <br />
            <Button on:click={update}> Join </Button>
        {/if}
    </Prose>
</Card>
