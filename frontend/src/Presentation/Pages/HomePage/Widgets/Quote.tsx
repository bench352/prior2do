import {Paper, Typography} from "@mui/material";
import {SettingsController} from "../../../../Controller/Settings";

const settingsCon = new SettingsController();

export default function QuoteWidget() {
    const quote = settingsCon.getQuote();
    return (
        <Paper elevation={4} sx={{padding: "10px"}}>
            <Typography
                variant="h5"
                component="p"
                sx={{fontStyle: "italic", fontWeight: "bold"}}
            >
                "{quote.text}"
            </Typography>
            <Typography variant="h6" component="p" sx={{fontStyle: "italic"}}>
                - {quote.author}
            </Typography>
        </Paper>
    );
}
