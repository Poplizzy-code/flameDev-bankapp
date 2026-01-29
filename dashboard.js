const dashboard = document.getElementById("dashboard");
const balanceEl = document.getElementById("balance");
const userNameEl = document.getElementById("userName");
const accountNoEl = document.getElementById("accountNo");

let balance = 0;
let currentUser = null;

// Load user data on page load
function loadUserData() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  
  if (!loggedInUser) {
    window.location.href = "login.html";
    return;
  }
  
  currentUser = loggedInUser;
  balance = currentUser.balance || 0;
  
  // Update UI
  userNameEl.textContent = currentUser.fullName;
  accountNoEl.textContent = currentUser.accountNumber;
  updateBalanceDisplay();
  
  // Load transactions if they exist
  if (currentUser.transactions && currentUser.transactions.length > 0) {
    transactions = currentUser.transactions;
    updateRecentTransactions();
  }
}

// Save user data to localStorage
function saveUserData() {
  currentUser.balance = balance;
  currentUser.transactions = transactions;
  
  // Update in bankUsers array
  let users = JSON.parse(localStorage.getItem("bankUsers")) || [];
  const userIndex = users.findIndex(u => u.accountNumber === currentUser.accountNumber);
  
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
    localStorage.setItem("bankUsers", JSON.stringify(users));
  }
  
  // Update loggedInUser
  localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
}

// Verify PIN function
function verifyPin(enteredPin) {
  return enteredPin === currentUser.password;
}

// Utility
function show(section) {
  document.querySelectorAll("body > div").forEach(div => {
    if (div.id !== "dashboard") div.classList.add("hidden");
  });
  dashboard.classList.add("hidden");
  section.classList.remove("hidden");
}

function backToDashboard() {
  document.querySelectorAll("body > div").forEach(div => div.classList.add("hidden"));
  dashboard.classList.remove("hidden");
}

function updateBalanceDisplay() {
  balanceEl.textContent = `₦${balance.toLocaleString()}`;
}


// ================= DEPOSIT =================
deposit.addEventListener("click", () => show(depositForm));

depositNext.addEventListener("click", () => {
  const amt = Number(depositAmt.value);
  if (!amt || amt <= 0) return alert("Enter valid amount");
  depositForm.classList.add("hidden");
  depositPin.classList.remove("hidden");
});

// Deposit PIN
let depositPinValue = "";
document.querySelectorAll("#depositPin .pin-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    depositPinValue += btn.textContent;
    depositPinDisplay.value = depositPinValue;
  });
});

clearDepositPin.onclick = () => {
  depositPinValue = "";
  depositPinDisplay.value = "";
};

deleteDepositPin.onclick = () => {
  depositPinValue = depositPinValue.slice(0, -1);
  depositPinDisplay.value = depositPinValue;
};

confirmDepositBtn.onclick = () => {
  if (!verifyPin(depositPinValue)) {
    alert("Incorrect PIN");
    depositPinValue = "";
    depositPinDisplay.value = "";
    return;
  }
  
  const amt = Number(depositAmt.value);
  balance += amt;
  updateBalanceDisplay();
  addTransaction("Deposit", amt);
  saveUserData();
  
  alert("Deposit Successful");
  depositPinValue = "";
  depositPinDisplay.value = "";
  depositAmt.value = "";
  backToDashboard();
};


// ================= FLAMEDEV TRANSFER =================
depositFlameDevBtn.addEventListener("click", () => show(depositFlameDevForm));

depositFlameDevNext.addEventListener("click", () => {
  if (!flameDevAccNo.value || !flameDevDepositAmt.value) return alert("Fields cannot be empty");
  
  const amt = Number(flameDevDepositAmt.value);
  if (amt > balance) return alert("Insufficient funds");
  
  depositFlameDevForm.classList.add("hidden");
  depositFlameDevPin.classList.remove("hidden");
});

let flamePin = "";
document.querySelectorAll("#depositFlameDevPin .flame-pin-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    flamePin += btn.textContent;
    depositFlamePinDisplay.value = flamePin;
  });
});

