<script>
    export let game, ip;
    import {Card, Prose} from '@jacksonfrankland/game-kit';

    async function newGame () {
         const res = await fetch('games', {
            method: 'delete',
        });
    }
</script>

<Prose styles="absolute top-0 right-1"> <a href={'javascript:void(0)'} on:click={game.newGame()}> New Game </a> </Prose>
<Card transition>
    <Prose styles="text-center mx-auto">
        Visit
        <a href="{ip}:3000/play"> {ip}:3000/play </a>
        and use the code
        <span class="font-black font-mono"> {$game.code} </span>
        <table>
            <tbody>
                {#each $game.players.filter(player => player.name.length > 0) as player (player.id)}
                    <tr class="{player.team === 'blue' ? 'bg-blue-300' : 'bg-red-300'} text-center"> <td>
                        {#if player.host}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 inline">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        {/if}
                        {player.name}
                    </td> </tr>
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
