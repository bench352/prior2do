import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import {SettingsController} from "../../../../Controller/Settings";
import {useTranslation} from "react-i18next";

interface QuoteDialogProps {
    open: boolean;

    handleHideDialog(): any;
}

const settingsCon = new SettingsController();

export default function QuoteDialog(props: QuoteDialogProps) {
     const {t} = useTranslation();
    const [quoteText, setQuoteText] = useState("");
    const [quoteAuthor, setQuoteAuthor] = useState("");
    const handleQuoteTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuoteText(e.target.value);
    };
    const handleQuoteAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuoteAuthor(e.target.value);
    };
    const handleConfirm = () => {
        settingsCon.setQuote({text: quoteText, author: quoteAuthor});
        props.handleHideDialog();
    };
    useEffect(() => {
        const quote = settingsCon.getQuote();
        setQuoteText(quote.text);
        setQuoteAuthor(quote.author);
    }, [props.open]);
    return (
        <Dialog open={props.open} onClose={props.handleHideDialog}>
            <DialogTitle>{t("settings.appSettings.dialogs.configureQuote.title")}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    variant="standard"
                    type="text"
                    label={t("settings.appSettings.dialogs.configureQuote.textField.quote")}
                    value={quoteText}
                    onChange={handleQuoteTextChange}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") {
                            handleConfirm();
                        }
                    }}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    variant="standard"
                    type="text"
                    label={t("settings.appSettings.dialogs.configureQuote.textField.author")}
                    value={quoteAuthor}
                    onChange={handleQuoteAuthorChange}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") {
                            handleConfirm();
                        }
                    }}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm}>{t("dialogs.common.button.okay")}</Button>
            </DialogActions>
        </Dialog>
    );
}
