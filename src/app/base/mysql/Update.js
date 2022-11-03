const Insert = require("./Insert");

module.exports = class Update extends Insert{
    constructor(table, primaryKey) {
        super(table, primaryKey);
        this._update = "";
    }

    update(params) {
        this._action = "update";
        this._update = params;
        return this;
    }
    
    toSqlUpdate() {
        var params = this._update;
        var paramsQuery = [];
        var sql = `UPDATE ${this._table} SET ?`;
        paramsQuery.push(params);
        var where = "";
        if (this._search) {
            where = `WHERE MATCH(${this._search.column}) AGAINST(? IN BOOLEAN MODE)`;
            paramsQuery.push(this._search.value ? this._search.value + "*" : "");
        }
        if (this._whereRaw.length) {
            where = this._whereRaw.reduce((res, obj) => {
                if (res && obj) {
                    if (obj.isAnd)
                        res += " AND ";
                    else
                        res += " OR ";
                    res += obj.where;
                    paramsQuery = paramsQuery.concat(obj.params);
                }
                else if (obj) {
                    res = `WHERE ` + obj.where;
                    paramsQuery = obj.params;
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
                    paramsQuery = paramsQuery.concat(obj.params);
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
                    paramsQuery = obj.params;
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
                    paramsQuery = paramsQuery.concat(obj.params);
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
                    paramsQuery = obj.params;
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
                paramsQuery.push(obj.value);
            }
            else if (obj) {
                res = `WHERE ${obj.column}${obj.compare ? obj.compare : '='}?`;
                paramsQuery.push(obj.value);
            }
            return res;
        }, where);
        sql += " " + where;
        return {
            sql: sql,
            params: paramsQuery
        };
    }
}