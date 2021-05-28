const db = require('./../database')

module.exports = class BaseRepository {
  constructor() {
    if (this.constructor === BaseRepository) {
      throw new Error('Abstract classes in JavaScript KEKW');
    }

    this.table = 'table';
  }

  /**
   * @param {string} column
   * @param {*} value
   */
  async find(column, value) {
    try {
      return await db(this.table)
        .where((qb) => {
          if (typeof value === 'string') {
            qb.whereRaw(`LOWER(${column}) = LOWER(?)`, [value])
          } else {
            qb.where({[column]: value})
          }
        });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * @param {string} column
   * @param {*} value
   */
  async findOne(column, value) {
    try {
      return await db(this.table)
        .where((qb) => {
          if (typeof value === 'string') {
            qb.whereRaw(`LOWER(${column}) = LOWER(?)`, [value])
          } else {
            qb.where({[column]: value})
          }
        })
        .limit(1);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * @param {string} column
   * @param {*} value
   * @param {number} limit
   */
  async findSimilar(column, value, limit = 5) {
    try {
      return await db(this.table)
        .orderByRaw(`SIMILARITY (${column}, ?) DESC`, [value])
        .limit(limit);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
    * @param {object} fields
   */
  async save(fields) {
    try {
      return await db(this.table).insert(fields);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * @param {object} fields
   */
  async delete(fields) {
    try {
      const query = db(this.table);
      
      for (let field in fields) {
        query.where((qb) => {
            if (typeof fields[field] === 'string') {
              qb.whereRaw(`LOWER(${field}) = LOWER(?)`, [fields[field]])
            } else {
              qb.where({field: fields[field]})
            }
          })
      }

      return await query.del();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
