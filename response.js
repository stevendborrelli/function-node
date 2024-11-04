import { Severity, } from "./proto/gen/v1/run_function.js";
import { deepmerge, deepmergeInto } from "deepmerge-ts";
const DEFAULT_TTL = { seconds: 60, nanos: 0 };
// to copies the request's tag, desired resources, and context is automatically copied to
// the response. Using response.to is a good pattern to ensure
export function to(req) {
    return {
        conditions: [],
        context: req.context,
        desired: req.desired,
        meta: { tag: req.meta?.tag || "", ttl: DEFAULT_TTL },
        requirements: undefined,
        results: [],
    };
}
// fatal adds a fatal result to the response.
export function fatal(rsp, message) {
    if (rsp && rsp.results) {
        rsp.results.push({
            severity: Severity.SEVERITY_FATAL,
            message: message,
        });
    }
    return rsp;
}
// fatal adds a normal result to the response.
export function normal(rsp, message) {
    if (rsp && rsp.results) {
        rsp.results.push({
            severity: Severity.SEVERITY_NORMAL,
            message: message,
        });
    }
}
// fatal adds a warning result to the response.
export function warning(rsp, message) {
    if (rsp && rsp.results) {
        rsp.results.push({
            severity: Severity.SEVERITY_NORMAL,
            message: message,
        });
    }
}
// SetDesiredComposedResources sets the desired composed resources in the
// supplied response. We use deepmerge to overwrite any existing values.
export function setDesiredComposedResources(rsp, dcds) {
    if (rsp?.desired?.resources) {
        deepmergeInto(rsp.desired.resources, dcds);
        console.log(JSON.stringify(rsp, null, 2));
    }
    return rsp;
}
// update a Resource
// TODO: Can we make this Generic?
export function update(src, tgt) {
    return deepmerge(tgt, src);
}
// setDesiredCompositeStatus updates the Composite status
export function setDesiredCompositeStatus(rsp, status) {
    if (rsp.desired?.composite?.resource) {
        deepmergeInto(rsp.desired.composite.resource, { "status": status });
    }
    return rsp;
}
