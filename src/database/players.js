export async function get (id, db) {
    let player;
    try {
        player = (await db.from('players').select('*, game:game_id (*, players (*))').eq('id', id).single()).data;
        if (player && player.game && player.game.deleted_at) {
            player.game = null;
        }
    } catch (e) {
       console.error(e);
    }
    return player;
}

export async function create (db) {
    return (await db.from('players').insert([{}])).data[0];
}
