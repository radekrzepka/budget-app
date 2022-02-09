import { addEventListenerToDeleteButtons, getUserRecords, addEventListenerToSwitchButtons } from "../firebaseService.js";

export const showList = () => {
	getUserRecords().then(records => {
		const incomesContainer = document.querySelector(".incomes");
		const expensesContainer = document.querySelector(".expenses");

		incomesContainer.innerHTML = "<h2>Przychodzy</h2>";
		expensesContainer.innerHTML = "<h2>Wydatki</h2>";

		if (records) {
			const recordsArray = [];
			Object.keys(records).forEach(key => {
				recordsArray[key] = records[key];
			});

			recordsArray.forEach((record, index) => {
				record.index = index;
			});
			const incomes = recordsArray.filter(record => record.income);
			const expenses = recordsArray.filter(record => !record.income);

			incomes.forEach(income => {
				incomesContainer.innerHTML += `
						<div class="income">
							<span>${income.name}</span>
							<span>${Number.isInteger(income.value) ? income.value + ".00" : income.value} zł </span>
							<span>${income.date}</span>
							<div>
								<svg class='switch' id=change${income.index} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
								<svg class='delete' id=${income.index} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
							</div>
						</div>
					`;
			});

			expenses.forEach(expense => {
				expensesContainer.innerHTML += `
						<div class="expense">
							<span>${expense.name}</span>
							<span>${Number.isInteger(expense.value) ? expense.value + ".00" : expense.value} zł </span>
							<span>${expense.date}</span>
							<div> 
								<svg class='switch' id=change${expense.index} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
								<svg class='delete' id=${expense.index} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
							</div>
						</div>
					`;
			});
			setTimeout(addEventListenerToDeleteButtons, 1);
			setTimeout(addEventListenerToSwitchButtons, 1);
		}
	});
};
