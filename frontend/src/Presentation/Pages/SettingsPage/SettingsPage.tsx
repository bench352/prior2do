import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {useTheme} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useState} from "react";
import {SettingsController} from "../../../Controller/Settings";
import {appVersion} from "../../../Const";
import {AccountsController} from "../../../Controller/Accounts";
import {InExportsController} from "../../../Controller/InExports";
import {TasksController} from "../../../Controller/Tasks";
import LicenseDialog from "../../Components/dialog/settings/LicenseDialog";
import SingleTextInputDialog from "../../Components/dialog/misc/SingleTextInputDialog";
import ConfirmDialog from "../../Components/dialog/misc/ConfirmDialog";
import ConfirmReadFileDialog from "../../Components/dialog/misc/ConfirmReadFileDialog";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import QuoteDialog from "../../Components/dialog/settings/QuoteDialog";
import {useTranslation} from "react-i18next";

interface SettingsPageProps {
    showUser(visibility: boolean): any;
}

const settingsCon = new SettingsController();
const inExportsCon = new InExportsController();
const accountsCon = new AccountsController();
const tasksCon = new TasksController();

export default function SettingsPage(props: SettingsPageProps) {
    const {t} = useTranslation();
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
    const [dialogVisibility, setDialogVisibility] = useState({
        importJSONData: false,
        exportJSONData: false,
        cleanupCompleted: false,
        deleteAllData: false,
        configureQuote: false,
        syncServerIPAddr: false,
        licenseDialog: false,
    });
    const [syncOptionEnabled, setSyncOptionEnabled] = useState(
        settingsCon.getIsSyncEnabled()
    );
    const updateVisibility = (item: string, visibility: boolean) => {
        setDialogVisibility({
            ...dialogVisibility,
            [item]: visibility,
        });
    };
    const [syncServerIPAddr, setSyncServerIPAddr] = useState(
        settingsCon.getServerAddress()
    );
    const handleSetSyncServerIPAddr = (addr: string) => {
        setSyncServerIPAddr(addr);
        settingsCon.setServerAddress(addr);
    };
    const handleSyncOptionChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSyncOptionEnabled(e.target.checked);
        settingsCon.setIsSyncEnabled(e.target.checked);
        props.showUser(e.target.checked);
    };
    return (
        <Container disableGutters={isMobileScreenSize}>
            <Grid container spacing={2} columns={{xs: 6, sm: 6, md: 12}}>
                <Grid item xs={6}>
                    <h2>{t("settings.managingAppData.title")}</h2>
                    <List sx={{width: "100%"}}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    updateVisibility("importJSONData", true);
                                }}
                            >
                                <ListItemIcon>
                                    <FileDownloadOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("settings.managingAppData.importDataFromJson.option")}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    updateVisibility("exportJSONData", true);
                                }}
                            >
                                <ListItemIcon>
                                    <FileUploadOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("settings.managingAppData.exportDataToJson.option")}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    updateVisibility("cleanupCompleted", true);
                                }}
                            >
                                <ListItemIcon>
                                    <CleaningServicesOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("settings.managingAppData.cleanupAllCompleted.option")}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    updateVisibility("deleteAllData", true);
                                }}
                            >
                                <ListItemIcon>
                                    <DeleteOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("settings.managingAppData.deleteAllData.option")}/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <h2>{t("settings.appSettings.title")}</h2>
                    <List sx={{width: "100%"}}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    updateVisibility("configureQuote", true);
                                }}
                            >
                                <ListItemIcon>
                                    <FormatQuoteIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("settings.appSettings.configureQuote")}/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <h2>Prior2Do Sync</h2>
                    <Alert severity="info">
                        <AlertTitle>{t("settings.prior2DoSync.alert.title")}</AlertTitle>
                        {t("settings.prior2DoSync.alert.message.preStrong")}
                        <strong>{" " + t("settings.prior2DoSync.alert.message.strong") + " "}</strong>
                        {t("settings.prior2DoSync.alert.message.postStrong")}
                    </Alert>
                    <List sx={{width: "100%"}}>
                        <ListItem>
                            <ListItemIcon>
                                <CloudSyncIcon/>
                            </ListItemIcon>
                            <ListItemText primary={t("settings.prior2DoSync.enableSync.option")}/>
                            <Switch
                                edge="end"
                                checked={syncOptionEnabled}
                                onChange={handleSyncOptionChanges}
                            />
                        </ListItem>
                        {syncOptionEnabled ? (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            updateVisibility("syncServerIPAddr", true);
                                        }}
                                    >
                                        <ListItemIcon>
                                            <DnsOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={t("settings.prior2DoSync.serverAddress.option")}
                                            secondary={syncServerIPAddr}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={async () => {
                                            alert(await settingsCon.getServerConnectionStatus());
                                        }}
                                    >
                                        <ListItemIcon>
                                            <SyncAltOutlinedIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={t("settings.prior2DoSync.testConnection.option")}/>
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ) : (
                            ""
                        )}
                    </List>
                    <h2>{t("settings.aboutThisApp.title")}</h2>
                    <List sx={{width: "100%"}}>
                        <ListItem>
                            <ListItemIcon>
                                <InfoOutlinedIcon/>
                            </ListItemIcon>
                            <ListItemText primary={t("settings.aboutThisApp.appVersion")} secondary={appVersion}/>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    updateVisibility("licenseDialog", true);
                                }}
                            >
                                <ListItemIcon>
                                    <DescriptionOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("settings.aboutThisApp.license")}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    window.open("https://github.com/bench352/prior2do");
                                }}
                            >
                                <ListItemIcon>
                                    <GitHubIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("settings.aboutThisApp.projectGH")}/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

            <ConfirmReadFileDialog
                open={dialogVisibility.importJSONData}
                title={t("settings.managingAppData.dialogs.importData.title")}
                message={
                    accountsCon.isLoggedIn()
                        ? t("settings.managingAppData.dialogs.importData.message.loggedIn")
                        : t("settings.managingAppData.dialogs.importData.message.notLoggedIn")
                }
                handleClose={() => {
                    updateVisibility("importJSONData", false);
                }}
            />
            <ConfirmDialog
                open={dialogVisibility.exportJSONData}
                confirmAction={() => {
                    inExportsCon.exportDataToJson();
                }}
                title={t("settings.managingAppData.dialogs.exportData.title")}
                message={
                    accountsCon.isLoggedIn()
                        ? t("settings.managingAppData.dialogs.exportData.message.loggedIn")
                        : t("settings.managingAppData.dialogs.exportData.message.notLoggedIn")
                }
                handleClose={() => {
                    updateVisibility("exportJSONData", false);
                }}
            />
            <ConfirmDialog
                open={dialogVisibility.cleanupCompleted}
                confirmAction={async () => {
                    await tasksCon.cleanupCompleted();
                }}
                title={t("settings.managingAppData.dialogs.cleanupAllCompleted.title")}
                message={
                    accountsCon.isLoggedIn()
                        ? t("settings.managingAppData.dialogs.cleanupAllCompleted.message.loggedIn")
                        : t("settings.managingAppData.dialogs.cleanupAllCompleted.message.notLoggedIn")
                }
                handleClose={() => {
                    updateVisibility("cleanupCompleted", false);
                }}
            />
            <ConfirmDialog
                open={dialogVisibility.deleteAllData}
                confirmAction={() => {
                    localStorage.clear();
                    window.location.reload();
                }}
                title={t("settings.managingAppData.dialogs.deleteAllData.title")}
                message={t("settings.managingAppData.dialogs.deleteAllData.message")}
                handleClose={() => {
                    updateVisibility("deleteAllData", false);
                }}
            />
            <SingleTextInputDialog
                open={dialogVisibility.syncServerIPAddr}
                setConfirmValue={handleSetSyncServerIPAddr}
                title={t("settings.prior2DoSync.dialogs.setServerAddress.title")}
                message={t("settings.prior2DoSync.dialogs.setServerAddress.message")}
                defaultValue={syncServerIPAddr}
                handleClose={() => {
                    updateVisibility("syncServerIPAddr", false);
                }}
            />
            <LicenseDialog
                open={dialogVisibility.licenseDialog}
                handleHideDialog={() => {
                    updateVisibility("licenseDialog", false);
                }}
            />
            <QuoteDialog
                open={dialogVisibility.configureQuote}
                handleHideDialog={() => {
                    updateVisibility("configureQuote", false);
                }}
            />
        </Container>
    );
}
