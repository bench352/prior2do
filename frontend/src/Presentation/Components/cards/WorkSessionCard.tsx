import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TimelapseOutlinedIcon from "@mui/icons-material/TimelapseOutlined";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dateFormat from "dateformat";
import { useEffect, useState } from "react";
import { TasksController } from "../../../Controller/Tasks";
import { WorkSession } from "../../../Data/schemas";
import EditWorkSessionDialog from "../dialog/plans/EditWorkSessionDialog";
import Tooltip from "@mui/material/Tooltip";
interface workSession {
  session: WorkSession;
  showPlannedDate: boolean;
  handleRefreshPage(): any;
}

const tasksCon = new TasksController();

export default function WorkSessionCard(props: workSession) {
  const [showEditSessionDialog, setShowEditSessionDialog] = useState(false);
  const [taskName, setTaskName] = useState("");
  useEffect(() => {
    tasksCon
      .getTaskById(props.session.taskId)
      .then((task) => {
        setTaskName(task.name);
      })
      .catch((error) => {
        alert(error);
      });
  }, [props.session.taskId]);
  return (
    <>
      <Card sx={{ margin: "15px 0px", width: "100%", padding: "8px" }}>
        <Stack direction="row" justifyContent="flex-start" alignItems="center">
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ width: "100%" }}
          >
            <Typography variant="h6" component="h6" noWrap>
              {taskName}
            </Typography>
            {props.showPlannedDate ? (
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
              >
                <EventOutlinedIcon />
                <Typography noWrap>
                  {dateFormat(props.session.date, "mmm dd, yyyy")}
                </Typography>
              </Stack>
            ) : (
              ""
            )}

            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
            >
              <TimelapseOutlinedIcon />
              <Typography noWrap>{`${props.session.duration}h`}</Typography>
            </Stack>
          </Stack>
          <Tooltip title="Edit Session">
            <IconButton onClick={() => setShowEditSessionDialog(true)}>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Card>

      <EditWorkSessionDialog
        open={showEditSessionDialog}
        handleClose={() => {
          setShowEditSessionDialog(false);
        }}
        handleRefreshPage={props.handleRefreshPage}
        existingWorkSession={props.session}
      />
    </>
  );
}
