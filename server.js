"use strict";

const app = require("./app");
const http = require("http");
const { PORT } = require("./config");

const server = http.createServer(app);

server.listen(PORT, "localhost", function () {
  console.log(
    "Express server started on port %s at %s",
    server.address().port,
    server.address().address
  );
});
