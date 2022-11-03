const mongoose = require("mongoose");

let url = `${process.env.MONGODB_TYPE}://${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`;

if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
  url = `${process.env.MONGODB_TYPE}://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`;
}

mongoose
.connect(url)
.then(() => console.log("connect to mongoose success!"))
.catch(error => console.log("connect to mongoose failed", error));
