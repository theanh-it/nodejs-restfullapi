const DB = require("../../db/DB1");

class User extends DB{
    constructor(){
        super("user");
    }
}

module.exports = new User();