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
import { Task } from "../../../Data/schemas";
import { TasksController } from "../../../Controller/Tasks";

interface editTaskProps {
  open: boolean;
  handleHideDialog(): any;
  handleRefreshPage(): any;
  existingTask: Task;
}

const tasksCon = new TasksController();

export default function EditTaskDialog(props: editTaskProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const defaultValue = {
    name: props.existingTask.name,
    due:
      props.existingTask.dueDate === null
        ? ""
        : dateFormat(props.existingTask.dueDate, "yyyy-mm-dd"),
    tag: props.existingTask.tagId,
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
    tasksCon.deleteTaskById(props.existingTask.id);
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  const handleSubmit = () => {
    tasksCon.updateTask(
      props.existingTask // TODO Fix implementation based on new schema
    );
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  useEffect(() => {
    setFormValues(defaultValue);
  }, [props.open]);
  return (
    <Dialog open={props.open} fullScreen={fullScreen}>
      <DialogTitle>Edit Task</DialogTitle>
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
          required
          autoFocus
          id="name"
          name="name"
          label="Name"
          type="text"
          style={{ width: "auto" }}
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
          style={{ width: "auto" }}
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
          style={{ width: "auto" }}
          value={formValues.tag}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
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