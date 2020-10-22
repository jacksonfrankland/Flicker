
exports.up = function (knex) {
    return knex.schema.createTable('games', table => {
        table.increments('id');
        table.string('code', 6).notNullable();
        table.jsonb('flick').notNullable().defaultTo(JSON.stringify({ x: 0, y: 0 }));
        table.timestamp('started_at');
        table.timestamps(true, true);
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('games');
};