clearFlamePin.onclick = () => {
  flamePin = "";
  depositFlamePinDisplay.value = "";
};

deleteFlamePin.onclick = () => {
  flamePin = flamePin.slice(0, -1);
  depositFlamePinDisplay.value = flamePin;
};

confirmFlameDevBtn.onclick = () => {
  if (!verifyPin(flamePin)) {
    alert("Incorrect PIN");
    flamePin = "";
    depositFlamePinDisplay.value = "";
    return;
  }
  
  const amt = Number(flameDevDepositAmt.value);
  balance -= amt;
  updateBalanceDisplay();
  addTransaction(`Transfer to ${flameDevAccNo.value}`, -amt);
  saveUserData();
  
  alert("Transfer Successful");
  flamePin = "";
  depositFlamePinDisplay.value = "";
  flameDevAccNo.value = "";
  flameDevDepositAmt.value = "";
  backToDashboard();
};

// ================= WITHDRAW =================
withdrawBtn.addEventListener("click", () => show(withdrawForm));

withdrawNext.addEventListener("click", () => {
  const amt = Number(withdrawAmt.value);
  if (!amt || amt <= 0) return alert("Enter valid amount");
  if (amt > balance) return alert("Insufficient funds");
  withdrawForm.classList.add("hidden");
  withdrawPin.classList.remove("hidden");
});

// Withdraw PIN
let withdrawPinValue = "";
document.querySelectorAll("#withdrawPin .withdraw-pin-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    withdrawPinValue += btn.textContent;
    withdrawPinDisplay.value = withdrawPinValue;
  });
});

withdrawFlamePin.onclick = () => {
  withdrawPinValue = "";
  withdrawPinDisplay.value = "";
};

deleteWithdrawPin.onclick = () => {
  withdrawPinValue = withdrawPinValue.slice(0, -1);
  withdrawPinDisplay.value = withdrawPinValue;
};

confirmWithdrawBtn.onclick = () => {
  if (!verifyPin(withdrawPinValue)) {
    alert("Incorrect PIN");
    withdrawPinValue = "";
    withdrawPinDisplay.value = "";
    return;
  }
  
  const amt = Number(withdrawAmt.value);
  balance -= amt;
  updateBalanceDisplay();
  addTransaction("Withdraw", -amt);
  saveUserData();
  
  alert("Withdrawal Successful");
  
  // Reset
  withdrawPinValue = "";
  withdrawPinDisplay.value = "";
  withdrawAmt.value = "";
  backToDashboard();
};

// ================= AIRTIME =================
const airtimeForm = document.getElementById("airtimeForm");
const airtimePhone = document.getElementById("airtimePhone");
const airtimeAmt = document.getElementById("airtimeAmt");
const airtimeNetwork = document.getElementById("airtimeNetwork");
const airtimeNext = document.getElementById("airtimeNext");
const airtimePin = document.getElementById("airtimePin");
const airtimePinDisplay = document.getElementById("airtimePinDisplay");
const clearAirtimePin = document.getElementById("clearAirtimePin");
const deleteAirtimePin = document.getElementById("deleteAirtimePin");
const confirmAirtimeBtn = document.getElementById("confirmAirtimeBtn");
const airtimeBtn = document.getElementById("airtimeBtn");

airtimeBtn.addEventListener("click", () => show(airtimeForm));

airtimeNext.addEventListener("click", () => {
  const phone = airtimePhone.value;
  const amt = Number(airtimeAmt.value);
  const network = airtimeNetwork.value;
  
  if (!phone || !amt || !network) return alert("Please fill all fields");
  if (amt <= 0) return alert("Enter valid amount");
  if (amt > balance) return alert("Insufficient funds");
  
  airtimeForm.classList.add("hidden");
  airtimePin.classList.remove("hidden");
});

