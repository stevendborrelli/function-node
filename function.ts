// import { CallContext } from "nice-grpc";

import {
    DeepPartial,
    FunctionRunnerServiceImplementation,
    Resource,
    RunFunctionRequest,
    RunFunctionResponse,
} from "./proto/gen/v1/run_function.js";

import {
    fatal,
    normal,
    setDesiredComposedResources,
    setDesiredCompositeStatus,
    to,
    update,
} from "./response.js";

import {
    getDesiredComposedResources,
    getDesiredCompositeResource,
    getObservedCompositeResource,
} from "./request.js";

export const functionRunnerServiceImpl: FunctionRunnerServiceImplementation = {
    async runFunction(
        req: RunFunctionRequest,
        // context: CallContext,
    ): Promise<DeepPartial<RunFunctionResponse>> {
        // set up a minimal response from the request
        let rsp = to(req);
        //console.log(req)

        // Get our Observed Composite
        const oxr = getObservedCompositeResource(req);
        console.log("the observed composite is:", JSON.stringify(oxr));

        // Get our Desired Composite
        const dxr = getDesiredCompositeResource(req);
        console.log("the desired composite is:", JSON.stringify(dxr));

        // List the Desired Composed resources
        const dcds = getDesiredComposedResources(req);

        for (const key in dcds) {
            if (Object.hasOwn(dcds,key)) { // Check if the key is a direct property
                const resource = dcds[key];
                const label: Resource = {
                    "resource": {
                        "metadata": {
                            "labels": {
                                "added-by": "function-typescript",
                            },
                            "annotations": {
                                "key": "also-from-the-typescript-function",
                            },
                        },
                    },
                };
                resource.resource = update(resource, label);
            }
        }
        if (dcds) {
            try {
                rsp = setDesiredComposedResources(rsp, dcds);
            } catch(error) {
                fatal(rsp, JSON.stringify(error));
                return rsp;
            }
        }
        // try setting the composite status 
        rsp = setDesiredCompositeStatus(rsp, { "hello": "status"})
        normal(rsp, "Function Ran successfully");
        return rsp;
    },
};

