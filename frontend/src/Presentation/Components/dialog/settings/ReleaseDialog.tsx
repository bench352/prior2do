import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ReactMarkdown from "react-markdown";
import { releaseContent } from "../../../../Const";

import DialogTitle from "@mui/material/DialogTitle";

interface ReleaseDialogProps {
  open: boolean;
  handleHideDialog(): any;
}

export default function ReleaseDialog(props: ReleaseDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.handleHideDialog} scroll="paper">
      <DialogTitle>Prior2Do has been updated!</DialogTitle>
      <DialogContent dividers={true}>
        <ReactMarkdown children={releaseContent} />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleHideDialog}>Got it</Button>
      </DialogActions>
    </Dialog>
  );
}
