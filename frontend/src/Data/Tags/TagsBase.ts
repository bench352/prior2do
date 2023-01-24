import { Tag } from "../schemas";

const localStore = require("store");

export abstract class TagsBase {
  abstract createTag(newTag: Tag): any;
  abstract getTags(): Promise<Tag[]>;
  abstract updateTag(tag: Tag): any;
  abstract deleteTag(tagId: string): any;
  abstract getTagById(tagId: string): Promise<Tag>;
  localGetTags(): Tag[] {
    return localStore.get("p2d.tags") || [];
  }
  updateTagsLocalStorage(tags: Tag[]) {
    localStore.set("p2d.tags", tags);
  }
  localUpdateTag(tagToUpdate: Tag) {
    let tags = this.localGetTags();
    const updatedTags = tags.map((tag: Tag) =>
      tag.id === tagToUpdate.id ? tagToUpdate : tag
    );
    this.updateTagsLocalStorage(updatedTags);
  }
  localDeleteTagById(id: string) {
    let tags = this.localGetTags();
    const updatedTags = tags.filter((tag: Tag) => tag.id !== id);
    this.updateTagsLocalStorage(updatedTags);
  }
}
