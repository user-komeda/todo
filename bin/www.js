/* eslint-disable no-process-exit */
/* eslint-disable new-cap */
/**
 * Module dependencies.
 */

import app from "../app.js";

import Debug from "debug";
const debug = Debug("tutorial:server");
import { createServer } from "http";

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 *
 * @param {*} val val
 * @return {*}
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

/**
 *
 * @param {*} error error
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

/**
 *
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
