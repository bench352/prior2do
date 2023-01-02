import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";

interface textInputDialogProps {
  open: boolean;
  setConfirmValue(value: string): any;
  title: string;
  message: string;
  handleClose(): any;
  type: string;
}

export default function SingleTextInputDialog(props: textInputDialogProps) {
  const [textValue, setTextValue] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };
  const handleConfirm = () => {
    props.setConfirmValue(textValue);
    props.handleClose();
  };
  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          type={props.type}
          value={textValue}
          onChange={handleInputChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

SingleTextInputDialog.defaultProps = {
  type: "text",
};
