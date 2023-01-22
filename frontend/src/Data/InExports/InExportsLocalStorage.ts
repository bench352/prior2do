import { TasksController } from "../../Controller/Tasks";
import { localSetLastUpdatedTimestamp } from "../Timestamps";
import { InExportsBase } from "./InExportsBase";

const FileSaver = require("file-saver");
const localStore = require("store");

export class InExportsLocalStorage extends InExportsBase {
  async exportDataToJson() {
    let taskCon = new TasksController(); // TODO implement updated export function
    let exportJson = {
      tasks: await taskCon.getTasks(),
    };
    var blob = new Blob([JSON.stringify(exportJson)], {
      type: "application/json;charset=utf-8",
    });
    FileSaver.saveAs(blob, "export.json");
  }

  async importDataFromJson(jsonFile: string) {
    let jsonObject = JSON.parse(jsonFile); // TODO implement updated import function
    if (jsonObject["tasks"] !== null) {
      localStore.set("p2d.tasks", jsonObject["tasks"]);
    }
    localSetLastUpdatedTimestamp();
  }
}
