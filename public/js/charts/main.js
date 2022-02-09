import { addEventListenerToAddRecordButton } from "../addOrSwitchNewRecord.js";
import { getUserData, addEventListenerToLogOutButton } from "../firebaseService.js";

getUserData().then(user => {
	const lastSlash = location.href.lastIndexOf("/");
	if (user == undefined) location.href = `${location.href.substring(0, lastSlash)}/index.html`;
});

addEventListenerToAddRecordButton();
addEventListenerToLogOutButton();
