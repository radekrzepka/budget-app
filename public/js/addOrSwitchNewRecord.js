import { sendRecordToDataBase, switchData } from "./firebaseService.js";
import { showList } from "./home/showList.js";
import { updateBar } from "./home/updateBarAndGoal.js";
import { printMonthInCalendar } from "./calendar/printMonthInCalendar.js";

const deleteForm = () => {
	document.querySelector(".form-template").remove();
};

export const checkFormAndAddOrSwitchData = (event = null) => {
	let add = true;
	if (event.currentTarget.switch) add = false;

	console.log(add);

	const nameInput = document.querySelector("#name");
	const valueInput = document.querySelector("#value");
	const dateInput = document.querySelector("#date");
	const incomeRadioInput = document.querySelector("#income");
	const exponseRadioInput = document.querySelector("#expense");

	const vaildateForm = () => {
		if (nameInput.value === "" || valueInput.value === "" || dateInput.value === "" || dateInput.value === "" || incomeRadioInput.value === "" || exponseRadioInput.value === "") return "Uzupełnij wszystkie pola formularzy.";
		else if (parseFloat(valueInput.value) <= 0) return "Kwota musi być większa od 0 złotych.";
		else return "poprawne dane";
	};

	if (vaildateForm() === "poprawne dane") {
		if (add) {
			sendRecordToDataBase(nameInput.value, parseFloat(valueInput.value), new Date(dateInput.value).toLocaleDateString(), incomeRadioInput.checked);
		} else {
			const buttonID = event.currentTarget.id.replace("change", "");
			switchData(buttonID, nameInput.value, parseFloat(valueInput.value), new Date(dateInput.value).toLocaleDateString(), incomeRadioInput.checked);
			setTimeout(deleteForm, 1);
		}
		deleteForm();

		const lastSlash = location.href.lastIndexOf("/");
		if (location.href == `${location.href.substring(0, lastSlash)}/home.html`) {
			setTimeout(showList, 1);
			setTimeout(updateBar, 1);
		} else if (location.href == `${location.href.substring(0, lastSlash)}/calendar.html`) {
			setTimeout(printMonthInCalendar, 1);
		}
	} else {
		const warningParagraph = document.querySelector(".warning");
		warningParagraph.textContent = vaildateForm();
	}
};

export const addEventListenerToAddRecordButton = () => {
	const form = document.querySelector(".template-add-record-form").content.cloneNode(true).querySelector("div");

	const addFormButton = document.querySelector(".addFormButton");

	addFormButton.addEventListener("click", () => {
		document.body.appendChild(form);
		const dateInput = document.querySelector("#date");
		const today = new Date().toISOString().slice(0, 10);
		dateInput.value = today;

		const closeFormButton = document.querySelector(".close");
		closeFormButton.addEventListener("click", deleteForm);
		const addRecordButton = document.querySelector(".add-record .add");
		addRecordButton.addEventListener("click", checkFormAndAddOrSwitchData);
	});
};
