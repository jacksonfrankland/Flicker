import {create} from '../../database/games.js';

export async function post (req, res, next) {
    let game = await create(req.db);
    res.setToken({game_id: game.id});
    res.json(game);
}

export async function put (req, res, next) {
    let game = req.token.game_id
        ? req.token.game_id
        : (await req.db.from('players').select('*, game:game_id (*, players (*))').eq('id', req.token.player_id).single()).data.game;

    if (req.body.started_at) {
        req.body.started_at = (new Date()).toISOString();

    }
    game = (await req.db.from('games').update({
        started_at: req.body.started_at,
        current_player: game.players.reduce((host, player) => player.id < host.id ? player : host).id
    }).eq('id', game.id)).data[0];
    req.pusher.trigger(`presence-game-${game.code}`, 'game-updated', game);
    res.json(game);
}

export async function del (req, res, next) {
    let game = (await req.db.from('games').update({deleted_at: (new Date()).toISOString()}).eq('id', req.token.game_id)).data[0];
    req.pusher.trigger(`presence-game-${game.code}`, 'game-deleted', {});
    res.json(true);
}
