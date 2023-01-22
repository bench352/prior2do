import { InExportsBase } from "../Data/InExports/InExportsBase";
import { InExportsLocalStorage } from "../Data/InExports/InExportsLocalStorage"



function getInExportsBackend():InExportsBase {
    return new InExportsLocalStorage();
}

export class InExportsController {
    async exportDataToJson() {
        await getInExportsBackend().exportDataToJson();
    }
    async importDataFromJson(jsonFile:string) {
        await getInExportsBackend().importDataFromJson(jsonFile);
    }
}