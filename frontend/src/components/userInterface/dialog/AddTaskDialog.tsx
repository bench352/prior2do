import { FormControl } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getStorageBackend } from "../../storage/StorageBackend";

interface addTaskProps {
  open: boolean;
  handleHideDialog(): any;
  handleRefreshPage(): any;
}

export default function AddTaskDialog(props: addTaskProps) {
  const storageBackend = getStorageBackend();
  const defaultValue = {
    name: "",
    due: "",
    tag: "",
  };
  const [formValues, setFormValues] = useState(defaultValue);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    await storageBackend.addTask({
      id: storageBackend.getNewUniqueId(),
      name: formValues.name,
      dueDate: new Date(formValues.due),
      estHr: 0,
      plannedDate: null,
      tag: formValues.tag,
      completed: false,
    });
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  return (
    <Dialog open={props.open}>
      <DialogTitle>Add Task</DialogTitle>
      <FormControl onSubmit={handleSubmit}>
        <div
          style={{
            padding: "10px 10px",
          }}
        >
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
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
