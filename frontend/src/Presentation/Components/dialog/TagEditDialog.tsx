import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Tag } from "../../../Data/schemas";
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
import SingleTextInputDialog from "./SingleTextInputDialog";
import { useState } from "react";
import { TagsController } from "../../../Controller/Tags";
import ConfirmDialog from "./ConfirmDialog";
import Tooltip from "@mui/material/Tooltip";

interface tagEditProps {
  open: boolean;
  tags: Tag[];
  handleHideDialog(): any;
  handleRefreshPage(): any;
}

interface tagItemProps {
  handleRefreshPage(): any;
  tag: Tag;
}

const tagsCon = new TagsController();

function TagItem(props: tagItemProps) {
  const [showEditTagDialog, setShowEditTagDialog] = useState(false);
  const [showDeleteTagDialog, setShowDeleteTagDialog] = useState(false);
  return (
    <>
      <ListItem
        secondaryAction={
          <Tooltip title="Delete" placement="right">
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => {
                setShowDeleteTagDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        }
        disablePadding
      >
        <Tooltip title="Edit" placement="left">
          <ListItemButton
            onClick={() => {
              setShowEditTagDialog(true);
            }}
          >
            <Chip icon={<TagOutlinedIcon />} label={props.tag.name} />
          </ListItemButton>
        </Tooltip>
      </ListItem>
      <SingleTextInputDialog
        title="Edit Tag Name"
        message={`Enter a new name for [${props.tag.name}]`}
        open={showEditTagDialog}
        defaultValue={props.tag.name}
        handleClose={() => {
          setShowEditTagDialog(false);
        }}
        setConfirmValue={(newName: string) => {
          tagsCon.updateTag({ id: props.tag.id, name: newName });
          props.handleRefreshPage();
        }}
      />
      <ConfirmDialog
        title={`Delete ${props.tag.name}?`}
        message="Deleting this tag will remove its association with existing tasks. All associated tasks will still remain in the app."
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
  return (
    <Dialog open={props.open} onClose={props.handleHideDialog}>
      <DialogTitle>Edit Tags</DialogTitle>

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
            No tags have been created yet. Try creating a new tag to organize
            your tasks!
          </DialogContentText>
        </DialogContent>
      ) : (
        ""
      )}

      <DialogActions>
        <Button autoFocus onClick={props.handleHideDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
