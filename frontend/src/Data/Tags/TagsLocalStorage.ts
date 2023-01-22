import { Tag } from "../schemas";
import { TagsBase } from "./TagsBase";

export class TagsLocalStorage extends TagsBase {
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
    this.localDeleteTagById(tagId);
  }
}
