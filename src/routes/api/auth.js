export async function post (req, res, next) {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    if (req.token && req.token.game_id) { // screen
        try {
            let game = (await req.db.from('games').select('*, players (*)').eq('id', req.token.game_id).is('deleted_at', null).single()).body;
            if (game && game.code === channel.slice(channel.length - 4)) {
                res.send(req.pusher.authenticate(socketId, channel, {
                    user_id: 'screen',
                    user_info: {}
                }));
            }
        } catch (e) {}
    } else if (req.token && req.token.player_id) { // player
        try {
            let player = (await req.db.from('players').select('*, game:game_id (*)').eq('id', req.token.player_id).single()).body;
            if (player && player.game && !player.game.deleted_at && player.game.code === channel.slice(channel.length - 4)) {
                res.send(req.pusher.authenticate(socketId, channel, {
                    user_id: `player${player.id}`,
                    user_info: player
                }));
            }

        } catch (e) {console.log(e)}
    } else { // auth failed
        res.status(403).end();
    }
}
