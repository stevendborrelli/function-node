#!/usr/bin/env node
import { Command } from "commander";
import { getCredentials, newGrpcServer } from "./runtime.js";
import { pino } from "pino";
const defaultAddress = "0.0.0.0:9443";
const logger = pino({
    level: "info",
});
const program = new Command("function-nodejs")
    .option("--address", "Address at which to listen for gRPC connections", defaultAddress)
    .option("-d, --debug", "Emit debug logs.", false)
    .option("--insecure", "Run without mTLS credentials.", false)
    .option("--tls-certs-dir [Directory]", "Serve using mTLS certificates.");
program.parse(process.argv);
function parseArgs(args) {
    return {
        address: args?.address || defaultAddress,
        debug: args.debug,
        insecure: args.insecure,
        tlsCertDir: args.tlsCertsDir,
    };
}
function main() {
    const args = program.opts();
    const opts = parseArgs(args);
    const logger = pino({
        level: opts?.debug ? "debug" : "info",
        formatters: {
            level: (label) => {
                return { severity: label.toUpperCase() };
            },
        },
    });
    try {
        const server = newGrpcServer(logger, opts);
        const credentials = getCredentials(opts);
        server.listen(opts.address, credentials);
        logger.debug({ "options": opts }, "function started");
        logger.info({ "listening on address": opts.address });
        server.shutdown();
    }
    catch (err) {
        logger.error(err);
        process.exit(-1);
    }
}
main();
