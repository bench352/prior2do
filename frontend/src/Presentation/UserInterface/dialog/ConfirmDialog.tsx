import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface confirmDialogProps {
  open: boolean;
  confirmAction(): any;
  title: string;
  message: string;
  handleClose(): any;
}

export default function ConfirmDialog(props: confirmDialogProps) {
  const performConfirmAction = () => {
    props.confirmAction();
    props.handleClose();
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} autoFocus>
          No
        </Button>
        <Button onClick={performConfirmAction}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
