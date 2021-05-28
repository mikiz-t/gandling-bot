
exports.up = function(knex) {
  return knex.schema.createTable('items', function(table) {
    table.string('item_name').notNullable().unique();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('items');
};
