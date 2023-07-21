import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { CardActionArea, Checkbox, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import dateFormat from "dateformat";
import { useEffect, useState } from "react";
import { TagsController } from "../../../Controller/Tags";
import { TasksController } from "../../../Controller/Tasks";
import { Tag, Task } from "../../../Data/schemas";
import AddWorkSessionDialog from "../dialog/plans/AddWorkSessionDialog";
import TaskPlanDialog from "../dialog/plans/TaskPlanDialog";
import Tooltip from "@mui/material/Tooltip";

interface task {
  task: Task;
  handleRefreshPage(): any;
}


const tasksCon = new TasksController();
const tagsCon = new TagsController();

function TagChip(props: { tagId: string | null }) {
  const [tag, setTag] = useState(null as Tag | null);
  useEffect(() => {
    let tagQue = props.tagId || "";
    tagsCon
      .getTagById(tagQue)
      .then((value) => {
        setTag(value);
      })
      .catch(() => {
        setTag(null);
      });
  }, [props]);
  return tag != null ? (
    <Grid item xs="auto">
      <Chip
        icon={<LabelOutlinedIcon fontSize="small" />}
        size="small"
        label={tag.name}
      />
    </Grid>
  ) : (
    <></>
  );
}

export default function TaskPlanCard(props: task) {
  const [taskCompleted, setTaskCompleted] = useState(props.task.completed);
  const [showUpdateTaskDialog, setShowUpdateTaskDialog] = useState(false);
  const [showAddSessionDialog, setShowAddSessionDialog] = useState(false);
  const handleHideDialog = () => {
    setShowUpdateTaskDialog(false);
  };
  const handleShowDialog = () => {
    setShowUpdateTaskDialog(true);
  };
  const handleHideAddDialog = () => {
    setShowAddSessionDialog(false);
  };
  const handleShowAddDialog = () => {
    setShowAddSessionDialog(true);
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setTaskCompleted(checked);
    tasksCon.updateTask({
      ...props.task,
      completed: checked,
    });
  };
  return (
    <>
      <Card sx={{ margin: "15px 0px", width: "100%" }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item zeroMinWidth xs>
            <CardActionArea
              onClick={handleShowDialog}
              sx={{ padding: "10px 0px 10px 5px" }}
            >
              <Grid
                container
                direction="row"
                wrap="nowrap"
                justifyContent="flex-start"
                alignItems="center"
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
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    columnSpacing={0.5}
                    rowSpacing={0.5}
                  >
                    <Grid item xs="auto">
                      {props.task.dueDate !== null ? (
                        <Chip
                          icon={<EventOutlinedIcon fontSize="small" />}
                          size="small"
                          label={
                            dateFormat(Date.now(), "yyyy") ===
                            dateFormat(props.task.dueDate, "yyyy")
                              ? dateFormat(props.task.dueDate, "mmm dd")
                              : dateFormat(props.task.dueDate, "mmm dd, yyyy")
                          }
                        />
                      ) : (
                        ""
                      )}
                    </Grid>

                    {props.task.estimatedHours > 0 ? (
                      <Grid item xs="auto">
                        <Chip
                          icon={<TimerOutlinedIcon fontSize="small" />}
                          size="small"
                          label={`${props.task.estimatedHours}h`}
                        />
                      </Grid>
                    ) : (
                      ""
                    )}

                    <TagChip tagId={props.task.tagId} />

                    {props.task.subTasks.length > 0 ? (
                      <Grid item xs="auto">
                        <Chip
                          icon={
                            <CheckCircleOutlineOutlinedIcon fontSize="small" />
                          }
                          size="small"
                          label={`${
                            props.task.subTasks.filter(
                              (subTask) => subTask.completed
                            ).length
                          }/${props.task.subTasks.length}`}
                        />
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </CardActionArea>
          </Grid>
          <Grid item xs="auto" sx={{ padding: "10px 5px 10px 0px" }}>
            <Tooltip title="Add plan">
              <IconButton onClick={handleShowAddDialog}>
                <AddOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Card>
      <TaskPlanDialog
        open={showUpdateTaskDialog}
        handleHideDialog={handleHideDialog}
        handleRefreshPage={props.handleRefreshPage}
        existingTask={props.task}
      />
      <AddWorkSessionDialog
        open={showAddSessionDialog}
        taskId={props.task.id}
        handleRefreshPage={props.handleRefreshPage}
        handleClose={handleHideAddDialog}
      />
    </>
  );
}
