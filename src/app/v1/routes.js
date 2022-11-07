const route = require("express").Router();

route.get("/v1", (request, response) => {
    return response.json({
        message: "welcome api v1"
    })
});

route.use("/auth", require("./auth/auth.route"));
route.use("/user", require("./user/user.route"));

module.exports = route;