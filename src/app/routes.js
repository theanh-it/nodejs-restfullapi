const route = require("express").Router();

route.get("/", (request, response) => {
    return response.json({
        message: "welcome api"
    })
});

route.use("/v1", require("./v1/routes"));

module.exports = route;