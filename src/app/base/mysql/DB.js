let mysql = require("mysql2");

module.exports = class DB{
    host    = null;
    user    = null;
    password= null;
    database= null;

    connection      = false;
    disconnect      = false;
    connectionPool  = false;
    disconnectPool  = false;

    constructor({host = "localhost", user = "root", password = "", database = ""}){
        this.host       = host;
        this.user       = user;
        this.password   = password;
        this.database   = database;
    }

    connect(){
        clearTimeout(this.disconnect);
        this.disconnect = false;

        if(!this.connection){
            let connection = mysql.createConnection({
                host    : this.host,
                user    : this.user,
                password: this.password,
                database: this.database
            });

            this.connection = connection.promise();

            console.log("mysql connect db:" + this.database);
        }
    }

    end(){
        if(!this.disconnect) this.disconnect = setTimeout(() => {
            this.connection.end();
            this.connection = false;
            this.disconnect = false;
            
            console.log("mysql disconnect db:" + this.database);
        }, 5000);
    }

    connectPool(){
        clearTimeout(this.disconnectPool);
        this.disconnectPool = false;

        if(!this.connectionPool){
            let pool = mysql.createPool({
                host    : this.host,
                user    : this.user,
                password: this.password,
                database: this.database
            });

            this.connectionPool = pool.promise();

            console.log("mysql connect POOL db:" + this.database);
        }
    }

    endPool(){
        if(!this.disconnectPool) this.disconnectPool = setTimeout(() => {
            this.connectionPool.end();
            this.connectionPool = false;
            this.disconnectPool = false;
            
            console.log("mysql disconnect POOL db:" + this.database);
        }, 5000);
    }
}