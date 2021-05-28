
exports.up = function(knex) {
  return knex.schema.createTable('crafters', function(table) {
    table.increments();
    table.string('item_name');
    table.string('crafter');
    table.string('faction');

    table.unique(['item_name', 'crafter', 'faction']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('crafters');
};
