let mysql       = require("mysql2");
let connection  = false;
let disconnect  = false;

module.exports = {
    connect(){
        clearTimeout(disconnect);
        disconnect = false;

        if(!connection){
            let pool = mysql.createPool({
                host    : process.env.MYSQL_HOST,
                user    : process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE
            });

            connection = pool.promise();

            //console.log("mysql connect db moso_organizations");
        }

        return Promise.resolve(connection);
    },
    end(){
        if(!disconnect) disconnect = setTimeout(() => {
            connection.end();
            connection = false;
            
            //console.log("mysql disconnect db moso_organizations");
        }, 5000);
    }
}