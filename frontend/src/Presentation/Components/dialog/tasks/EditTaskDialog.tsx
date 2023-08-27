import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import {useTheme} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import dateFormat from "dateformat";
import React, {useEffect, useMemo, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import {TagsController} from "../../../../Controller/Tags";
import {TasksController} from "../../../../Controller/Tasks";
import {Tag, Task} from "../../../../Data/schemas";
import ConfirmDialog from "../misc/ConfirmDialog";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import Tooltip from "@mui/material/Tooltip";
import SubTasksView from "../../views/SubTasksView";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";

interface editTaskProps {
    open: boolean;
    existingTask: Task;

    handleHideDialog(): any;

    handleRefreshPage(): any;
}

const tasksCon = new TasksController();
const tagsCon = new TagsController();

export default function EditTaskDialog(props: editTaskProps) {
    const {t} = useTranslation();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const getTags = () => {
        tagsCon.getTags().then((value) => {
            setTags(value);
        });
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
    const [titleEditMode, setTitleEditMode] = useState(false);
    const [descEditMode, setDescEditMode] = useState(false);
    const [subTasks, setSubTasks] = useState(props.existingTask.subTasks);

    const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
    const handleSelectChange = (e: SelectChangeEvent) => {
        setFormValues({
            ...formValues,
            tagId: e.target.value,
        });
    };
    const [tags, setTags] = useState([] as Tag[]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
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
        tasksCon.updateTask({
            ...props.existingTask,
            name: formValues.name,
            dueDate: formValues.dueDate !== "" ? new Date(formValues.dueDate) : null,
            description: formValues.description,
            estimatedHours: parseFloat(formValues.estimatedHours),
            tagId: formValues.tagId !== "" ? formValues.tagId : null,
            subTasks: subTasks,
        });
        props.handleHideDialog();
        props.handleRefreshPage();
    };
    useEffect(() => {
        setFormValues(defaultValue);
        setSubTasks(props.existingTask.subTasks);
        getTags();
    }, [
        defaultValue,
        props.existingTask.tagId,
        props.existingTask.subTasks,
        props.open,
    ]);
    return (
        <Dialog
            open={props.open}
            onClose={handleSubmit}
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth="sm"
            scroll="paper"
        >
            <DialogTitle>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <TaskAltOutlinedIcon/>
                    {titleEditMode ? (
                        <TextField
                            id="name"
                            type="text"
                            name="name"
                            variant="standard"
                            fullWidth
                            value={formValues.name}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <h4>{formValues.name}</h4>
                    )}
                    <Tooltip
                        title={
                            titleEditMode
                                ? t("dialogs.taskRelated.tooltip.editMode.confirm")
                                : t("dialogs.taskRelated.tooltip.editMode.rename")
                        }
                    >
                        <IconButton
                            onClick={() => {
                                setTitleEditMode(!titleEditMode);
                            }}
                        >
                            {titleEditMode ? (
                                <DoneOutlinedIcon fontSize="small"/>
                            ) : (
                                <EditOutlinedIcon fontSize="small"/>
                            )}
                        </IconButton>
                    </Tooltip>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3} columns={{xs: 6, md: 12}}>
                    <Grid item xs={6}>
                        <Stack spacing={1}>
                            <Box>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography
                                        component="h5"
                                        sx={{fontWeight: "bold"}}
                                        noWrap
                                        gutterBottom={false}
                                    >
                                        {t("dialogs.common.description")}
                                    </Typography>
                                    <Tooltip
                                        title={
                                            descEditMode
                                                ? t("dialogs.taskRelated.tooltip.editMode.confirm")
                                                : t("dialogs.taskRelated.tooltip.editMode.edit")
                                        }
                                    >
                                        <IconButton
                                            onClick={() => {
                                                setDescEditMode(!descEditMode);
                                            }}
                                        >
                                            {descEditMode ? (
                                                <DoneOutlinedIcon fontSize="small"/>
                                            ) : (
                                                <EditOutlinedIcon fontSize="small"/>
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                                {descEditMode ? (
                                    <TextField
                                        id="description"
                                        type="text"
                                        name="description"
                                        variant="standard"
                                        fullWidth
                                        minRows={1}
                                        value={formValues.description}
                                        onChange={handleInputChange}
                                        multiline
                                    />
                                ) : (
                                    <ReactMarkdown
                                        children={
                                            formValues.description.trim().length === 0
                                                ? t(
                                                    "dialogs.taskRelated.textfield.description.noDescription"
                                                )
                                                : formValues.description
                                        }
                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                    />
                                )}
                            </Box>

                            <TextField
                                id="dueDate"
                                type="date"
                                name="dueDate"
                                label={t("dialogs.taskRelated.textfield.dueDate.label")}
                                variant="standard"
                                fullWidth
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
                                label={t("dialogs.taskRelated.textfield.estTimeHour.label")}
                                variant="standard"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={formValues.estimatedHours}
                                onChange={handleInputChange}
                            />
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="select-tag">
                                    {t("dialogs.taskRelated.select.tag.label")}
                                </InputLabel>
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
                    <Grid item xs={6}>
                        <Stack spacing={1}>
                            <SubTasksView subTasks={subTasks} setSubTasks={setSubTasks}/>
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
                    {t("dialogs.common.button.delete")}
                </Button>
                <Button onClick={handleSubmit}>
                    {t("dialogs.common.button.okay")}
                </Button>
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
