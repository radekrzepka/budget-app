import { addEventListenerToAddRecordButton } from "../addOrSwitchNewRecord.js";
import { getUserData, addEventListenerToLogOutButton } from "../firebaseService.js";
import { printMonthInCalendar } from "./printMonthInCalendar.js";

getUserData().then(user => {
	const lastSlash = location.href.lastIndexOf("/");
	if (user == undefined) location.href = `${location.href.substring(0, lastSlash)}/index.html`;
});

addEventListenerToAddRecordButton();
addEventListenerToLogOutButton();

const polishMonthName = month => {
	switch (month) {
		case 1:
			return "styczeń";
			break;
		case 2:
			return "luty";
			break;
		case 3:
			return "marzec";
			break;
		case 4:
			return "kwiecień";
			break;
		case 5:
			return "maj";
			break;
		case 6:
			return "czerwiec";
			break;
		case 7:
			return "lipiec";
			break;
		case 8:
			return "sierpień";
			break;
		case 9:
			return "wrzesień";
			break;
		case 10:
			return "październik";
			break;
		case 11:
			return "listopad";
			break;
		case 12:
			return "grudzień";
			break;
	}
};

const printNameOfMonth = (month, year) => {
	nameOfMonth.textContent = `${polishMonthName(month)} ${year}`;
};

const nameOfMonth = document.querySelector(".name-of-month");
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;

const previousMonthButton = document.querySelector(".previous-month");
const nextMonthButton = document.querySelector(".next-month");

previousMonthButton.addEventListener("click", () => {
	currentMonth--;
	if (currentMonth == 0) {
		currentMonth = 12;
		currentYear--;
	}
	printMonthInCalendar(currentMonth, currentYear);
	printNameOfMonth(currentMonth, currentYear);
});

nextMonthButton.addEventListener("click", () => {
	currentMonth++;
	if (currentMonth == 13) {
		currentMonth = 1;
		currentYear++;
	}
	printMonthInCalendar(currentMonth, currentYear);
	printNameOfMonth(currentMonth, currentYear);
});

printMonthInCalendar(currentMonth, currentYear);
printNameOfMonth(currentMonth, currentYear);
