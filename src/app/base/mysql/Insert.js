const Select = require("./Select");

module.exports = class Insert extends Select{
    constructor(table, primaryKey){
        super(table, primaryKey);
        this._insert = "";
    }

    insert(params) {
        this._action = "insert";
        this._insert = params;
        return this;
    }
    
    toSqlInsert() {
        var params = this._insert;
        var sql = ``;
        var paramsQuery = [];
        if (Array.isArray(params) && params.length) {
            var set = ``;
            for (var key in params[0]) {
                if (set) {
                    set += `,${key}`;
                }
                else {
                    set = `${this._table}(${key}`;
                }
            }
            set += `)`;
            var values = [];
            for (var param of params) {
                var value = ``;
                for (var key in param) {
                    if (value) {
                        value += `,?`;
                        paramsQuery.push(param[key]);
                    }
                    else {
                        value = `(?`;
                        paramsQuery.push(param[key]);
                    }
                }
                value += `)`;
                values.push(value);
            }
            values = values.reduce((res, val) => {
                if (res && val)
                    res += "," + val;
                else if (val)
                    res = val;
                return res;
            }, "");
            sql = `INSERT INTO ${set} VALUES ${values}`;
        }
        else if (typeof params == "object") {
            sql = `INSERT INTO ${this._table} SET ?`;
            paramsQuery.push(params);
        }
        return {
            sql: sql,
            params: paramsQuery
        };
    }
}