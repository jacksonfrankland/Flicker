// get player
export async function get (req, res, next) {
    let player = null

    if (req.token && req.token.player_id) {
        try {
            player = (await req.db.from('players').select('*, game:game_id (*, players (*))').eq('id', req.token.player_id).single()).body;
            if (player.game.deleted_at) {
                player = null;
            }
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
    let game, player;
    if (req.body.code) {
        try {
            game = (await req.db.from('games').select('*, players (*)').eq('code', req.body.code.toUpperCase()).is('deleted_at', null).single()).body;
            player = (await req.db.from('players').update({
                game_id: game.id,
                name: req.body.name,
                host: game.players.length === 0
            }).eq('id', req.token.player_id).single()).body;
        } catch (e) {
            console.log(e);
        }
    }
    game.players.push({...player});
    player.game = game;
    res.json(player);
}

// leave game
export async function del (req, res, next) {
    await req.db.from('players').update({in_game: false}).eq('id', req.token.player_id);
    await req.db.from('players').update({game_id: null}).eq('id', req.token.player_id);
    res.json((await req.db.from('players').select('*, game:game_id (*)').eq('id', req.token.player_id).single()).body);
}
