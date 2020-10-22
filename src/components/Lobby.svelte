<script>
    import Card from './Card.svelte';
    import Prose from './Prose.svelte';
    import { stores } from '@sapper/app';
    const { session } = stores();

    async function newGame () {
         const res = await fetch('games', {
            method: 'delete',
        });
    }
</script>

<Prose styles="absolute top-0 right-1"> <a href={'javascript:void(0)'} on:click={newGame}> New Game </a> </Prose>
<Card transition>
    <Prose styles="text-center mx-auto">
        Visit
        <a href="{$session.ip}:3000/play"> {$session.ip}:3000/play </a>
        and use the code
        <span class="font-black font-mono"> {$session.game.code} </span>
        <table>
            <tbody>
                {#each $session.game.players.filter(player => player.name.length > 0) as player (player.id)}
                    <tr class="{player.team === 'blue' ? 'bg-blue-300' : 'bg-red-300'} text-center"> <td> {player.name} </td> </tr>
                {/each}
            </tbody>
        </table>
    </Prose>
</Card>

<style>
    td {
        padding-top: 0.5rem !important;
        padding-bottom: 0.5rem !important;
    }
</style>
