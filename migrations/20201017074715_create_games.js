
exports.up = function (knex) {
    return knex.schema.createTable('games', table => {
        table.increments('id');
        table.string('code', 4).notNullable();
        table.integer('current_player');
        table.timestamp('started_at');
        table.timestamps(true, true);
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('games');
};
