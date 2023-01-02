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
  handleHideDialog(): any;
  handleRefreshPage(): any;
  existingTask: Task;
}

export default function EditTaskDialog(props: editTaskProps) {
  const storageBackend = getStorageBackend();
  const defaultValue = {
    name: props.existingTask.name,
    due:
      props.existingTask.dueDate === null
        ? ""
        : dateFormat(props.existingTask.dueDate, "yyyy-mm-dd"),
    tag: props.existingTask.tag,
  };
  const [formValues, setFormValues] = useState(defaultValue);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleDeleteTask = () => {
    storageBackend.deleteTaskById(props.existingTask.id);
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  const handleSubmit = () => {
    storageBackend.updateTask({
      id: props.existingTask.id,
      name: formValues.name,
      dueDate: new Date(formValues.due),
      estHr: props.existingTask.estHr,
      plannedDate: props.existingTask.plannedDate,
      completed: props.existingTask.completed,
      tag: formValues.tag,
    });
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  return (
    <Dialog open={props.open}>
      <DialogTitle>Edit Task</DialogTitle>
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
              required
              autoFocus
              id="name"
              name="name"
              label="Name"
              type="text"
              value={formValues.name}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="due"
              name="due"
              label="Due Date"
              type="date"
              value={formValues.due}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="tag"
              name="tag"
              label="Tag"
              type="text"
              value={formValues.tag}
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
        <Button color="error" onClick={handleDeleteTask}>
          Delete
        </Button>
        <Button onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}
