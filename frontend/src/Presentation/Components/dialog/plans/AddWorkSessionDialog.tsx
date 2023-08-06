import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MoreTimeOutlinedIcon from "@mui/icons-material/MoreTimeOutlined";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {useState} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TimelapseOutlinedIcon from "@mui/icons-material/TimelapseOutlined";
import Button from "@mui/material/Button";
import {WorkSessionsController} from "../../../../Controller/WorkSessions";
import {getNewUniqueId} from "../../../../Controller/Uuid";
import {useTranslation} from "react-i18next";

interface DialogProps {
    open: boolean;
    taskId: string;

    handleClose(): any;

    handleRefreshPage(): any;
}

const defaultValue = {
    plannedOn: "",
    budgetedTime: "",
};

const workSessionsCon = new WorkSessionsController();

export default function AddWorkSessionDialog(props: DialogProps) {
    const {t} = useTranslation();
    const [formValues, setFormValues] = useState(defaultValue);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
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
        await workSessionsCon.createWorkSession({
            taskId: props.taskId,
            date: new Date(formValues.plannedOn),
            duration: parseFloat(formValues.budgetedTime),
            id: getNewUniqueId(),
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
                    <MoreTimeOutlinedIcon/>
                    <h4>{t("dialogs.planRelated.addSession.title")}</h4>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <TextField
                        id="name"
                        type="date"
                        name="plannedOn"
                        label={t("dialogs.planRelated.common.plannedOn.label")}
                        variant="standard"
                        style={{width: "100%"}}
                        value={formValues.plannedOn}
                        onChange={handleInputChange}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarMonthOutlinedIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        id="description"
                        type="number"
                        name="budgetedTime"
                        label={t("dialogs.planRelated.common.budgetedTimeHour.label")}
                        variant="standard"
                        style={{width: "100%"}}
                        value={formValues.budgetedTime}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <TimelapseOutlinedIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>{t("dialogs.common.button.cancel")}</Button>
                <Button onClick={handleSubmit}>{t("dialogs.common.button.okay")}</Button>
            </DialogActions>
        </Dialog>
    );
}
