import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TimelapseOutlinedIcon from "@mui/icons-material/TimelapseOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import dateFormat from "dateformat";
import { useState } from "react";
import { WorkSessionsController } from "../../../../Controller/WorkSessions";
import { WorkSession } from "../../../../Data/schemas";
import ConfirmDialog from "../misc/ConfirmDialog";

interface DialogProps {
  open: boolean;
  handleRefreshPage(): any;
  handleClose(): any;
  existingWorkSession: WorkSession;
}

const workSessionsCon = new WorkSessionsController();

export default function EditWorkSessionDialog(props: DialogProps) {
  const [formValues, setFormValues] = useState({
    plannedOn: dateFormat(props.existingWorkSession.date, "yyyy-mm-dd"),
    budgetedTime: props.existingWorkSession.duration.toString(),
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    if (formValues.plannedOn.trim().length === 0) {
      alert("Provide a valid date!");
      return;
    }
    await workSessionsCon.updateWorkSession({
      ...props.existingWorkSession,
      date: new Date(formValues.plannedOn),
      duration: parseFloat(formValues.budgetedTime),
    });
    props.handleRefreshPage();
    props.handleClose();
  };
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <UpdateOutlinedIcon />
          <h4>Edit Work Session</h4>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <TextField
            id="name"
            type="date"
            name="plannedOn"
            label="Planned On"
            variant="standard"
            style={{ width: "100%" }}
            value={formValues.plannedOn}
            onChange={handleInputChange}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="description"
            type="number"
            name="budgetedTime"
            label="Budgeted Time (h)"
            variant="standard"
            style={{ width: "100%" }}
            value={formValues.budgetedTime}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TimelapseOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => {
            setShowDeleteDialog(true);
          }}
        >
          Delete
        </Button>
        <Button onClick={handleSubmit}>Close</Button>
      </DialogActions>
      <ConfirmDialog
        open={showDeleteDialog}
        handleClose={() => setShowDeleteDialog(false)}
        title="Delete Work Session"
        message="Are you sure you want to delete this work session?"
        confirmAction={() => {
          workSessionsCon.deleteWorkSession(props.existingWorkSession.id);
          props.handleRefreshPage();
        }}
      />
    </Dialog>
  );
}
