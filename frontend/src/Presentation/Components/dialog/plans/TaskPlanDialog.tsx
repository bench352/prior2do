import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import TimelapseOutlinedIcon from "@mui/icons-material/TimelapseOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dateFormat from "dateformat";
import { useEffect, useState } from "react";
import { TagsController } from "../../../../Controller/Tags";
import { WorkSessionsController } from "../../../../Controller/WorkSessions";
import { Tag, Task, WorkSession } from "../../../../Data/schemas";
import AddWorkSessionDialog from "./AddWorkSessionDialog";
import EditWorkSessionDialog from "./EditWorkSessionDialog";

interface editPlanProps {
  open: boolean;
  handleHideDialog(): any;
  handleRefreshPage(): any;
  existingTask: Task;
}

const sessionsCon = new WorkSessionsController();
const tagsCon = new TagsController();

function WorkSessionItem(props: {
  session: WorkSession;
  handleRefreshPage: () => any;
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  return (
    <Card sx={{ padding: "8px" }}>
      <Stack direction="row" justifyContent="flex-start" alignItems="center">
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1}
          sx={{ width: "100%" }}
        >
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
        <IconButton onClick={() => setEditDialogOpen(true)}>
          <EditOutlinedIcon />
        </IconButton>
      </Stack>
      <EditWorkSessionDialog
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        handleRefreshPage={() => props.handleRefreshPage()}
        existingWorkSession={props.session}
      />
    </Card>
  );
}

//TODO fix implementation based on new schema
export default function TaskPlanDialog(props: editPlanProps) {
  const [tag, setTag] = useState(null as Tag | null);
  const [workSessions, setWorkSessions] = useState([] as WorkSession[]);
  const [showAddSessionDialog, setShowAddSessionDialog] = useState(false);
  useEffect(() => {
    let tagQue = props.existingTask.tagId || "";
    tagsCon
      .getTagById(tagQue)
      .then((value) => {
        setTag(value);
      })
      .catch(() => {
        setTag(null);
      });
    sessionsCon
      .getWorkSessionsByTaskId(props.existingTask.id)
      .then((value) => {
        setWorkSessions(value);
      })
      .catch(() => {
        setWorkSessions([]);
      });
  }, [props, showAddSessionDialog]);
  return (
    <Dialog
      open={props.open}
      onClose={props.handleHideDialog}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <FlagOutlinedIcon />
          <h4>{props.existingTask.name}</h4>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} columns={{ xs: 6, md: 12 }}>
          <Grid item xs={6} md={5}>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={1}
            >
              <h3>Description</h3>
              {props.existingTask.dueDate !== null ? (
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={1}
                >
                  <EventOutlinedIcon />
                  <Typography noWrap>
                    {dateFormat(props.existingTask.dueDate, "mmm dd, yyyy")}
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
                <TimerOutlinedIcon />
                <Typography noWrap>
                  {`${props.existingTask.estimatedHours}h`}
                </Typography>
              </Stack>
              {tag != null ? (
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={1}
                >
                  <LabelOutlinedIcon />
                  <Typography noWrap>{tag.name}</Typography>
                </Stack>
              ) : (
                ""
              )}
            </Stack>
          </Grid>
          <Grid item xs={6} md={7}>
            <Stack spacing={1}>
              <h3>Planned</h3>
              {workSessions.map((session) => (
                <WorkSessionItem
                  session={session}
                  handleRefreshPage={props.handleRefreshPage}
                  key={session.id}
                />
              ))}
              <Button
                variant="outlined"
                startIcon={<AddOutlinedIcon />}
                onClick={() => {
                  setShowAddSessionDialog(true);
                }}
              >
                Add Work Session
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleHideDialog}>Close</Button>
      </DialogActions>
      <AddWorkSessionDialog
        open={showAddSessionDialog}
        taskId={props.existingTask.id}
        handleClose={() => {
          setShowAddSessionDialog(false);
        }}
      />
    </Dialog>
  );
}
