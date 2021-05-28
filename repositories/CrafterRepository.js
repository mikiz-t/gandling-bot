const BaseRepository = require('./BaseRepository')
const db = require('./../database')

module.exports = class CrafterRepository extends BaseRepository {
  constructor() {
    super();
    this.table = 'crafters';
  }

  async save(fields) {
    try {
      return await db(this.table)
        .insert(fields)
        .onConflict(['crafter', 'item_name', 'faction'])
        .ignore();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
