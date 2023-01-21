import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import CommonView from "./Presentation/CommonView";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#ffc400" },
  },
});
root.render(
  <ThemeProvider theme={theme}>
    <HashRouter>
      <CommonView />
    </HashRouter>
  </ThemeProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister(); // TODO Change back to register() before release

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
