const route = require("express").Router();

route.get("/", (request, response) => {
    return response.json({
        message: "welcome api"
    })
});

route.get("/v1", (request, response) => {
    return response.json({
        message: "welcome api v1"
    })
});

route.use("/v1", require("./v1/routes"));

module.exports = route;