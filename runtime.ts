import { ChannelOptions, createServer, Server } from "nice-grpc";
import { FunctionRunnerServiceDefinition } from "./proto/gen/v1/run_function.js";
import { functionRunnerServiceImpl } from "./function.js";
import { Logger } from "pino";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ServerCredentials } from "@grpc/grpc-js";

// serverOptions are options for the gRPC server
export interface ServerOptions {
    // port is the address to listen on default is "0.0.0.0:9443"
    address: string;
    // insecure indicates if TLS is used or not, defaults to false
    insecure?: boolean;
    // debug turns on debug logging
    debug?: boolean;
    // tlsCertDir is the filesystem directory containing TLS Certificates
    // ignored if insecure is set to true
    tlsCertDir?: string;
}

// getCredentials creates gRPC ChannelCredentials from TLS files on the filesystem
export function getCredentials(
    opts?: ServerOptions,
): ServerCredentials {
    if (opts?.insecure || opts?.tlsCertDir === "" || opts?.tlsCertDir === undefined ) {
        return ServerCredentials.createInsecure();
    }
    try {
        const tlsCertDir = opts?.tlsCertDir;
        const privateKey = readFileSync(join(tlsCertDir, "tls.key"));
        const rootCerts = readFileSync(join(tlsCertDir, "tls.crt"));
        const certChain = readFileSync(join(tlsCertDir, "ca.crt"));
        return ServerCredentials.createSsl(
            rootCerts,
            [{ private_key: privateKey, cert_chain: certChain }],
            true,
        );
    } catch (err) {
        throw err;
    }
}

// newGrpcServer creates a new gRPC server and registers our function runner
export function newGrpcServer(logger?: Logger, opts?: ChannelOptions): Server {
    const server = createServer(opts);
    server.add(FunctionRunnerServiceDefinition, functionRunnerServiceImpl);
    return server;
}
