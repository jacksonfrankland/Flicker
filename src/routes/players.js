// get player
export async function get (req, res, next) {
    let player = null
    if (req.token && req.token.player_id) {
        try {
            player = (await req.db.from('players').select('*, game:game_id (*)').eq('id', req.token.player_id).single()).body;
        } catch (e) {
            player = null;
        }
    }
    res.json(player);
}

// create player
export async function post (req, res, next) {
    let player = (await req.db.from('players').insert([{}])).body[0];
    req.token.player_id = player.id;
    res.setToken(req.token);
    res.json(player);
}

// update player
export async function put (req, res, next) {
    let update = {};
    let game = null;
    if (req.body.code) {
        try {
            game = (await req.db.from('games').select('id').eq('code', req.body.code.toUpperCase()).is('deleted_at', null).single()).body;
            let players = (await req.db.from('players').select('team').eq('game_id', game.id)).body;
            update = {
                team: players.filter(player => player.team === 'red') >= players.filter(player => player.team === 'blue') ? 'blue' : 'red',
                game_id: game.id,
                in_game: true
            }
        } catch (e) {

        }
    }
    ['team', 'name'].forEach(field => {
        if (req.body[field]) {
            update[field] = req.body[field];
        }
    });
    await req.db.from('players').update(update).eq('id', req.token.player_id);
    res.json((await req.db.from('players').select('*, game:game_id (*)').eq('id', req.token.player_id).single()).body);
}

// leave game
export async function del (req, res, next) {
    await req.db.from('players').update({in_game: false}).eq('id', req.token.player_id);
    await req.db.from('players').update({game_id: null}).eq('id', req.token.player_id);
    res.json((await req.db.from('players').select('*, game:game_id (*)').eq('id', req.token.player_id).single()).body);
}
