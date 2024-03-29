import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {useTranslation} from "react-i18next";

interface licenseDialogProps {
    open: boolean;

    handleHideDialog(): any;
}

export default function LicenseDialog(props: licenseDialogProps) {
    const {t} = useTranslation();
    return (
        <Dialog open={props.open} scroll="paper" onClose={props.handleHideDialog}>
            <DialogTitle>{t("settings.aboutThisApp.license")}</DialogTitle>
            <DialogContent dividers={true}>
                <p>
                    <strong>MIT License</strong>
                </p>
                <p>Copyright (c) 2023 Ben Choy</p>
                <p>
                    Permission is hereby granted, free of charge, to any person obtaining
                    a copy of this software and associated documentation files (the
                    "Software"), to deal in the Software without restriction, including
                    without limitation the rights to use, copy, modify, merge, publish,
                    distribute, sublicense, and/or sell copies of the Software, and to
                    permit persons to whom the Software is furnished to do so, subject to
                    the following conditions:
                </p>
                <p>
                    The above copyright notice and this permission notice shall be
                    included in all copies or substantial portions of the Software.
                </p>
                <p>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
                    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
                    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
                    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleHideDialog}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
