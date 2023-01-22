import { CardActionArea, Checkbox } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import dateFormat from "dateformat";
import { useState } from "react";
import { TasksController } from "../../Controller/Tasks";
import { Task } from "../../Data/schemas";
import EditTaskDialog from "./dialog/EditTaskDialog";

interface task {
  task: Task;
  handleRefreshPage(): any;
  showEstTime: boolean;
}

const tasksCon = new TasksController();

export default function TaskCard(props: task) {
  const [taskCompleted, setTaskCompleted] = useState(props.task.completed);
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
    await tasksCon.updateTask({
      ...props.task,
      completed: checked,
    });
  };
  return (
    <>
      <Card sx={{ margin: "15px 0px" }}>
        <CardActionArea
          sx={{
            padding: "10px 5px",
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
                {props.task.tagId === "" // TODO update task tag implementation
                  ? "Uncategorized · "
                  : props.task.tagId + " · "}
                {props.task.dueDate === null
                  ? "No due date"
                  : "Due " + dateFormat(props.task.dueDate, "mmm dd, yyyy")}
                {props.showEstTime
                  ? " | Estimated " + props.task.estimatedHours + "h"
                  : ""}
              </p>
            </Grid>
          </Grid>
        </CardActionArea>
      </Card>
      <EditTaskDialog
        open={showUpdateTaskDialog}
        handleHideDialog={handleHideDialog}
        handleRefreshPage={props.handleRefreshPage}
        existingTask={props.task}
      />
    </>
  );
}