// Airtime PIN
let airtimePinValue = "";
document.querySelectorAll("#airtimePin .airtime-pin-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    airtimePinValue += btn.textContent;
    airtimePinDisplay.value = airtimePinValue;
  });
});

clearAirtimePin.onclick = () => {
  airtimePinValue = "";
  airtimePinDisplay.value = "";
};

deleteAirtimePin.onclick = () => {
  airtimePinValue = airtimePinValue.slice(0, -1);
  airtimePinDisplay.value = airtimePinValue;
};

confirmAirtimeBtn.onclick = () => {
  if (!verifyPin(airtimePinValue)) {
    alert("Incorrect PIN");
    airtimePinValue = "";
    airtimePinDisplay.value = "";
    return;
  }
  
  const amt = Number(airtimeAmt.value);
  balance -= amt;
  updateBalanceDisplay();
  addTransaction(`Airtime - ${airtimeNetwork.value}`, -amt);
  saveUserData();
  
  alert("Airtime Purchase Successful");
  
  // Reset
  airtimePinValue = "";
  airtimePinDisplay.value = "";
  airtimePhone.value = "";
  airtimeAmt.value = "";
  airtimeNetwork.value = "";
  backToDashboard();
};


// ================= DATA =================
const dataForm = document.getElementById("dataForm");
const dataPhone = document.getElementById("dataPhone");
const dataPlan = document.getElementById("dataPlan");
const dataNetwork = document.getElementById("dataNetwork");
const dataNext = document.getElementById("dataNext");
const dataPin = document.getElementById("dataPin");
const dataPinDisplay = document.getElementById("dataPinDisplay");
const clearDataPin = document.getElementById("clearDataPin");
const deleteDataPin = document.getElementById("deleteDataPin");
const confirmDataBtn = document.getElementById("confirmDataBtn");
const dataBtn = document.getElementById("dataBtn");

dataBtn.addEventListener("click", () => show(dataForm));

dataNext.addEventListener("click", () => {
  const phone = dataPhone.value;
  const plan = dataPlan.value;
  const network = dataNetwork.value;
  
  if (!phone || !plan || !network) return alert("Please fill all fields");
  
  const amt = Number(plan.split("-")[1]);
  if (amt > balance) return alert("Insufficient funds");
  
  dataForm.classList.add("hidden");
  dataPin.classList.remove("hidden");
});

// Data PIN
let dataPinValue = "";
document.querySelectorAll("#dataPin .data-pin-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    dataPinValue += btn.textContent;
    dataPinDisplay.value = dataPinValue;
  });
});

clearDataPin.onclick = () => {
  dataPinValue = "";
  dataPinDisplay.value = "";
};

deleteDataPin.onclick = () => {
  dataPinValue = dataPinValue.slice(0, -1);
  dataPinDisplay.value = dataPinValue;
};

confirmDataBtn.onclick = () => {
  if (!verifyPin(dataPinValue)) {
    alert("Incorrect PIN");
    dataPinValue = "";
    dataPinDisplay.value = "";
    return;
  }
  
  const plan = dataPlan.value.split("-");
  const amt = Number(plan[1]);
  balance -= amt;
  updateBalanceDisplay();
  addTransaction(`Data - ${plan[0]}`, -amt);
  saveUserData();
  
  alert("Data Purchase Successful");
  
  // Reset
  dataPinValue = "";
  dataPinDisplay.value = "";
  dataPhone.value = "";
  dataPlan.value = "";
  dataNetwork.value = "";
  backToDashboard();
};


// ================= OTHER BILLS =================
const billsForm = document.getElementById("billsForm");
const billType = document.getElementById("billType");
const billCustomerId = document.getElementById("billCustomerId");
const billAmt = document.getElementById("billAmt");
const billsNext = document.getElementById("billsNext");
const billsPin = document.getElementById("billsPin");
const billsPinDisplay = document.getElementById("billsPinDisplay");
const clearBillsPin = document.getElementById("clearBillsPin");
const deleteBillsPin = document.getElementById("deleteBillsPin");
const confirmBillsBtn = document.getElementById("confirmBillsBtn");
const billsBtn = document.getElementById("billsBtn");

