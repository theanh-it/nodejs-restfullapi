module.exports = class Mysql {
    _db = null;
    _transaction = false;

    query(sql, data = false) {
        if(this._transaction){
            this._db.connect();
            return new Promise((resolve, reject) => {
                if(data){
                    this._db.connection.query(sql, data)
                    .then(([rows, fields]) => {
                        this._db.end();
                        return resolve(rows);
                    })
                    .catch(error => reject(error));
                }else{
                    this._db.connection.query(sql)
                    .then(([rows, fields]) => {
                        this._db.end();
                        return resolve(rows);
                    })
                    .catch(error => reject(error));
                }
            });
        }else{
            this._db.connectPool();
            return new Promise((resolve, reject) => {
                if(data){
                    this._db.connectionPool.query(sql, data)
                    .then(([rows, fields]) => {
                        this._db.endPool();
                        return resolve(rows);
                    })
                    .catch(error => reject(error));
                }else{
                    this._db.connectionPool.query(sql)
                    .then(([rows, fields]) => {
                        this._db.endPool();
                        return resolve(rows);
                    })
                    .catch(error => reject(error));
                }
            });
        }
    }

    transaction() {
        this._transaction = true;
        this._db.connect();
        this._db.connection.beginTransaction();
        return this;
    }

    commit() {
        this._db.connection.commit();
        this._transaction = false;
    }
    
    rollback() {
        this._db.connection.rollback();
        this._transaction = false;
    }
}