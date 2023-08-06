import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {InExportsController} from "../../../../Controller/InExports";
import {useTranslation} from "react-i18next";

interface confirmDialogProps {
    open: boolean;
    title: string;
    message: string;

    handleClose(): any;
}

const inExportsCon = new InExportsController();

export default function ConfirmReadFileDialog(props: confirmDialogProps) {
    const {t} = useTranslation();
    const fileUploadInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const reader = new FileReader();
            reader.onload = () => {
                inExportsCon.importDataFromJson(
                    reader.result ? reader.result.toString() : ""
                ).then(() => {
                    props.handleClose();
                });

            };
            reader.readAsText(files[0], "utf-8");
        }
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
                <Button component="label">
                    {t("dialogs.common.button.yes")}
                    <input
                        hidden
                        accept="application/json"
                        type="file"
                        onChange={fileUploadInputChange}
                    />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
