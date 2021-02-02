import {customAlphabet as nanoid} from 'nanoid';

export async function get (req, res, next) {
    let game = null;
    if (req.token && req.token.game_id) {
        try {
            game = (await req.db.from('games').select('*, players (*)').eq('id', req.token.game_id).is('deleted_at', null).single()).body;
        } catch (e) {
            game = null;
        }
    }
    res.json(game);
}

export async function post (req, res, next) {
    let gameCodes = (await req.db.from('games').select('code').is('deleted_at', null)).body.map(game => game.code);
    let code;
    for (let i = 0; i < 3; i++) {
        let newCode = nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)();
        if (!gameCodes.find(existingCode => newCode === existingCode)) {
            code = newCode
            break
        }
    }
    let game = (await req.db.from('games').insert([{ code }])).body[0];
    req.token.game_id = game.id;
    req.token.player_id = null;
    res.setToken(req.token);
    game.players = [];
    res.json(game);
}

export async function put (req, res, next) {
    let gameId = req.token.game_id
        ? req.token.game_id
        : (await req.db.from('players').select('*, game:game_id (*, players (*))').eq('id', req.token.player_id).single()).body.game.id;

    if (req.body.started_at) {
        req.body.started_at = (new Date()).toISOString();
    }
    let game = (await req.db.from('games').update({started_at: req.body.started_at}).eq('id', gameId)).body[0];
    req.pusher.trigger(`presence-game-${game.code}`, 'game-updated', game);
    res.json(game);
}

export async function del (req, res, next) {
    let game = (await req.db.from('games').update({deleted_at: (new Date()).toISOString()}).eq('id', req.token.game_id)).body[0];
    req.pusher.trigger(`presence-game-${game.code}`, 'game-deleted', {});
    res.json(true);
}
