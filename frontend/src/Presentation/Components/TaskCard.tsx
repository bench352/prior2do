import { CardActionArea, Checkbox } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import dateFormat from "dateformat";
import { useState, useEffect, useCallback } from "react";
import { TagsController } from "../../Controller/Tags";
import { TasksController } from "../../Controller/Tasks";
import { Tag, Task } from "../../Data/schemas";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import EditTaskDialog from "./dialog/EditTaskDialog";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TimelapseOutlinedIcon from "@mui/icons-material/TimelapseOutlined";

interface task {
  task: Task;
  handleRefreshPage(): any;
}

const tasksCon = new TasksController();
const tagsCon = new TagsController();

export default function TaskCard(props: task) {
  const [taskCompleted, setTaskCompleted] = useState(props.task.completed);
  const [showUpdateTaskDialog, setShowUpdateTaskDialog] = useState(false);
  const [tag, setTag] = useState(null as Tag | null);
  const refreshTags = useCallback(async () => {
    if (props.task.tagId != null) {
      try {
        setTag(await tagsCon.getTagById(props.task.tagId));
      } catch (error: any) {
        setTag(null);
      }
    }
  }, [props]);
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
  useEffect(() => {
    refreshTags();
  }, [refreshTags, props]);
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

              <Stack direction="row" spacing={1}>
                {props.task.dueDate !== null ? (
                  <Chip
                    icon={<EventOutlinedIcon fontSize="small" />}
                    size="small"
                    label={dateFormat(props.task.dueDate, "mmm dd, yyyy")}
                  />
                ) : (
                  ""
                )}

                {props.task.estimatedHours > 0 ? (
                  <Chip
                    icon={<TimelapseOutlinedIcon fontSize="small" />}
                    size="small"
                    label={`${props.task.estimatedHours}h`}
                  />
                ) : (
                  ""
                )}
                {tag != null ? (
                  <Chip
                    icon={<TagOutlinedIcon fontSize="small" />}
                    size="small"
                    label={tag.name}
                  />
                ) : (
                  ""
                )}
              </Stack>
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
