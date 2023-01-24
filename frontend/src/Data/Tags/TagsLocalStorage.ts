import { Tag } from "../schemas";
import { TagsBase } from "./TagsBase";
import TasksLocalStorage from "../Tasks/TasksLocalStorage";

export class TagsLocalStorage extends TagsBase {
  async getTagById(tagId: string): Promise<Tag> {
    let tags = this.localGetTags();
    for (const tag of tags) {
      if (tag.id === tagId) {
        return tag;
      }
    }
    throw new Error(`Tag with id [${tagId}] not found!`);
  }
  async createTag(newTag: Tag) {
    let tags = this.localGetTags();
    tags.push(newTag);
    this.updateTagsLocalStorage(tags);
  }
  async getTags(): Promise<Tag[]> {
    return this.localGetTags();
  }
  async updateTag(tag: Tag) {
    this.localUpdateTag(tag);
  }
  async deleteTag(tagId: string) {
    let tasksCon = new TasksLocalStorage();
    tasksCon.removeTagAssociation(tagId);
    this.localDeleteTagById(tagId);
  }
}
