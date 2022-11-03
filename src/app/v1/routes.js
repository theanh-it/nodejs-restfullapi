const route = require("express").Router();

//route.use("/auth", require("./auth/auth.route"));
route.use("/user", require("./user/user.route"));

module.exports = route;