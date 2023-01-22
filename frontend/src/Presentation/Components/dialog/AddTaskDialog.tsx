import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from "react";
import { TasksController } from "../../../Controller/Tasks";

interface addTaskProps {
  open: boolean;
  handleHideDialog(): any;
  handleRefreshPage(): any;
}

const tasksCon = new TasksController();

export default function AddTaskDialog(props: addTaskProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
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
    await tasksCon.addTask({
      id: tasksCon.getNewUniqueId(),
      name: formValues.name,
      dueDate: new Date(formValues.due),
      estimatedHours: 0,
      planned: [],
      tagId: formValues.tag,
      completed: false,
      description: "",
      subTasks: [],
      issueId: ""
    });
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  useEffect(() => {
    setFormValues(defaultValue);
  }, [props.open]);
  return (
    <Dialog open={props.open} fullScreen={fullScreen}>
      <DialogTitle>Add Task</DialogTitle>
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
        <Button autoFocus onClick={props.handleHideDialog}>
          Cancel
        </Button>
        <Button autoFocus onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
