import { addEventListenerToAddRecordButton } from "../addOrSwitchNewRecord.js";
import {
	getUserData,
	addEventListenerToLogOutButton,
} from "../firebaseService.js";

getUserData().then(user => {
	const lastSlash = location.href.lastIndexOf("/");
	if (user == undefined)
		location.href = `${location.href.substring(0, lastSlash)}/index.html`;
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

const generatePolishMonths = year => {
	const arr = [];
	for (let i = 1; i <= 12; i++) {
		arr.push(`${polishMonthName(i)} ${year}`);
	}
	return arr;
};

const generateDataToCharts = year => {
	return new Promise(resolve => {
		getUserData().then(data => {
			const convertedDates = [];
			if (data !== null) {
				for (const record of Object.keys(data.records)) {
					convertedDates.push(data.records[record]);
				}
			}
			console.log(convertedDates);

			const dataFromGivenYear = convertedDates.filter(record => {
				const recordYear = record.date.split(".")[2];
				return year == recordYear;
			});
			const incomes = [];
			const expenses = [];
			for (let i = 1; i <= 12; i++) {
				let monthIncome = 0;
				let monthExpenses = 0;
				let month = i;
				let dataFromGivenMonth = dataFromGivenYear.filter(record => {
					return month == record.date.split(".")[1];
				});
				dataFromGivenMonth.forEach(record => {
					if (record.income) {
						monthIncome += record.value;
					} else {
						monthExpenses += record.value;
					}
				});
				incomes.push(monthIncome);
				expenses.push(monthExpenses);
			}
			resolve([incomes, expenses]);
		});
	});
};

const generateChart = year => {
	return new Promise(resolve => {
		generateDataToCharts(year).then(data => {
			const ctx = document.querySelector("#chart").getContext("2d");
			const myChart = new Chart(ctx, {
				type: "line",
				data: {
					labels: generatePolishMonths(year),
					datasets: [
						{
							label: "Przychody",
							data: data[0],
							borderColor: ["rgb(0, 102, 0)"],
							backgroundColor: ["rgb(0, 102, 0)"],
							borderWidth: 1,
						},
						{
							label: "Wydatki",
							data: data[1],
							borderColor: ["rgb(153, 0, 0)"],
							backgroundColor: ["rgb(153, 0, 0)"],
							borderWidth: 1,
						},
					],
				},
			});
			resolve(myChart);
		});
	});
};

let oldChart = generateChart(new Date().getFullYear()).then(chart => chart);

const yearInput = document.querySelector(".switchYearChart");
yearInput.addEventListener("blur", () => {
	const year = yearInput.value;
	oldChart.then(chart => chart.destroy());
	oldChart = generateChart(year).then(chart => chart);
});
