function generateAccountNumber() {
  let accNumber;
  let existingUsers = JSON.parse(localStorage.getItem("bankUsers")) || [];

  do {
    const randomPart = Math.floor(10000000 + Math.random() * 90000000);
    accNumber = "25" + randomPart; 
  } while (existingUsers.some(user => user.accountNumber === accNumber));

  return accNumber;
}


class User {
  constructor(
    email,
    password,
    fullName,
    age,
    nationality,
    occupation,
    phone,
    address,
  ) {
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.age = age;
    this.nationality = nationality;
    this.occupation = occupation;
    this.phone = phone;
    this.address = address;
    this.balance = 0;
    this.accountNumber = generateAccountNumber();
    this.transactions = [];
  }

  save() {
    let users = JSON.parse(localStorage.getItem("bankUsers")) || [];
    users.push(this);

    localStorage.setItem("bankUsers", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(this));
  }
}

class SignupForm {
  constructor() {
    this.step1Form = document.getElementById("step1Form");
    this.step2Form = document.getElementById("step2Form");

    if (!this.step1Form || !this.step2Form) return;

    this.step2FormElement = this.step2Form.querySelector("form");

    this.step1Form.addEventListener("submit", (e) => this.handleStep1(e));
    this.step2FormElement.addEventListener("submit", (e) =>
      this.handleStep2(e),
    );
  }

  handleStep1(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    localStorage.setItem("signupEmail", email);
    localStorage.setItem("signupPassword", password);

    this.step1Form.classList.add("hidden");
    this.step2Form.classList.remove("hidden");
  }

  handleStep2(e) {
    e.preventDefault();

    const get = (selector) =>
      this.step2Form.querySelector(selector).value.trim();

    const fullName = get('input[placeholder="John Doe"]');
    const age = get('input[placeholder="25"]');
    const nationality = get('input[placeholder="Nigerian"]');
    const occupation = get('input[placeholder="Software Developer"]');
    const phone = get('input[placeholder="+234 801 234 5678"]');
    const address = get('input[placeholder="123 Main Street"]');
    const password = get('input[placeholder="********"]');
    const confirmPassword = this.step2Form
      .querySelectorAll('input[placeholder="********"]')[1]
      .value.trim();

    if (
      !fullName ||
      !age ||
      !nationality ||
      !occupation ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      alert("Fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const email = localStorage.getItem("signupEmail");

    const user = new User(
      email,
      password,
      fullName,
      age,
      nationality,
      occupation,
      phone,
      address,
    );
    user.save();

    alert(
      `Welcome ${user.fullName}! Signup successful.\nYour account number is ${user.accountNumber}`,
    );

    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SignupForm();
});
