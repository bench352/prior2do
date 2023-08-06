import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

interface textInputDialogProps {
    open: boolean;
    title: string;
    message: string;
    defaultValue?: string;
    type: string;

    setConfirmValue(value: string): any;

    handleClose(): any;
}

export default function SingleTextInputDialog(props: textInputDialogProps) {
    const {t} = useTranslation();
    const [textValue, setTextValue] = useState("");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextValue(e.target.value);
    };
    const handleConfirm = () => {
        props.setConfirmValue(textValue);
        props.handleClose();
    };
    useEffect(() => {
        setTextValue(props.defaultValue ? props.defaultValue : "");
    }, [props.defaultValue, props.open]);
    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.message}</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    variant="standard"
                    type={props.type}
                    value={textValue}
                    onChange={handleInputChange}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") {
                            handleConfirm();
                        }
                    }}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>{t("dialogs.common.button.cancel")}</Button>
                <Button onClick={handleConfirm}>{t("dialogs.common.button.okay")}</Button>
            </DialogActions>
        </Dialog>
    );
}

SingleTextInputDialog.defaultProps = {
    type: "text",
};
