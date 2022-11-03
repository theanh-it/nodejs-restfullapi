const Model = require("../base/mysql/Model");
const DB    = require("../base/mysql/DB");
const db    = new DB({
    host    : process.env.MYSQL_HOST,
    user    : process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

module.exports = class DB1 extends Model {
    _db = db;
}