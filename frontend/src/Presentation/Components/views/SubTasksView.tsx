import { SubTask } from "../../../Data/schemas";
import { Box } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Reorder } from "framer-motion";
import Card from "@mui/material/Card";
import InputBase from "@mui/material/InputBase";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { getNewUniqueId } from "../../../Controller/Uuid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useTranslation } from "react-i18next";

function SubTaskCard(props: {
  subTask: SubTask;
  updateSubTask(subTask: SubTask): any;
  deleteSubTask(id: string): any;
}) {
  const [name, setName] = useState(props.subTask.name);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
    props.updateSubTask({ ...props.subTask, name: value });
  };
  const [taskCompleted, setTaskCompleted] = useState(props.subTask.completed);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setTaskCompleted(checked);
    props.updateSubTask({ ...props.subTask, completed: checked });
  };
  return (
    <Card>
      <Stack direction="row" justifyContent="flex-start" alignItems="center">
        <DragIndicatorOutlinedIcon fontSize="small" color="action" />
        <Checkbox
          name="completed"
          checked={taskCompleted}
          onChange={handleCheckboxChange}
        />
        <InputBase
          fullWidth
          value={name}
          onChange={handleInputChange}
          style={{ textDecoration: taskCompleted ? "line-through" : "none" }}
        />
        <IconButton
          onClick={() => {
            props.deleteSubTask(props.subTask.id);
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </Stack>
    </Card>
  );
}

export default function SubTasksView(props: {
  subTasks: SubTask[];
  setSubTasks(subTasks: SubTask[]): any;
}) {
  const { t } = useTranslation();
  const [addSubTaskField, setAddSubTaskField] = useState("");
  const handleAddSubtasksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAddSubTaskField(value);
  };
  const addNewSubTask = () => {
    if (addSubTaskField.length > 0) {
      props.setSubTasks([
        ...props.subTasks,
        { id: getNewUniqueId(), name: addSubTaskField, completed: false },
      ]);
      setAddSubTaskField("");
    }
  };
  const updateSubTask = (subTaskToUpdate: SubTask) => {
    props.setSubTasks(
      props.subTasks.map((sub) =>
        sub.id === subTaskToUpdate.id ? subTaskToUpdate : sub
      )
    );
  };
  const deleteSubTask = (id: string) => {
    props.setSubTasks(props.subTasks.filter((subTask) => subTask.id !== id));
  };
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        height={36}
        spacing={1}
      >
        <Typography component="h5" sx={{ fontWeight: "bold" }} noWrap>
          {t("views.subTasks.title")}
        </Typography>
        {props.subTasks.length > 0 ? (
          <Chip
            label={`${
              props.subTasks.filter((subTask) => subTask.completed).length
            }/${props.subTasks.length}`}
            icon={<CheckCircleOutlineOutlinedIcon fontSize="small" />}
            size="small"
          />
        ) : (
          ""
        )}
      </Stack>

      <Reorder.Group
        axis="y"
        onReorder={props.setSubTasks}
        values={props.subTasks}
        as="div"
      >
        <Stack spacing={1}>
          {props.subTasks.map((subTask) => (
            <Reorder.Item key={subTask.id} value={subTask} as="div">
              <SubTaskCard
                subTask={subTask}
                updateSubTask={updateSubTask}
                deleteSubTask={deleteSubTask}
              />
            </Reorder.Item>
          ))}
          <Card>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <DragIndicatorOutlinedIcon fontSize="small" color="disabled" />
              <Checkbox disabled />
              <InputBase
                placeholder={t("views.subTasks.placeholder.addTask")}
                value={addSubTaskField}
                onChange={handleAddSubtasksChange}
                fullWidth
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") {
                    addNewSubTask();
                  }
                }}
              />
              <IconButton
                onClick={addNewSubTask}
                disabled={addSubTaskField.trim().length === 0}
              >
                <AddOutlinedIcon />
              </IconButton>
            </Stack>
          </Card>
        </Stack>
      </Reorder.Group>
    </Box>
  );
}
