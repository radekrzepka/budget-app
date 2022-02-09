import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { getUserData } from "../firebaseService.js";

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

getUserData().then(user => {
	if (user) {
		const lastSlash = location.href.lastIndexOf("/");
		location.href = `${location.href.substring(0, lastSlash)}/home.html`;
	}
});

const resetAllParagraphs = () => {
	const allParagraphs = document.querySelectorAll("p");
	allParagraphs.forEach(paragraph => {
		paragraph.textContent = "";
	});
};

const loginButton = document.querySelector(".button-login");
const loginInputs = document.querySelectorAll(".login-input");

const logIn = () => {
	const auth = getAuth();

	const email = document.querySelector("#e-mail-login").value;
	const password = document.querySelector("#password-login").value;
	const warningLoginParagraph = document.querySelector(".warning-login");

	signInWithEmailAndPassword(auth, email, password)
		.then(() => {
			const lastSlash = location.href.lastIndexOf("/");
			location.href = `${location.href.substring(0, lastSlash)}/home.html`;
		})
		.catch(() => {
			resetAllParagraphs();
			warningLoginParagraph.textContent = "Nieprawidłowy email lub hasło";
		});
};

loginButton.addEventListener("click", logIn);
loginInputs.forEach(input => {
	input.addEventListener("keydown", event => {
		if (event.code == "Enter") logIn();
	});
});

const addNewUserToDatabase = (userID, email) => {
	const db = getDatabase();

	set(ref(db, `/users/${userID}`), {
		userID: userID,
		email: email,
		expenseGoal: 0,
		incomeGoal: 0,
	});
};

const registerButton = document.querySelector(".button-register");
const registerInputs = document.querySelectorAll(".register-input");

const registerAccount = () => {
	const auth = getAuth();

	const email = document.querySelector("#e-mail-register").value;
	const password = document.querySelector("#password-register").value;
	const passwordAgain = document.querySelector("#password-again-register").value;
	const warningRegisterParagraph = document.querySelector(".warning-register");
	const successRegisterParagraph = document.querySelector(".success-register");

	const validateEmail = email => {
		const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(email);
	};

	const validateForm = () => {
		if (password === "" || password === "" || passwordAgain === "") return "Uzupełnij wszystkie pola formularza.";
		else if (!validateEmail(email)) return "Podaj poprawny adres e-mail";
		else if (password !== passwordAgain) return "Hasła rożnią się od siebie.";
		else if (password.length < 6) return "Hasło powinno mieć przynajmniej 6 znaków";
		else return "poprawne dane";
	};

	if (validateForm() === "poprawne dane") {
		createUserWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				const user = userCredential.user;
				console.log(user);
				resetAllParagraphs();
				successRegisterParagraph.textContent = "Udało ci się stworzyć konto, teraz możesz się zalogować";
				document.querySelector("#e-mail-register").value = "";
				document.querySelector("#password-register").value = "";
				document.querySelector("#password-again-register").value = "";
				addNewUserToDatabase(user.uid, user.email);
			})
			.catch(error => {
				resetAllParagraphs();
				warningRegisterParagraph.textContent = "Konto o podanym adresie e-mail już istnieje.";
			});
	} else {
		resetAllParagraphs();
		warningRegisterParagraph.textContent = validateForm();
	}
};

registerButton.addEventListener("click", registerAccount);
registerInputs.forEach(input => {
	input.addEventListener("keydown", event => {
		if (event.code == "Enter") registerAccount();
	});
});
