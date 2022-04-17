import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { getDatabase, ref, onValue, set, update, remove } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { showList } from "./home/showList.js";
import { updateBar } from "./home/updateBarAndGoal.js";
import { checkFormAndAddOrSwitchData } from "./addOrSwitchNewRecord.js";

const firebaseConfig = {
	apiKey: "AIzaSyCbRKB718_nZu1QtSRsrUPEH-NjXMDeQZ0",
	authDomain: "budget-app-502e6.firebaseapp.com",
	projectId: "budget-app-502e6",
	storageBucket: "budget-app-502e6.appspot.com",
	messagingSenderId: "262068234051",
	appId: "1:262068234051:web:301ef42c3e1b7acea571f6",
	measurementId: "G-BWCCBTR9TV",
	databaseURL: "https://budget-app-502e6-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);

export const getUserData = () => {
	const getLogInUser = () => {
		return new Promise(resolve => {
			const auth = getAuth();
			onAuthStateChanged(auth, user => {
				if (user !== null) return resolve(user);
				else return resolve(undefined);
			});
		});
	};

	return new Promise(resolve => {
		getLogInUser().then(user => {
			if (user != undefined) {
				const db = getDatabase();
				const starCountRef = ref(db, `users/${user.uid}`);
				onValue(starCountRef, snapshot => {
					const data = snapshot.val();
					return resolve(data);
				});
			} else {
				return resolve(undefined);
			}
		});
	});
};

export const sendRecordToDataBase = (name, value, date, income) => {
	getUserData().then(userData => {
		const db = getDatabase();

		const getRecordsLength = () => {
			return new Promise(resolve => {
				const starCountRef = ref(db, `users/${userData.userID}/records`);
				onValue(starCountRef, snapshot => {
					const data = snapshot.val();
					if (data === null) return resolve(0);
					else {
						const maxValue = Math.max(...Object.keys(data));
						return resolve(maxValue + 1);
					}
				});
			});
		};

		getRecordsLength().then(length => {
			set(ref(db, `/users/${userData.userID}/records/${length}`), {
				name: name,
				value: value,
				date: date,
				income: income,
			});
		});
	});
};

export const getUserRecords = () => {
	return new Promise(resolve => {
		getUserData().then(userData => {
			const db = getDatabase();
			const starCountRef = ref(db, `users/${userData.userID}/records`);
			onValue(starCountRef, snapshot => {
				const data = snapshot.val();
				if (data) return resolve(data);
				else return resolve(null);
			});
		});
	});
};

export const getUserGoals = () => {
	return new Promise(resolve => {
		getUserData().then(userData => {
			const db = getDatabase();
			const starCountRef = ref(db, `users/${userData.userID}`);
			onValue(starCountRef, snapshot => {
				const data = snapshot.val();
				const goals = {
					incomeGoal: data.incomeGoal,
					expenseGoal: data.expenseGoal,
				};
				return resolve(goals);
			});
		});
	});
};

export const updateGoals = (newIncomeGoal, newExpenseGoal) => {
	getUserData().then(userData => {
		const db = getDatabase();
		const updates = {};
		updates[`users/${userData.userID}/expenseGoal`] = newExpenseGoal;
		updates[`users/${userData.userID}/incomeGoal`] = newIncomeGoal;
		update(ref(db), updates);
	});
};

export const addEventListenerToLogOutButton = () => {
	const logOutUser = () => {
		const auth = getAuth();
		signOut(auth)
			.then(() => {
				const lastSlash = location.href.lastIndexOf("/");
				location.href = `${location.href.substring(0, lastSlash)}/index.html`;
			})
			.catch(error => {
				console.log(error);
			});
	};
	const logOutButton = document.querySelector(".logOut");
	logOutButton.addEventListener("click", logOutUser);
};

export const addEventListenerToDeleteButtons = () => {
	getUserData().then(userData => {
		const deleteButtons = document.querySelectorAll(".delete");

		deleteButtons.forEach(button => {
			button.addEventListener("click", () => {
				const db = getDatabase();
				remove(ref(db, `/users/${userData.userID}/records/${button.id}`));
				showList();
				updateBar();
			});
		});
	});
};

const showForm = event => {
	getUserData().then(userData => {
		const db = getDatabase();
		const starCountRef = ref(db, `users/${userData.userID}/records/${event.currentTarget.buttonID.replace("change", "")}`);
		onValue(starCountRef, snapshot => {
			const record = snapshot.val();

			const deleteForm = () => {
				document.querySelector(".form-template").remove();
			};
			const form = document.querySelector(".template-add-record-form").content.cloneNode(true).querySelector("div");
			document.body.appendChild(form);

			const nameInput = document.querySelector("#name");
			nameInput.value = record.name;

			const valueInput = document.querySelector("#value");
			valueInput.value = record.value;

			const dateInput = document.querySelector("#date");
			const dayMonthYearArray = record.date.split(".");
			const date = new Date(dayMonthYearArray[2], dayMonthYearArray[1] - 1, dayMonthYearArray[0]).toISOString().slice(0, 10);
			dateInput.value = date;

			if (record.income) {
				document.querySelector("#income").checked = true;
			} else {
				document.querySelector("#expense").checked = true;
			}

			const closeFormButton = document.querySelector(".close");
			closeFormButton.addEventListener("click", deleteForm);
		});
		const switchRecordButton = document.querySelector(".add-record .add");
		switchRecordButton.textContent = "Zmień";
		switchRecordButton.id = event.currentTarget.buttonID;
		switchRecordButton.switch = true;
		switchRecordButton.addEventListener("click", checkFormAndAddOrSwitchData);
	});
};

export const switchData = (buttonID, newName, newValue, newDate, newIsIncome) => {
	getUserData().then(userData => {
		const db = getDatabase();
		const updates = {};
		updates[`users/${userData.userID}/records/${buttonID}/name`] = newName;
		updates[`users/${userData.userID}/records/${buttonID}/value`] = newValue;
		updates[`users/${userData.userID}/records/${buttonID}/date`] = newDate;
		updates[`users/${userData.userID}/records/${buttonID}/income`] = newIsIncome;
		update(ref(db), updates);
	});
};

export const addEventListenerToSwitchButtons = () => {
	const switchButtons = document.querySelectorAll(".switch");

	switchButtons.forEach(button => {
		button.addEventListener("click", showForm);
		button.buttonID = button.id;
	});
};
