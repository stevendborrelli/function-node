#!/usr/bin/env node

// import { Command } from "commander";
import { getCredentials, newGrpcServer } from "./server.js";
import { pino } from "pino";

// serverOptions are options for the gRPC server
// TODO: implement CLI arg parsing
export interface ServerOptions {
    // port is the address to listen on default is "0.0.0.0:9443"
    address?: string;
    // insecure indicates if TLS is used or not, defaults to false
    insecure?: boolean;
    // debug turns on debug logging
    debug?: boolean;
    // tlsCertDir is the filesystem directory containing TLS Certificates
    // ignored if insecure is set to true
    tlsCertDir?: string;
}

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
const opts: ServerOptions = {
    insecure: true,
};

main();
