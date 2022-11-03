const Mysql = require("./Mysql");

module.exports = class Select extends Mysql{
    _table      = "";
    _primaryKey = "";
    _select     = "";
    _join       = [];
    _leftJoin   = [];
    _rightJoin  = [];
    _groupBy    = [];
    _having     = [];
    _orderBy    = [];
    _limit      = { begin: 0, size: 0 };
    _where      = [];
    _whereRaw   = [];
    _whereIn    = [];
    _whereNotIn = [];
    _search = false;

    constructor(table, primaryKey){
        super();
        this._table    = table;
        this._primaryKey= primaryKey;
        this._select    = "";
    }

    table(table, primaryKey = "id") {
        this._table     = table;
        this._primaryKey= primaryKey;
        return this;
    }

    select(...columns) {
        this._select = columns.reduce((res, val) => {
            if (res && val)
                return res + ', ' + val;
            else if (val)
                return val;
            return res;
        }, "");
        this._action = "select";
        return this;
    }

    join(params) {
        this._join.push(params);
        return this;
    }

    leftJoin(params) {
        this._leftJoin.push(params);
        return this;
    }

    searchFullText(params) {
        this._search = params;
        return this;
    }

    where(...params) {
        if (params.length > 2) {
            this._where.push({ column: params[0], compare: params[1], value: params[2], where: true });
        }
        else if (params.length == 2) {
            this._where.push({ column: params[0], compare: "=", value: params[1], where: true });
        }
        return this;
    }

    orWhere(...params) {
        if (params.length > 2) {
            this._where.push({ column: params[0], compare: params[1], value: params[2], where: false });
        }
        else if (params.length == 2) {
            this._where.push({ column: params[0], compare: "=", value: params[1], where: false });
        }
        return this;
    }

    whereRaw(where, params = []) {
        this._whereRaw.push({
            where: where,
            params: params,
            isAnd: true
        });
        return this;
    }

    orWhereRaw(where, params = []) {
        this._whereRaw.push({
            where: where,
            params: params,
            isAnd: false
        });
        return this;
    }

    whereIn(column, params = []) {
        this._whereIn.push({
            column: column,
            params: params,
            isAnd: true
        });
        return this;
    }

    orWhereIn(column, params = []) {
        this._whereIn.push({
            column: column,
            params: params,
            isAnd: false
        });
        return this;
    }


    whereNotIn(column, params = []) {
        this._whereNotIn.push({
            column: column,
            params: params,
            isAnd: true
        });
        return this;
    }

    orWhereNotIn(column, params = []) {
        this._whereNotIn.push({
            column: column,
            params: params,
            isAnd: false
        });
        return this;
    }

    orderBy(params) {
        params = Object.values(arguments);
        for (var val of params)
            this._orderBy.push(val);
        return this;
    }
    
    groupBy(params) {
        params = Object.values(arguments);
        for (var val of params)
            this._groupBy.push(val);
        return this;
    }

    having(params) {
        this._having.push({ ...params });
        return this;
    }

    limit(params) {
        this._limit = params;
        return this;
    }

    first() {
        this._limit.begin = 1;
        this._limit.size = 0;
        return this;
    }

    paginate(params) {
        this._limit = {
            begin: params.size * (params.page - 1),
            size: params.size
        };
    }

    toSqlSelect() {
        var select = `SELECT ${this._select ? this._select : '*'} FROM ${this._table}`;
        var join = this._join.reduce((res, obj) => {
            if (res && obj)
                res += ` INNER JOIN ${obj.table} ON ${obj.on}`;
            else if (obj)
                res = `INNER JOIN ${obj.table} ON ${obj.on}`;
            return res;
        }, "");
        var leftJoin = this._leftJoin.reduce((res, obj) => {
            if (res && obj)
                res += ` LEFT JOIN ${obj.table} ON ${obj.on}`;
            else if (obj)
                res = `LEFT JOIN ${obj.table} ON ${obj.on}`;
            return res;
        }, "");
        var rightJoin = this._rightJoin.reduce((res, obj) => {
            if (res && obj)
                res += ` RIGHT JOIN ${obj.table} ON ${obj.on}`;
            else if (obj)
                res = `RIGHT JOIN ${obj.table} ON ${obj.on}`;
            return res;
        }, "");
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
        var orderBy = this._orderBy.reduce((res, val) => {
            if (res && val)
                res += `,${val}`;
            else if (val)
                res = `ORDER BY ${val}`;
            return res;
        }, "");
        var groupBy = this._groupBy.reduce((res, val) => {
            if (res && val)
                res += `,${val}`;
            else if (val)
                res = `GROUP BY ${val}`;
            return res;
        }, "");
        var having = this._having.reduce((res, obj) => {
            if (res && obj) {
                if (obj.and)
                    res += " AND ";
                else
                    res += " OR ";
                res += `${obj.column}${obj.compare ? obj.compare : '='} ?`;
                params.push(obj.value);
            }
            else if (obj) {
                res = `HAVING ${obj.column}${obj.compare ? obj.compare : '='} ?`;
                params.push(obj.value);
            }
            return res;
        }, "");
        var limit = "";
        if (this._limit.begin && this._limit.size) {
            limit = `LIMIT ?,?`;
            params.push(this._limit.begin);
            params.push(this._limit.size);
        }
        else if (this._limit.begin) {
            limit = `LIMIT ?`;
            params.push(this._limit.begin);
        }
        var sql = [select, join, leftJoin, rightJoin, where, groupBy, having, orderBy, limit].reduce((result, value) => {
            if (result && value)
                result += " " + value;
            else if (value)
                result = value;
            return result;
        }, "");
        return {
            sql: sql,
            params: params
        };
    }
}