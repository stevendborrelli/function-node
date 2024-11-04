#!/bin/bash

# Generate ts/js files form our .protos
protoc --plugin=$(npm root)/.bin/protoc-gen-ts_proto \
 --ts_proto_out=proto/gen \
 --ts_proto_opt=outputServices=grpc-js \
 --ts_proto_opt=esModuleInterop=true \
 -I=proto/v1 proto/**/*.proto
