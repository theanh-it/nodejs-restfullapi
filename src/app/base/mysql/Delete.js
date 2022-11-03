const Update = require("./Update");

module.exports = class Delete extends Update{
    constructor(table, primaryKey){
        super(table, primaryKey);
    }
    delete() {
        this._action = "delete";
        return this;
    }
    toSqlDelete() {
        var params = [];
        var where = "";
        if (this._search) {
            where = `WHERE MATCH(${this._search.column}) AGAINST(? IN BOOLEAN MODE)`;
            params.push(this._search.value ? this._search.value + "*" : "");
        }
        if (this._whereRaw.length) {
            where = this._whereRaw.reduce((res, obj) => {
                if (res && obj) {
                    if (obj.isAnd)
                        res += " AND ";
                    else
                        res += " OR ";
                    res += obj.where;
                    params = params.concat(obj.params);
                }
                else if (obj) {
                    res = `WHERE ` + obj.where;
                    params = obj.params;
                }
                return res;
            }, where);
        }
        if (this._whereIn.length) {
            where = this._whereIn.reduce((res, obj) => {
                if (res && obj) {
                    if (obj.isAnd)
                        res += " AND ";
                    else
                        res += " OR ";
                    var _in = obj.params.reduce((r, v) => {
                        if (r && v)
                            r += `,?`;
                        else if (v)
                            r = `?`;
                        return r;
                    }, "");
                    res += `${obj.column} IN (${_in})`;
                    params = params.concat(obj.params);
                }
                else if (obj && obj.params.length) {
                    var _in = obj.params.reduce((r, v) => {
                        if (r && v)
                            r += `,?`;
                        else if (v)
                            r = `?`;
                        return r;
                    }, "");
                    res = `WHERE ${obj.column} IN (${_in})`;
                    params = obj.params;
                }
                return res;
            }, where);
        }
        if (this._whereNotIn.length) {
            where = this._whereNotIn.reduce((res, obj) => {
                if (res && obj) {
                    if (obj.isAnd)
                        res += " AND ";
                    else
                        res += " OR ";
                    var _in = obj.params.reduce((r, v) => {
                        if (r && v)
                            r += `,?`;
                        else if (v)
                            r = `?`;
                        return r;
                    }, "");
                    res += `${obj.column} NOT IN (${_in})`;
                    params = params.concat(obj.params);
                }
                else if (obj && obj.params.length) {
                    var _in = obj.params.reduce((r, v) => {
                        if (r && v)
                            r += `,?`;
                        else if (v)
                            r = `?`;
                        return r;
                    }, "");
                    res = `WHERE ${obj.column} NOT IN (${_in})`;
                    params = obj.params;
                }
                return res;
            }, where);
        }
        where = this._where.reduce((res, obj) => {
            if (res && obj) {
                if (obj.where)
                    res += " AND ";
                else
                    res += " OR ";
                res += `${obj.column}${obj.compare ? obj.compare : '='}?`;
                params.push(obj.value);
            }
            else if (obj) {
                res = `WHERE ${obj.column}${obj.compare ? obj.compare : '='}?`;
                params.push(obj.value);
            }
            return res;
        }, where);
        var sql = `DELETE FROM ${this._table} ${where}`;
        return {
            sql: sql,
            params: params
        };
    }
}