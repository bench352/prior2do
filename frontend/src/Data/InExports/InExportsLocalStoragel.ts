import { TasksController } from "../../Controller/Tasks";
import { InExportsBase } from "./InExportsBase";

const FileSaver = require("file-saver");

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
    // TODO Implement import data
    this.localSetLastUpdatedTimestamp(); // TODO move to settings
  }
}
