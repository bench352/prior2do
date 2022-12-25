import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Checkbox } from "@mui/material";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { getStorageBackend, Task } from "../storage/StorageBackend";
import dateFormat from "dateformat";
import EditTaskDialog from "./dialog/EditTaskDialog";
const buttonStyle = {
  display: "flex",
  alignItems: "center",
  width: 50,
};

interface task {
  task: Task;
  handleRefreshPage: any;
  showEstTime: boolean;
}

export default function TaskCard(props: task) {
  const [taskCompleted, setTaskCompleted] = useState(props.task.completed);
  const storageBackend = getStorageBackend();
  const [showUpdateTaskDialog, setShowUpdateTaskDialog] = useState(false);
  const handleHideDialog = () => {
    setShowUpdateTaskDialog(false);
  };
  const handleShowDialog = () => {
    setShowUpdateTaskDialog(true);
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setTaskCompleted(checked);
    storageBackend.updateTask({
      ...props.task,
      completed: checked,
    });
  };
  return (
    <div>
      <Card sx={{ padding: "10px 10px", margin: "15px 0px", display: "flex" }}>
        <div style={buttonStyle}>
          <Checkbox
            name="completed"
            checked={taskCompleted}
            onChange={handleCheckboxChange}
          />
        </div>
        <div>
          <h3>{props.task.name}</h3>
          <p>
            {props.task.tag === ""
              ? "Uncategorized · "
              : props.task.tag + " · "}
            {props.task.dueDate === null
              ? "No due date"
              : "Due " + dateFormat(props.task.dueDate, "mmm dd, yyyy")}
            {props.showEstTime ? " | Estimated " + props.task.estHr + "h" : ""}
          </p>
        </div>
        <div style={buttonStyle}>
          <IconButton
            color="primary"
            aria-label="Edit task"
            component="label"
            onClick={handleShowDialog}
          >
            <EditOutlinedIcon />
          </IconButton>
        </div>
      </Card>
      <EditTaskDialog
        open={showUpdateTaskDialog}
        handleHideDialog={handleHideDialog}
        handleRefreshPage={props.handleRefreshPage}
        existingTask={props.task}
      />
    </div>
  );
}
