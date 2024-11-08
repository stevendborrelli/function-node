# function-sdk-node

This is an experimental Crossplane function written in Typescript.

## Running the server

First compile the server:

```shell
tsc
```

Next run the function locally:

```shell
node main.js -d --insecure
```

In another terminal run the example manifest:

```shell
cd examples/extra_resources
./render.sh
```

## Files

- [main.ts](main.ts): sets up the environment and runs the server
- [runtime.ts](runtime.ts): sets up the gRPC server and TLS credentials
- [function.ts](function.ts): implements the function logic
- [request.ts](request.ts): fetch data from the request
- [response.ts](response.ts): sets response fields

## Components

- [grpc-js](https://github.com/grpc/grpc-node)
- [nice-grpc](https://github.com/deeplay-io/nice-grpc)

## Debugging

To check if the endpoint is running:

```shell
grpcurl -proto proto/v1/run_function.proto  -vv -plaintext  localhost:9443  "apiextensions.fn.proto.v1.FunctionRunnerService/RunFunction" 
```
