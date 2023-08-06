import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {Tag} from "../../../Data/schemas";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import DialogActions from "@mui/material/DialogActions";
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import SingleTextInputDialog from "./misc/SingleTextInputDialog";
import {useState} from "react";
import {TagsController} from "../../../Controller/Tags";
import ConfirmDialog from "./misc/ConfirmDialog";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";

interface tagEditProps {
    open: boolean;
    tags: Tag[];

    handleHideDialog(): any;

    handleRefreshPage(): any;
}

interface tagItemProps {
    tag: Tag;

    handleRefreshPage(): any;
}

const tagsCon = new TagsController();

function TagItem(props: tagItemProps) {
    const {t} = useTranslation();
    const [showEditTagDialog, setShowEditTagDialog] = useState(false);
    const [showDeleteTagDialog, setShowDeleteTagDialog] = useState(false);

    return (
        <>
            <ListItem
                secondaryAction={
                    <Tooltip title={t("dialogs.common.button.delete")} placement="right">
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                                setShowDeleteTagDialog(true);
                            }}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                }
                disablePadding
            >
                <Tooltip title={t("dialogs.common.button.edit")} placement="left">
                    <ListItemButton
                        onClick={() => {
                            setShowEditTagDialog(true);
                        }}
                    >
                        <Chip icon={<TagOutlinedIcon/>} label={props.tag.name}/>
                    </ListItemButton>
                </Tooltip>
            </ListItem>
            <SingleTextInputDialog
                title={t("dialogs.tagRelated.editTags.editTagName.title")}
                message={`${t("dialogs.tagRelated.editTags.editTagName.message")} [${props.tag.name}]`}
                open={showEditTagDialog}
                defaultValue={props.tag.name}
                handleClose={() => {
                    setShowEditTagDialog(false);
                }}
                setConfirmValue={(newName: string) => {
                    tagsCon.updateTag({id: props.tag.id, name: newName});
                    props.handleRefreshPage();
                }}
            />
            <ConfirmDialog
                title={`${t("dialogs.common.button.delete")} ${props.tag.name}?`}
                message={t("dialogs.tagRelated.deleteTag.message")}
                open={showDeleteTagDialog}
                handleClose={() => {
                    setShowDeleteTagDialog(false);
                }}
                confirmAction={async () => {
                    await tagsCon.deleteTag(props.tag.id);
                    props.handleRefreshPage();
                }}
            />
        </>
    );
}

export default function TagEditDialog(props: tagEditProps) {
    const {t} = useTranslation();
    return (
        <Dialog open={props.open} onClose={props.handleHideDialog}>
            <DialogTitle>{t("dialogs.tagRelated.editTags.title")}</DialogTitle>

            <List>
                {props.tags
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((tag) => (
                        <TagItem
                            tag={tag}
                            handleRefreshPage={props.handleRefreshPage}
                            key={tag.id}
                        />
                    ))}
            </List>
            {props.tags.length === 0 ? (
                <DialogContent>
                    <DialogContentText>
                        {t("dialogs.tagRelated.editTags.noTags")}
                    </DialogContentText>
                </DialogContent>
            ) : (
                ""
            )}

            <DialogActions>
                <Button autoFocus onClick={props.handleHideDialog}>
                    {t("dialogs.common.button.okay")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
