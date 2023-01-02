import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { getStorageBackend } from "../../storage/StorageBackend";

interface confirmDialogProps {
  open: boolean;
  confirmAction: any;
  title: string;
  message: string;
  handleClose: any;
}

export default function ConfirmReadFileDialog(props: confirmDialogProps) {
  const fileUploadInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const reader = new FileReader();
      reader.onload = () => {
        getStorageBackend().importDataFromJson(
          reader.result ? reader.result.toString() : ""
        );
        props.handleClose();
      };
      reader.readAsText(files[0], "utf-8");
    }
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
        <Button component="label">
          Yes
          <input
            hidden
            accept="application/json"
            type="file"
            onChange={fileUploadInputChange}
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
