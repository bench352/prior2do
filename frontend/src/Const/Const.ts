export const appVersion = "0.1.1";
export const releaseContent = `
# 0.1.1 Release

This release brings enhancements to the app feature and improvements to the user experience, alongside a few bug fixes. Changes to the app include:

**Task Card**

- The entire task card is now clickable (clicking on it will open the Edit Task/Task Plan dialog, depending on the page you are on). The small icon button for performing such action is now removed.
- Ticking the checkbox for completing the task will show a strikethrough effect on the task name.
- Task with a task name longer than the width of the task card will be wrapped.

**Prior2Do Sync**

- On the Prior2Do Account login page, icons are shown on the username and password textbox.
- Clicking the Sign Up button will automatically sign you in upon successful signup.
- The loading animation for refreshing tasks now appears on the app bar instead of covering up the entire screen.
- Whenever the app refreshes the tasks, tasks stored locally will be shown immediately while loading the tasks from the remote server.

**Other UI Enhancements**

- The Add Task/Edit Task/Task Plan dialog is full-screen on mobile screen size.
- The side navigation bar is now permanent on larger screen sizes. On mobile screen size, it will hover over the screen content instead.
- On mobile screen size, the padding on the left/right side of the screen is now smaller.
- The status bar of the app now matches the color of the app bar.

**Bug Fix**

- Fixed a bug wherein the dialogs retain the inputted value when the dialog is closed.

(A complete release note is available on [the Release page of the GitHub repository](https://github.com/bench352/prior2do/releases).)

---

**The app is NOT stable yet**. Changes to the app will be made in future updates and may result in corrupted or lost app data. You are welcome to try the features in the app, but **it is not recommended to keep important information in this version of the app**.
`;
