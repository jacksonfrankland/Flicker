import Pusher from 'pusher-js';
import { writable, derived } from 'svelte/store';

export {default as colors} from 'tailwindcss/colors';

export const pusher = new Pusher(process.env.PUSHER_KEY, {
    cluster: process.env.PUSHER_CLUSTER,
    authEndpoint: '/api/auth'
});

export const players = writable([]);
export const host = derived(players, $players => $players.length ? $players.reduce((host, player) => player.id < host.id ? player : host) : null);
export const gameChannel = writable(null);

export function createGameChannel (code) {
    const channel = pusher.subscribe(`presence-game-${code}`);
    channel.bind('pusher:subscription_succeeded', function(members) {
        console.log('pusher:subscription_succeeded', 'members', members);
        players.set([]);
        members.each(member => addMember(member));
    });
    channel.bind('pusher:subscription_error', function(err) {
        console.log('pusher:subscription_error', 'err', err);
    });
    channel.bind('pusher:member_added', function(member) {
        console.log('pusher:member_added', 'member', member);
        addMember(member);
    });
    channel.bind('pusher:member_removed', function(member) {
        console.log('pusher:member_removed', 'member', member);
        // players.update(players => players.filter(player => player.id != member.info.id));
      });
    gameChannel.set(channel);
    return channel;
}

export async function newGame () {
    await fetch('api/games', {method: 'delete'});
}

function addMember (member) {
    players.update(players => {
        if (member.id !== 'screen' && !players.find(player => player.id == member.info.id)) {
            players.push(member.info);
        }
        return players;
    })
}

