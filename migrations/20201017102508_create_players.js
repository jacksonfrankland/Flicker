
exports.up = function(knex) {
    return knex.schema.createTable('players', table => {
        table.increments('id');
        table.string('name').notNullable().defaultTo('');
        table.string('color').notNullable().defaultTo('');
        table.integer('health').notNullable().defaultTo(100);
        table.integer('game_id').unsigned().references('id').inTable('games').onDelete('cascade');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('players');
};
