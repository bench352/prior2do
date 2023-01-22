import { Tag } from "../Data/schemas";
import { TagsBase } from "../Data/Tags/TagsBase";
import { TagsLocalStorage } from "../Data/Tags/TagsLocalStorage";

function getTagsBackend(): TagsBase {
  return new TagsLocalStorage();
}

export class TagsController {
  async getTags(): Promise<Tag[]> {
    return await getTagsBackend().getTags();
  }

}
