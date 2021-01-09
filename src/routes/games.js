import {customAlphabet as nanoid} from 'nanoid';

// get game
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

// create game
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
    game.players = [];
    req.token.game_id = game.id;
    res.setToken(req.token);
    res.json(game);
}

// Start game
export async function put (req, res, next) {
    let player = (await req.db.from('players').select('*, game:game_id (*, players (*))').eq('id', req.token.player_id).single()).body
    let turnOrder = [
        player.game.players.filter(player => player.team === 'blue').map(player => player.id),
        player.game.players.filter(player => player.team === 'red').map(player => player.id),
    ]
    res.json((await req.db.from('games').update({started_at: (new Date()).toISOString(), turn_order: turnOrder}).eq('id', player.game_id)).body[0]);
}

// Quit game
export async function del (req, res, next) {
    await req.db.from('games').update({deleted_at: (new Date()).toISOString()}).eq('id', req.token.game_id);
    res.json(true);
}
