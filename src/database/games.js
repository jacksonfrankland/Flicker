import {customAlphabet as nanoid} from 'nanoid';

export async function get (id, db) {
    let game;
    try {
        game = (await db.from('games').select('*, players (*)').eq('id', id).is('deleted_at', null).single()).body;
    } catch (e) {
        game = null;
        console.error(e);
    }
    return game;
}

export async function create (db) {
    let gameCodes = (await db.from('games').select('code').is('deleted_at', null)).body.map(game => game.code);
    let code;
    for (let i = 0; i < 3; i++) {
        let newCode = nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)();
        if (!gameCodes.find(existingCode => newCode === existingCode)) {
            code = newCode
            break
        }
    }
    let game = (await db.from('games').insert([{ code }])).body[0];
    game.players = [];

    return game;
}
