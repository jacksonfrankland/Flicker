// create player
export async function post (req, res, next) {
    let player = (await req.db.from('players').insert([{}])).data[0];
    req.token.player_id = player.id;
    req.token.game_id = null;
    res.setToken(req.token);
    res.json(player);
}

// update player
export async function put (req, res, next) {
    let game, player;
    let errors = [];
    ['name', 'code'].forEach(key => {
        if(!req.body[key]) {
            errors.push(`A ${key} is required`);
        }
    });
    if (errors.length) {
        res.json({errors});
        return;
    }
    try {
        game = (await req.db.from('games').select('*, players (*)').eq('code', req.body.code?.toUpperCase()).is('deleted_at', null).single()).data;
        if (!game) {
            res.json({errors: ["Couldn't find game"]});
            return;
        }
        let colors = [
            'red', 'orange', 'yellow', 'lime', 'emerald', 'cyan', 'blue', 'violet', 'fuchsia', 'rose'
        ].filter(color => game.players.map(player => player.color).indexOf(color) < 0);

        player = (await req.db.from('players').update({
            game_id: game.id,
            name: req.body.name,
            color: colors[Math.floor(Math.random() * colors.length)],
        }).eq('id', req.token.player_id).single()).data;
    } catch (e) {
        console.error(e);
    }
    game.players.push({...player});
    player.game = game;
    res.json(player);
}

// leave game
export async function del (req, res, next) {
    await req.db.from('players').update({in_game: false}).eq('id', req.token.player_id);
    await req.db.from('players').update({game_id: null}).eq('id', req.token.player_id);
    res.json((await req.db.from('players').select('*, game:game_id (*)').eq('id', req.token.player_id).single()).data);
}
