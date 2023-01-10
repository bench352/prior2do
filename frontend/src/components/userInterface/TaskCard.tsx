import { CardActionArea, Checkbox } from "@mui/material";
import Card from "@mui/material/Card";
import dateFormat from "dateformat";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { getStorageBackend, Task } from "../storage/StorageBackend";
import EditTaskDialog from "./dialog/EditTaskDialog";
const buttonStyle = {
  display: "flex",
  alignItems: "center",
  width: 50,
};

interface task {
  task: Task;
  handleRefreshPage(): any;
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
  const handleCheckboxChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e.target;
    setTaskCompleted(checked);
    await storageBackend.updateTask({
      ...props.task,
      completed: checked,
    });
  };
  return (
    <div>
      <Card sx={{ margin: "15px 0px" }}>
        <CardActionArea
          sx={{
            padding: "10px 5px",
          }}
          onClick={handleShowDialog}
        >
          <Stack direction="row">
            <Box style={buttonStyle}>
              <Checkbox
                name="completed"
                checked={taskCompleted}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={handleCheckboxChange}
              />
            </Box>
            <Box sx={{ width: "auto" }}>
              <Typography variant="h6" component="h6" noWrap>
                {/* BUG Typography won't adopt to card with (overflowing) */}
                {props.task.name}
              </Typography>

              <p>
                {props.task.tag === ""
                  ? "Uncategorized · "
                  : props.task.tag + " · "}
                {props.task.dueDate === null
                  ? "No due date"
                  : "Due " + dateFormat(props.task.dueDate, "mmm dd, yyyy")}
                {props.showEstTime
                  ? " | Estimated " + props.task.estHr + "h"
                  : ""}
              </p>
            </Box>
          </Stack>
        </CardActionArea>
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
