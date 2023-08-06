const {v4: uuidv4} = require("uuid");

export function getNewUniqueId(): string {
    return uuidv4();
}
