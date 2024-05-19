require("dotenv").config({path: './config.env'});
const http = require("http");
require("./config/db.config").connectToMongoDB();

// const mongoose = require('mongoose')
const {app} = require("./app");


const server = http.createServer(app);
const PORT = process.env.PORT || 4000
const stage =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_ATLAS_URI;

server.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = {stage,
  PORT,
};