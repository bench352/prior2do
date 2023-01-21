import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import dateFormat from "dateformat";
import React, { useEffect, useState } from "react";
import { getStorageBackend, TaskV0 } from "../../../components/storage/StorageBackend";

interface editTaskProps {
  open: boolean;
  handleHideDialog(): any;
  handleRefreshPage(): any;
  existingTask: TaskV0;
}

export default function TaskPlanDialog(props: editTaskProps) {
  const storageBackend = getStorageBackend();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const defaultValue = {
    planned:
      props.existingTask.plannedDate === null
        ? ""
        : dateFormat(props.existingTask.plannedDate, "yyyy-mm-dd"),
    est: props.existingTask.estHr,
  };
  const [formValues, setFormValues] = useState(defaultValue);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleSubmit = () => {
    storageBackend.updateTask({
      id: props.existingTask.id,
      name: props.existingTask.name,
      dueDate: props.existingTask.dueDate,
      estHr: (formValues.est as unknown) !== "" ? formValues.est : 0,
      plannedDate: new Date(formValues.planned),
      completed: props.existingTask.completed,
      tag: props.existingTask.tag,
    });
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  useEffect(() => {
    setFormValues(defaultValue); 
  }, [props.open]);
  return (
    <Dialog open={props.open} fullScreen={fullScreen}>
      <DialogTitle>Task Plan</DialogTitle>
      <DialogContent
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
          flexDirection: "column",
        }}
      >
        <TextField
          id="name"
          name="name"
          label="Name"
          type="text"
          style={{ width: "auto" }}
          value={props.existingTask.name}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="planned"
          name="planned"
          label="Planned On"
          type="date"
          style={{ width: "auto" }}
          value={formValues.planned}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="estHr"
          name="est"
          label="Estimated Time (hr)"
          type="number"
          style={{ width: "auto" }}
          value={formValues.est}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleHideDialog}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Plan</Button>
      </DialogActions>
    </Dialog>
  );
}
