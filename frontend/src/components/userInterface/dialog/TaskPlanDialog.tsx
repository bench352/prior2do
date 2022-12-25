import { FormControl } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import dateFormat from "dateformat";
import React, { useState } from "react";
import { getStorageBackend, Task } from "../../storage/StorageBackend";

interface editTaskProps {
  open: boolean;
  handleHideDialog: any;
  handleRefreshPage: any;
  existingTask: Task;
}

export default function TaskPlanDialog(props: editTaskProps) {
  const storageBackend = getStorageBackend();
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
      estHr: formValues.est,
      plannedDate: new Date(formValues.planned),
      completed: props.existingTask.completed,
      tag: props.existingTask.tag,
    });
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  return (
    <Dialog open={props.open}>
      <DialogTitle>Task Plan</DialogTitle>
      <FormControl onSubmit={handleSubmit}>
        <div style={{ padding: "10px 10px" }}>
          <Box
            component="form"
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
            }}
          >
            <TextField
              id="name"
              name="name"
              label="Name"
              type="text"
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
              value={formValues.est}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </div>
      </FormControl>
      <DialogActions>
        <Button onClick={props.handleHideDialog}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Plan</Button>
      </DialogActions>
    </Dialog>
  );
}
