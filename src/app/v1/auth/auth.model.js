const DB = require("../../db/DB1");

class Auth extends DB{
    constructor(){
        super("user");
    }
}

module.exports = new Auth();