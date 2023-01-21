import { CardActionArea, Checkbox, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import dateFormat from "dateformat";
import { useState } from "react";
import { getStorageBackend, Task } from "../storage/StorageBackend";
import TaskPlanDialog from "./dialog/TaskPlanDialog";

interface task {
  task: Task;
  handleRefreshPage(): any;
}

export default function TaskPlanCard(props: task) {
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
    <>
      <Card sx={{ margin: "15px 0px" }}>
        <CardActionArea
          sx={{
            padding: "10px 10px",
            display: "flex",
            justifyContent: "flex-start",
          }}
          onClick={handleShowDialog}
        >
          <Grid
            container
            direction="row"
            wrap="nowrap"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Checkbox
                name="completed"
                checked={taskCompleted}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={handleCheckboxChange}
              />
            </Grid>
            <Grid item zeroMinWidth>
              <Typography
                variant="h6"
                component="h6"
                noWrap
                style={{
                  textDecoration: taskCompleted ? "line-through" : "none",
                }}
              >
                {props.task.name}
              </Typography>
              <p>
                {props.task.tag === ""
                  ? "Uncategorized · "
                  : props.task.tag + " · "}
                {props.task.dueDate === null
                  ? "No due date"
                  : "Due " + dateFormat(props.task.dueDate, "mmm dd, yyyy")}
              </p>
              <p>
                {props.task.plannedDate !== null
                  ? "Planned on " +
                    dateFormat(props.task.plannedDate, "mmm dd, yyyy") +
                    " | Estimated " +
                    props.task.estHr +
                    "h"
                  : "No plan"}
              </p>
            </Grid>
          </Grid>
        </CardActionArea>
      </Card>
      <TaskPlanDialog
        open={showUpdateTaskDialog}
        handleHideDialog={handleHideDialog}
        handleRefreshPage={props.handleRefreshPage}
        existingTask={props.task}
      />
    </>
  );
}
