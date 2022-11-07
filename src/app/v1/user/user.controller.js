const Controller    = require("../../base/Controller");
const model         = require("./user.model");

class UserController extends Controller{
    model = model;

    index(request, response){
        this.model
        .transaction()
        .select("*")
        .run()
        .then(result => {
            this.model.commit();
            this.responseSuccess(response, {data: result});
        })
        .catch(error => {
            this.model.rollback();
            this.responseError(response, {data: error, writeLog: true});
        });
    }
}

module.exports = new UserController();