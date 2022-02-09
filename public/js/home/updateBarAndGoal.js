import { getUserRecords, getUserGoals, updateGoals } from "../firebaseService.js";

export const updateBar = () => {
	getUserRecords().then(records => {
		let incomesPrice = 0;
		let expensesPrice = 0;
		if (records) {
			const recordsArray = [];
			Object.keys(records).forEach(key => {
				recordsArray[key] = records[key];
			});
			recordsArray
				.filter(record => record.income)
				.forEach(income => {
					incomesPrice += parseFloat(income.value);
				});

			recordsArray
				.filter(record => !record.income)
				.forEach(expenses => {
					expensesPrice += parseFloat(expenses.value);
				});
		}

		getUserGoals().then(goals => {
			const incomesBar = document.querySelector(".incomes-bar");
			const incomesBarPriceSpan = document.querySelector(".incomes-bar-price");

			incomesBarPriceSpan.textContent = `${Number.isInteger(incomesPrice) ? incomesPrice + ".00" : incomesPrice} zł`;
			const incomesProcent = goals.incomeGoal === 0 ? 100 : (incomesPrice / goals.incomeGoal) * 100;
			incomesBar.style.background = `linear-gradient(90deg, rgb(43, 190, 249) 0%, rgb(43, 190, 249) ${incomesProcent}%, rgb(214, 214, 214) ${incomesProcent}%)`;
			const incomesGoalParagraph = document.querySelector(".incomes-goal");
			incomesGoalParagraph.textContent = `Ustalony cel: ${Number.isInteger(goals.incomeGoal) ? goals.incomeGoal + ".00" : goals.incomeGoal} zł`;

			const expensesBar = document.querySelector(".expenses-bar");
			const expensesBarPriceSpan = document.querySelector(".expenses-bar-price");

			expensesBarPriceSpan.textContent = `${Number.isInteger(expensesPrice) ? expensesPrice + ".00" : expensesPrice} zł`;
			const expensesProcent = goals.expenseGoal === 0 ? 100 : (expensesPrice / goals.expenseGoal) * 100;
			expensesBar.style.background = `linear-gradient(90deg, rgb(255, 101, 129) 0%, rgb(255, 101, 129) ${expensesProcent}%, rgb(214, 214, 214) ${expensesProcent}%)`;
			const expensesGoalParagraph = document.querySelector(".expenses-goal");
			expensesGoalParagraph.textContent = `Ustalony cel: ${Number.isInteger(goals.expenseGoal) ? goals.expenseGoal + ".00" : goals.expenseGoal} zł`;

			const savingsPriceParagraph = document.querySelector(".savings-price");
			savingsPriceParagraph.textContent = `${Number.isInteger(incomesPrice - expensesPrice) ? incomesPrice - expensesPrice + ".00" : incomesPrice - expensesPrice} zł`;
		});
	});
};

export const addEventListenerToSwitchGoalButton = () => {
	const switchGoalButton = document.querySelector(".switch-goal");
	const form = document.querySelector(".template-switch-goal").content.cloneNode(true).querySelector("div");

	const deleteForm = () => {
		document.querySelector(".form-template").remove();
	};

	switchGoalButton.addEventListener("click", () => {
		document.body.appendChild(form);

		const incomeGoalInput = document.querySelector("#income-goal");
		const expenseGoalInput = document.querySelector("#expense-goal");
		const switchSettingsButton = document.querySelector(".switch-goal-form");

		const validateForm = () => {
			if (incomeGoalInput.value === "" || expenseGoalInput.value === "") return "Wszystkie pola musza byc uzupelnione.";
			else if (incomeGoalInput.value <= 0 || expenseGoalInput.value <= 0) return "Wartosci musza byc wieksze od 0.";
			else return "poprawne dane";
		};

		const closeButton = document.querySelector(".close");
		closeButton.addEventListener("click", deleteForm);

		switchSettingsButton.addEventListener("click", () => {
			if (validateForm() === "poprawne dane") {
				updateGoals(parseFloat(incomeGoalInput.value), parseFloat(expenseGoalInput.value));
				updateBar();
				deleteForm();
			} else {
				document.querySelector(".warning").textContent = validateForm();
			}
		});
	});
};
