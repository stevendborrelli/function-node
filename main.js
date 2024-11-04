#!/usr/bin/env node
// import { Command } from "commander";
import { getCredentials, newGrpcServer } from "./server.js";
import { pino } from "pino";
const addr = "0.0.0.0:9443";
const logger = pino({
    level: "info",
});
function main() {
    const server = newGrpcServer(logger, opts);
    const credentials = getCredentials();
    server.listen(addr, credentials);
    logger.info("listening on:", addr);
    server.shutdown();
}
const opts = {
    insecure: true,
};
main();
