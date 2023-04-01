import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

interface textInputDialogProps {
  open: boolean;
  setConfirmValue(value: string): any;
  title: string;
  message: string;
  defaultValue?: string;
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
  useEffect(() => {
    setTextValue(props.defaultValue ? props.defaultValue : "");
  }, [props.defaultValue, props.open]);
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          variant="standard"
          type={props.type}
          value={textValue}
          onChange={handleInputChange}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
              handleConfirm();
            }
          }}
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
