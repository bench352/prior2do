import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {useTranslation} from "react-i18next";

interface confirmDialogProps {
    open: boolean;
    title: string;
    message: string;

    confirmAction(): any;

    handleClose(): any;
}

export default function ConfirmDialog(props: confirmDialogProps) {
    const {t} = useTranslation();
    const performConfirmAction = () => {
        props.confirmAction();
        props.handleClose();
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} autoFocus>
                    {t("dialogs.common.button.no")}
                </Button>
                <Button onClick={performConfirmAction}>{t("dialogs.common.button.yes")}</Button>
            </DialogActions>
        </Dialog>
    );
}
