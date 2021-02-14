<script>
    export let url, game;
    import {Card, Prose} from '@jacksonfrankland/game-kit';
    import {players, host} from '../store.js';
    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    $players = game.players;
</script>

<Prose styles="absolute top-0 right-1"> <a href={'javascript:void(0)'} on:click={() => {dispatch('newGame')}}> New Game </a> </Prose>
<Card>
    <Prose styles="text-center mx-auto">
        Visit
        <a href="play"> {url}/play </a>
        and use the code
        <span class="font-black font-mono"> {game.code} </span>
        <table>
            <tbody>
                {#each $players.filter(player => player.name.length > 0).sort((a, b) => a.id - b.id) as player (player.id)}
                    <tr class="bg-green-200 text-center"> <td>
                        {#if player.id == $host.id}
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
