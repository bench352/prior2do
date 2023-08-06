const localStore = require("store");

export function getLocalLastUpdatedTimestamp(): number {
    let result = localStore.get("p2d.lastUpdated");
    return parseInt(result ? result : "0");
}

export function localSetLastUpdatedTimestamp() {
    localStore.set("p2d.lastUpdated", Math.round(Date.now() / 1000));
}
