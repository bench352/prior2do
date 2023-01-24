import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import dateFormat from "dateformat";
import React, { useEffect, useState, useMemo } from "react";
import { Task } from "../../../Data/schemas";
import { TasksController } from "../../../Controller/Tasks";
import Stack from "@mui/material/Stack";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { TagsController } from "../../../Controller/Tags";
import { Tag } from "../../../Data/schemas";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import ConfirmDialog from "./ConfirmDialog";

interface editTaskProps {
  open: boolean;
  handleHideDialog(): any;
  handleRefreshPage(): any;
  existingTask: Task;
}

const tasksCon = new TasksController();
const tagsCon = new TagsController();

export default function EditTaskDialog(props: editTaskProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const getTags = async () => {
    setTags(await tagsCon.getTags());
  };
  const defaultValue = useMemo(() => {
    return {
      name: props.existingTask.name,
      description: props.existingTask.description,
      dueDate:
        props.existingTask.dueDate === null
          ? ""
          : dateFormat(props.existingTask.dueDate, "yyyy-mm-dd"),
      estimatedHours: props.existingTask.estimatedHours.toString(),
      tagId: props.existingTask.tagId ? props.existingTask.tagId : "",
    };
  }, [
    props.existingTask.description,
    props.existingTask.dueDate,
    props.existingTask.estimatedHours,
    props.existingTask.name,
    props.existingTask.tagId,
  ]);
  const [formValues, setFormValues] = useState(defaultValue);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormValues({
      ...formValues,
      tagId: e.target.value,
    });
  };
  const [tags, setTags] = useState([] as Tag[]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleDeleteTask = () => {
    tasksCon.deleteTaskById(props.existingTask.id);
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  const handleSubmit = () => {
    // BUG deselecting tag won't update the tag on UI
    tasksCon.updateTask({
      ...props.existingTask,
      name: formValues.name,
      dueDate: formValues.dueDate !== "" ? new Date(formValues.dueDate) : null,
      description: formValues.description,
      estimatedHours: parseFloat(formValues.estimatedHours),
      tagId: formValues.tagId !== "" ? formValues.tagId : null,
    });
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  useEffect(() => {
    setFormValues(defaultValue);
    getTags();
  }, [defaultValue, props.open]);
  return (
    <Dialog open={props.open} fullScreen={fullScreen}>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <TaskAltOutlinedIcon />
          <h4>Task Details</h4>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} columns={{ xs: 6, md: 12 }}>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <TextField
                id="name"
                type="text"
                name="name"
                label="Name"
                variant="standard"
                style={{ width: "100%" }}
                value={formValues.name}
                onChange={handleInputChange}
              />
              <TextField
                id="description"
                type="text"
                name="description"
                label="Description"
                variant="standard"
                style={{ width: "100%" }}
                minRows={3}
                value={formValues.description}
                onChange={handleInputChange}
                multiline
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <TextField
                id="dueDate"
                type="date"
                name="dueDate"
                label="Due Date"
                variant="standard"
                style={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={formValues.dueDate}
                onChange={handleInputChange}
              />
              <TextField
                id="estHr"
                type="number"
                name="estimatedHours"
                label="Estimated Hours"
                variant="standard"
                style={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={formValues.estimatedHours}
                onChange={handleInputChange}
              />
              <FormControl fullWidth variant="standard">
                <InputLabel id="select-tag">Tag</InputLabel>
                <Select
                  id="select-tag"
                  label="Tag"
                  value={formValues.tagId}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">
                    <em>{"(Untagged)"}</em>
                  </MenuItem>
                  {tags
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => {
            setShowConfirmDeleteDialog(true);
          }}
        >
          Delete
        </Button>
        <Button onClick={handleSubmit}>OK</Button>
      </DialogActions>
      <ConfirmDialog
        open={showConfirmDeleteDialog}
        confirmAction={handleDeleteTask}
        title={`Delete ${props.existingTask.name}?`}
        message="The deleted task cannot be recovered."
        handleClose={() => {
          setShowConfirmDeleteDialog(false);
        }}
      />
    </Dialog>
  );
}
