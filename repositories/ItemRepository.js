const BaseRepository = require('./BaseRepository')

module.exports = class ItemRepository extends BaseRepository {
  constructor() {
    super();
    this.table = 'items';
  }
}
