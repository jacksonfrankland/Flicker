
exports.up = function(knex) {
    return knex.schema.createTable('players', table => {
        table.increments('id');
        table.string('name').notNullable().defaultTo('');
        table.boolean('host').notNullable().defaultTo(false);
        // table.boolean('in_game').notNullable().defaultTo(false);
        table.string('auth_id');
        table.integer('game_id').unsigned().references('id').inTable('games').onDelete('cascade');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('players');
};
