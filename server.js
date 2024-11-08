//import {Server, ServerCredentials, ServerOptions} from '@grpc/grpc-js'
import { createServer } from "nice-grpc";
import { FunctionRunnerServiceDefinition } from "./proto/gen/v1/run_function.js";
import { functionRunnerServiceImpl } from "./function.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ServerCredentials } from "@grpc/grpc-js";
// getCredentials creates gRPC ChannelCredentials from TLS files on the filesystem
export function getCredentials(opts) {
    if (opts?.insecure || opts?.tlsCertDir === undefined) {
        console.log("creating insecure credentials. Insecure:", opts?.insecure);
        return ServerCredentials.createInsecure();
    }
    try {
        console.log("Reading tls certs");
        //const tlsCertDir = opts?.tlsCertDir;
        const tlsCertDir = "foo";
        const privateKey = readFileSync(join(tlsCertDir, "tls.key"));
        const rootCerts = readFileSync(join(tlsCertDir, "tls.crt"));
        const certChain = readFileSync(join(tlsCertDir, "ca.crt"));
        return ServerCredentials.createSsl(rootCerts, [{ private_key: privateKey, cert_chain: certChain }], true);
    }
    catch (err) {
        throw err;
    }
}
// newGrpcServer creates a new gRPC server and registers our function runner
export function newGrpcServer(logger, opts) {
    const server = createServer(opts);
    server.add(FunctionRunnerServiceDefinition, functionRunnerServiceImpl);
    return server;
}
