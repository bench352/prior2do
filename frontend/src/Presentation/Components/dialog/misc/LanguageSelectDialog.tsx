import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { ListItemIcon, ListItemText } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useTranslation } from "react-i18next";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { UILanguages } from "../../../../Data/schemas";
import LanguageIcon from "@mui/icons-material/Language";

interface LanguageSelectDialogProps {
  open: boolean;
  handleClose(): any;
  handleLanguageChange(language: string): any;
}

export default function LanguageSelectDialog(props: LanguageSelectDialogProps) {
  const { i18n, t } = useTranslation();
  const handleLanguageChange = (language: string) => {
    props.handleLanguageChange(language);
    props.handleClose();
  };
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>
        {t("langSelector.title") +
          (i18n.language !== "en" ? " (Choose Your Language)" : "")}
      </DialogTitle>
      <DialogContent>
        <List>
          {Object.entries(UILanguages).map(([key, value]) => (
            <ListItem disablePadding key={key}>
              <ListItemButton onClick={() => handleLanguageChange(key)}>
                <ListItemText primary={value} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
