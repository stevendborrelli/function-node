# function-sdk-node

This is an experimental Crossplane function written in Typescript.

## Running the server

First compile the server:

```shell
tsc
```

Next run the function locally:

```shell
node main.js
```

Then run the example manifest:

```shell
cd examples/extra_resources
./render.sh
```

## Files

- [main.ts](main.ts): sets up the environment and runs the server
- [server.ts](server.ts): sets up the gRPC server and TLS credentials
- [function.ts](function.ts): implements the function logic
- [resource.ts](resource.ts): fetches resources
- [response.ts](response.ts): sets response fields

## Components

- [grpc-js](https://github.com/grpc/grpc-node)
- [nice-grpc](https://github.com/deeplay-io/nice-grpc)

## Debugging

To check if the endpoint is running:

```shell
grpcurl -proto proto/v1/run_function.proto  -vv -plaintext  localhost:9443  "apiextensions.fn.proto.v1.FunctionRunnerService/RunFunction" 
```
