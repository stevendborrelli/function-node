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
export function getDesiredCompositeResource(req) {
    return req.desired?.composite;
}
export function getObservedCompositeResource(req) {
    return req.observed?.composite;
}
export function getDesiredComposedResources(req) {
    if (req.desired?.resources) {
        return req.desired?.resources;
    }
    return {};
}
