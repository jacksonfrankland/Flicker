import { writable } from 'svelte/store';
import { createClient } from '@supabase/supabase-js';

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_KEY);

export function createGameStore (game) {
    const { subscribe, set, update } = writable(game);
    const unsubscribe = () => db.getSubscriptions().forEach(subscription => db.removeSubscription(subscription));
    const addSubscriptions = gameId => {
        db.from(`games:id=eq.${gameId}`).on('UPDATE', async payload => {
            update(value => ({...payload.new, players: value.players}));
            if (payload.new.deleted_at) {
                unsubscribe();
            }
        }).subscribe();
        db.from(`players:game_id=eq.${gameId}`).on('*', async payload => {
            update(value => {
                value.players = value.players.filter(player => player.id !== payload.new.id);
                value.players.push(payload.new);
                return value;
            })
        }).subscribe();
    }
    addSubscriptions(game.id);

    return {
        subscribe,
        unsubscribe,
        // async update (data) {
        //     await db.from('games').update(data).eq('id', game.id);
        // },
        async newGame () {
            unsubscribe();
            let res = await fetch('games', {
                method: 'delete',
            });
            res = await fetch('games', {
                method: 'post'
            });
            const game = await res.json();
            set(game);
            addSubscriptions(game.id);
        },
        async start () {
            await db.from('games').update({started_at: (new Date()).toISOString()}).eq('id', game.id);
        },
        async flick (flick) {
            await db.from('games').update({ flick }).eq('id', game.id);
        }
    }
}
