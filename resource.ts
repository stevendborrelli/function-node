import { Resource, RunFunctionRequest } from "./proto/gen/v1/run_function.js";

// export function getCondition(res: Resource, type: string): Condition {
//     // default condition
//     const c = {
//         type: type,
//         status: Status.STATUS_CONDITION_UNKNOWN,
//     };
//     if (res?.resource?.conditions) {
//         const cnd = res.resource.conditions[type].status
//     }
//     return c;
// }

export function getDesiredCompositeResource(req: RunFunctionRequest):Resource|undefined {
    return req.desired?.composite
}

export function getObservedCompositeResource(req: RunFunctionRequest):Resource|undefined {
    return req.observed?.composite
}
export function getDesiredComposedResources(req: RunFunctionRequest):{ [key: string]: Resource } {
   if (req.desired?.resources) {
    return req.desired?.resources
   }
   return {}
}
