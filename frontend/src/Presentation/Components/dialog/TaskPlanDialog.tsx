import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { Tag, Task } from "../../../Data/schemas";
import { TasksController } from "../../../Controller/Tasks";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import Grid from "@mui/material/Grid";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import Typography from "@mui/material/Typography";
import dateFormat from "dateformat";
import { useState } from "react";
import { TagsController } from "../../../Controller/Tags";
import { useEffect } from "react";
import Card from "@mui/material/Card";

import TextField from "@mui/material/TextField";

interface editTaskProps {
  open: boolean;
  handleHideDialog(): any;
  handleRefreshPage(): any;
  existingTask: Task;
}

const tasksCon = new TasksController();
const tagsCon = new TagsController();

//TODO fix implementation based on new schema
export default function TaskPlanDialog(props: editTaskProps) {
  const [tag, setTag] = useState(null as Tag | null);
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
  }, [props]);
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
            <Card>
              <Typography variant="h6" noWrap>
                Create Work Session
              </Typography>
              <TextField
                id="input-with-icon-textfield"
                label="Planned on"
                type="date"
                variant="standard"
              />
              <TextField
                id="outlined-basic"
                label="Budgeted Time (h)"
                variant="standard"
                type="number"
              />
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
