import {Tag} from "../Data/schemas";
import {TagsBase} from "../Data/Tags/TagsBase";
import {TagsLocalStorage} from "../Data/Tags/TagsLocalStorage";

function getTagsBackend(): TagsBase {
    return new TagsLocalStorage();
}

export class TagsController {
    async createTag(newTag: Tag) {
        await getTagsBackend().createTag(newTag);
    }

    async getTags(): Promise<Tag[]> {
        return await getTagsBackend().getTags();
    }

    async getTagById(id: string): Promise<Tag> {
        return await getTagsBackend().getTagById(id);
    }

    async updateTag(tag: Tag) {
        await getTagsBackend().updateTag(tag);
    }

    async deleteTag(id: string) {
        await getTagsBackend().deleteTag(id);
    }

    offlineGetTags() {
        getTagsBackend().localGetTags();
    }
}
