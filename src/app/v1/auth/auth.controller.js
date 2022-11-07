const model     = require("./auth.model");
const Controller= require("../../base/Controller");
const jwt       = require("jsonwebtoken");
const bcrypt    = require("bcrypt");

class AuthController extends Controller{
    constructor(){
        super(model);
        this.register   = this.register.bind(this);
        this.login      = this.login.bind(this);
    }

    register(request, response){
        let data = {
            username: request.body.username,
            password: request.body.password,
            fullname: request.body.fullname,
            email   : request.body.email
        };

        let salt = bcrypt.genSaltSync(10);

        data.password = bcrypt.hashSync(data.password, salt);

        this.model
        .insert(data)
        .run()
        .then(() => this.responseSuccess(response, {data: true}))
        .catch(error => this.responseError(response, {data: error, writeLog: true}));
    }

    login(request, response){
        this.model
        .select("*")
        .where("username", request.body.username)
        .run()
        .then(results=>{
            let res = { message: "login fail", data: "username or password is incorrect" }; 

            if(!results.length) return this.responseError(response, res);

            let checkPassword = bcrypt.compareSync(request.body.password, results[0].password);// return true||false
            
            if(!checkPassword) return this.responseError(response, res);

            const payload = {
                user_id: results[0].id,
                username: results[0].username
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:  process.env.JWT_EXPIRESIN});

            res.message = "login success";
            res.data    = {
                token: token,
                user: results[0]
            };

            return this.responseSuccess(response, res);
        }).catch(error => this.responseError(response, {data: error, writeLog: true}));
    }
}

module.exports = new AuthController();