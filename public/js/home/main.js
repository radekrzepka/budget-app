import { addEventListenerToAddRecordButton } from "../addOrSwitchNewRecord.js";
import { showList } from "./showList.js";
import { updateBar, addEventListenerToSwitchGoalButton } from "./updateBarAndGoal.js";
import { getUserData, addEventListenerToLogOutButton } from "../firebaseService.js";

getUserData().then(user => {
	const lastSlash = location.href.lastIndexOf("/");
	if (user == undefined) location.href = `${location.href.substring(0, lastSlash)}/index.html`;
});

showList();
updateBar();
addEventListenerToAddRecordButton();
addEventListenerToSwitchGoalButton();
addEventListenerToLogOutButton();
