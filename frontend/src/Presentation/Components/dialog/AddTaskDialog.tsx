import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import { TasksController } from "../../../Controller/Tasks";
import Stack from "@mui/material/Stack";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { TagsController } from "../../../Controller/Tags";
import { SubTask, Tag } from "../../../Data/schemas";
import { getNewUniqueId } from "../../../Controller/Uuid";
import SubTasksView from "../views/SubTasksView";

interface addTaskProps {
  open: boolean;
  handleHideDialog(): any;
  handleRefreshPage(): any;
  defaultTagId: string;
  defaultDate?: string;
}

const tasksCon = new TasksController();
const tagsCon = new TagsController();

const defaultValue = {
  name: "",
  description: "",
  dueDate: "",
  estimatedHours: "0",
  tagId: "",
};

export default function AddTaskDialog(props: addTaskProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormValues({
      ...formValues,
      tagId: e.target.value,
    });
  };

  const [formValues, setFormValues] = useState(defaultValue);
  const [tags, setTags] = useState([] as Tag[]);
  const [subTasks, setSubTasks] = useState([] as SubTask[]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const getTags = async () => {
    setTags(await tagsCon.getTags());
  };
  const handleSubmit = async () => {
    await tasksCon.addTask({
      name: formValues.name,
      dueDate: formValues.dueDate !== "" ? new Date(formValues.dueDate) : null,
      description: formValues.description,
      estimatedHours: parseFloat(formValues.estimatedHours),
      completed: false,
      planned: [],
      subTasks: subTasks,
      tagId: formValues.tagId !== "" ? formValues.tagId : null,
      issueId: null,
      id: getNewUniqueId(),
    });
    props.handleHideDialog();
    props.handleRefreshPage();
  };
  useEffect(() => {
    setFormValues({
      ...defaultValue,
      tagId: props.defaultTagId,
      dueDate: props.defaultDate || "",
    });

    setSubTasks([]);
    getTags();
  }, [props.defaultDate, props.defaultTagId, props.open]);
  return (
    <Dialog
      open={props.open}
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth="sm"
      scroll="paper"
      onClose={props.handleHideDialog}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <AddTaskOutlinedIcon />
          <h4>Create Task</h4>
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
                autoFocus
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
                label="Estimated Time (h)"
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
              <SubTasksView subTasks={subTasks} setSubTasks={setSubTasks} />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleHideDialog}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