billsBtn.addEventListener("click", () => show(billsForm));

billsNext.addEventListener("click", () => {
  const type = billType.value;
  const customerId = billCustomerId.value;
  const amt = Number(billAmt.value);
  
  if (!type || !customerId || !amt) return alert("Please fill all fields");
  if (amt <= 0) return alert("Enter valid amount");
  if (amt > balance) return alert("Insufficient funds");
  
  billsForm.classList.add("hidden");
  billsPin.classList.remove("hidden");
});

// Bills PIN
let billsPinValue = "";
document.querySelectorAll("#billsPin .bills-pin-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    billsPinValue += btn.textContent;
    billsPinDisplay.value = billsPinValue;
  });
});

clearBillsPin.onclick = () => {
  billsPinValue = "";
  billsPinDisplay.value = "";
};

deleteBillsPin.onclick = () => {
  billsPinValue = billsPinValue.slice(0, -1);
  billsPinDisplay.value = billsPinValue;
};

confirmBillsBtn.onclick = () => {
  if (!verifyPin(billsPinValue)) {
    alert("Incorrect PIN");
    billsPinValue = "";
    billsPinDisplay.value = "";
    return;
  }
  
  const amt = Number(billAmt.value);
  const type = billType.value;
  balance -= amt;
  updateBalanceDisplay();
  addTransaction(`Bill Payment - ${type}`, -amt);
  saveUserData();
  
  alert("Bill Payment Successful");
  
  // Reset
  billsPinValue = "";
  billsPinDisplay.value = "";
  billType.value = "";
  billCustomerId.value = "";
  billAmt.value = "";
  backToDashboard();
};


// ================= TRANSACTION HISTORY =================
const transactionHistory = document.getElementById("transactionHistory");
const transactionsBtn = document.getElementById("transactionsBtn");

let transactions = [];

function addTransaction(description, amount) {
  const transaction = {
    description,
    amount,
    date: new Date().toLocaleString()
  };
  transactions.unshift(transaction);
  updateRecentTransactions();
}

function updateRecentTransactions() {
  const recentList = document.querySelector("#dashboard .divide-y");
  recentList.innerHTML = "";
  
  transactions.slice(0, 3).forEach(txn => {
    const li = document.createElement("li");
    li.className = "py-2 flex justify-between";
    li.innerHTML = `
      <span>${txn.description}</span>
      <span class="font-medium ${txn.amount >= 0 ? 'text-green-500' : 'text-red-500'}">
        ${txn.amount >= 0 ? '+' : ''}₦${Math.abs(txn.amount).toLocaleString()}
      </span>
    `;
    recentList.appendChild(li);
  });
}

function showAllTransactions() {
  const txnList = document.getElementById("transactionList");
  txnList.innerHTML = "";
  
  if (transactions.length === 0) {
    txnList.innerHTML = '<li class="py-4 text-center text-gray-500">No transactions yet</li>';
    return;
  }
  
  transactions.forEach(txn => {
    const li = document.createElement("li");
    li.className = "py-3 flex justify-between border-b border-gray-200";
    li.innerHTML = `
      <div>
        <span class="text-gray-700">${txn.description}</span>
        <p class="text-xs text-gray-400">${txn.date}</p>
      </div>
      <span class="font-semibold ${txn.amount >= 0 ? 'text-green-500' : 'text-red-500'}">
        ${txn.amount >= 0 ? '+' : ''}₦${Math.abs(txn.amount).toLocaleString()}
      </span>
    `;
    txnList.appendChild(li);
  });
}

transactionsBtn.addEventListener("click", () => {
  showAllTransactions();
  show(transactionHistory);
});

const backToDashboardBtn = document.getElementById("backToDashboardBtn");
if (backToDashboardBtn) {
  backToDashboardBtn.addEventListener("click", backToDashboard);
}

// Load user data when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadUserData();
});