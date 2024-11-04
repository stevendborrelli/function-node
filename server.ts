//import {Server, ServerCredentials, ServerOptions} from '@grpc/grpc-js'
import { ChannelOptions, createServer, Server } from "nice-grpc";
import { FunctionRunnerServiceDefinition } from "./proto/gen/v1/run_function.js";
import { functionRunnerServiceImpl } from "./function.js";
import { Logger } from "pino";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ServerCredentials } from "@grpc/grpc-js";

// getCredentials creates gRPC ChannelCredentials from TLS files on the filesystem
export function getCredentials(
    tlsCertDir?: string,
): ServerCredentials {
    if (!tlsCertDir) return ServerCredentials.createInsecure();
    const privateKey = readFileSync(join(tlsCertDir, "tls.key"));
    const rootCerts = readFileSync(join(tlsCertDir, "tls.crt"));
    const certChain = readFileSync(join(tlsCertDir, "ca.crt"));
    return ServerCredentials.createSsl(
        rootCerts,
        [{ private_key: privateKey, cert_chain: certChain }],
        true,
    );
}

// newGrpcServer creates a new gRPC server and registers our function runner
export function newGrpcServer(logger?: Logger, opts?: ChannelOptions): Server {
    const server = createServer(opts);
    server.add(FunctionRunnerServiceDefinition, functionRunnerServiceImpl);
    logger?.debug("server created");
    return server;
}
