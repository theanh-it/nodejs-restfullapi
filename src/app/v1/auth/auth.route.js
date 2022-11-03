const route         = require("express").Router();
const controller    = require("./auth.controller");

route.post("/register", controller.register);
route.post("/login", controller.login);
//route.post("/logout", controller.logout);

module.exports = route;