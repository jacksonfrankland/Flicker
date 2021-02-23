<script>
    export let url, game;
    import {players, host} from '../store.js';
    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    $players = game.players;
</script>

<a class="text-white top-0 right-1 absolute hover:underline text-lg" href={'javascript:void(0)'} on:click={() => {dispatch('newGame')}}> New Game </a>
<div class="card grid max-w-2xl bg-white gap-8">
    <div class="mx-auto text-center">
        Visit
        <a class="hover:underline font-bold" href="play"> {url}/play </a>
        and use the code
        <span class="font-black font-mono"> {game.code} </span>
    </div>
    <ul>
        {#each $players.filter(player => player.name.length > 0).sort((a, b) => a.id - b.id) as player (player.id)}
            <li class="card shadow-none bg-green-200 text-center mb-2 p-2">
                {#if player.id == $host.id}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 inline">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                {/if}
                {player.name}
            </li>
        {/each}
    </ul>
</div>
