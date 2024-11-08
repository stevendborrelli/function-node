import {
  Resource,
  RunFunctionRequest,
  RunFunctionResponse,
  Severity,
} from "./proto/gen/v1/run_function.js";
import { Duration } from "./proto/gen/google/protobuf/duration";
import { deepmerge, deepmergeInto } from "deepmerge-ts";

const DEFAULT_TTL: Duration = { seconds: 60, nanos: 0 };

// to copies the request's tag, desired resources, and context is automatically copied to
// the response. Using response.to is a good pattern to ensure
export function to(req: RunFunctionRequest): RunFunctionResponse {
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
export function fatal(
  rsp: RunFunctionResponse,
  message: string,
): RunFunctionResponse {
  if (rsp && rsp.results) {
    rsp.results.push({
      severity: Severity.SEVERITY_FATAL,
      message: message,
    });
  }
  return rsp;
}

// fatal adds a normal result to the response.
export function normal(rsp: RunFunctionResponse, message: string) {
  if (rsp && rsp.results) {
    rsp.results.push({
      severity: Severity.SEVERITY_NORMAL,
      message: message,
    });
  }
}

// fatal adds a warning result to the response.
export function warning(rsp: RunFunctionResponse, message: string) {
  if (rsp && rsp.results) {
    rsp.results.push({
      severity: Severity.SEVERITY_NORMAL,
      message: message,
    });
  }
}

// SetDesiredComposedResources sets the desired composed resources in the
// supplied response. We use deepmerge to overwrite any existing values.
export function setDesiredComposedResources(
  rsp: RunFunctionResponse,
  dcds: { [key: string]: Resource },
): RunFunctionResponse {
  if (rsp?.desired?.resources) {
    deepmergeInto(rsp.desired.resources, dcds);
    //console.log(JSON.stringify(rsp, null, 2));
  }
  return rsp
}

// update a Resource
// TODO: Can we make this Generic?
export function update(src: Resource, tgt: Resource): Resource {
  return deepmerge(tgt, src);
}

// setDesiredCompositeStatus updates the Composite status
export function setDesiredCompositeStatus(rsp: RunFunctionResponse, status: { [key: string]: any }): RunFunctionResponse{
  if (rsp.desired?.composite?.resource) {
    deepmergeInto(rsp.desired.composite.resource,   { "status": status})    
  }
  return rsp
}