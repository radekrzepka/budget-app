import { getUserRecords } from "../firebaseService.js";

const daysInMonth = (month, year) => {
	return new Date(year, month, 0).getDate();
};

const whatClassToDay = numberOfDay => {
	switch (numberOfDay) {
		case 0:
			return "sunday";
			break;
		case 1:
			return "monday";
			break;
		case 2:
			return "tuesday";
			break;
		case 3:
			return "wendsday";
			break;
		case 4:
			return "thursday";
			break;
		case 5:
			return "friday";
			break;
		case 6:
			return "saturday";
			break;
	}
};

export const printMonthInCalendar = (
	month = new Date().getMonth() + 1,
	year = new Date().getFullYear()
) => {
	getUserRecords().then(records => {
		const calendar = document.querySelector(".calendar");
		calendar.innerHTML =
			"<div class='weekday-name'>pon</div><div class='weekday-name'>wto</div><div class='weekday-name'>śro</div><div class='weekday-name'>czw</div><div class='weekday-name'>pią</div><div class='weekday-name'>sob</div><div class='weekday-name'>nie</div>";

		for (let i = 1; i <= daysInMonth(month, year); i++) {
			const div = document.createElement("div");

			const date = new Date(year, month - 1, i);
			div.classList.add(whatClassToDay(date.getDay()));
			div.textContent = i;
			div.id = `${month}/${i}/${year}`;

			console.log(records);

			if (records !== null) {
				if (records.some(record => record.date === div.id)) {
					const thisDayRecords = records.filter(
						record => record.date === div.id
					);
					if (
						thisDayRecords.some(record => record.income) &&
						thisDayRecords.some(record => !record.income)
					)
						div.classList.add("income-expense-record");
					else if (thisDayRecords.some(record => record.income))
						div.classList.add("income-record");
					else div.classList.add("expense-record");
				}
			}
			const printRecords = () => {
				const recordsContainer = document.querySelector(".records-container");
				const thisDayRecords = records.filter(record => record.date === div.id);
				recordsContainer.innerHTML = "";
				thisDayRecords.forEach(record => {
					recordsContainer.innerHTML += `
                        <div class="record ${
													record.income ? "record-income" : "record-expense"
												}">
                            <span>${record.name}</span>
                            <span>${
															Number.isInteger(record.value)
																? record.value + ".00"
																: record.value
														} zł</span>
                            <span>${record.date}</span>
                        </div>
                    `;
				});
			};
			div.addEventListener("click", printRecords);
			calendar.appendChild(div);
		}
	});
};
