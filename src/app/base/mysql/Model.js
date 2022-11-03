const Delete = require("./Delete");

module.exports = class Model extends Delete {
    constructor(table, primaryKey = "id"){
        super(table, primaryKey);
    }

    clear() {
        this._action = "";
        this._select = "";
        this._join = [];
        this._leftJoin = [];
        this._rightJoin = [];
        this._groupBy = [];
        this._having = [];
        this._orderBy = [];
        this._limit = { begin: 0, size: 0 };
        this._where = [];
        this._whereRaw = [];
        this._whereIn = [];
        this._whereNotIn = [];
        this._search = false;
        this._update = "";
        this._insert = "";
    }

    toSql() {
        var result;
        if (this._action == "insert")
            result = this.toSqlInsert();
        else if (this._action == "update")
            result = this.toSqlUpdate();
        else if (this._action == "select")
            result = this.toSqlSelect();
        else if (this._action == "delete")
            result = this.toSqlDelete();
        this.clear();
        return result;
    }

    run() {
        var data = this.toSql();
        if (data.params.length)
            return this.query(data.sql, data.params);
        else
            return this.query(data.sql);
    }

    getAll() {
        return this.select("*")
            .run();
    }

    getSingle(id) {
        console.log(this._primaryKey);
        return this.select("*").where(this._primaryKey, id).run();
    }

    create(data){
        return this.insert(data).run();
    }

    edit(id, data){
        return this.update(data).where(this._primaryKey, id).run();
    }

    destroy(id){
        return this.delete().where(this._primaryKey, id).run();
    }
}