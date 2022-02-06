'use strict';

// Data
const account1 = {
  owner: 'Willie Whitfield',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, -345, -20, 1768],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Luna Wibsey',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Michael Bakari Jordan',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Tal Prephd',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Initialize state for currentAcount's displayed movements
let sorted = false;

//Function Notes - displayMovements
//** Function will expect an array of number values as a parameter
//** Second parameter (sort) will be use to set state of the movements array. If set to true, movements will be displaying from highest to lowest
//1. Clear out inner html of the movements container
//2. Loop through movements array
//3. Declare variable that displays 'withdrawal' or 'deposit' based on if movement is > or < 0.
//4. Declare variable that stores html markup that will be rendered in string format
//5. Use the .insertAdjacentHTML() method and pass the html variable. HTML will be positioned 'afterbegin' so last element in array is rendered at the top of the movements container
const displayMovements = function (movements, sort = false) {
  const sortedMovements = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;
  containerMovements.innerHTML = '';
  sortedMovements.forEach(function (movement, i) {
    const transactionType = movement < 0 ? 'withdrawal' : 'deposit';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
        <div class="movements__value">${movement < 0 ? '- ' : ''}$${Math.abs(
      movement
    ).toFixed(2)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//For each account call the createUserName function and pass account.owner as a parameter.
//This is the equiv to passing account1.owner ('Willie Whitfield)
//accounts.forEach(account => createUserName(account.owner));

//It is a better practice to rewrite the function to receive all of the data as a parameter to improve reusability

//Function Notes - createUserNames
//1. Function now expects an array of strings as a parameter
//2. Loop through the users in the accounts array using forEach method
//3. Create a user name that targets the value from user.owner (string containing the name of the user)
//4. Store user name as a property of the user object

const createUserNames = function (accountsArr) {
  accountsArr.forEach(user => {
    user.userName = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.at(0))
      .join('');
  });
};

createUserNames(accounts);

//Function Notes - displayBalance
//1. Reduce and store the values from account.movements
//2. Use query selector to targe .balance__value
//3. Set .balance__value textContent to the reduced value
const displayBalance = account => {
  const currentBalance = account.movements.reduce(
    (balance, movement) => balance + movement,
    0
  );
  labelBalance.textContent = `$${currentBalance.toFixed(2)}`;
  account.balance = currentBalance;
};

//Function Notes - displaySummary
//1a. Target account.movement and filter array
//1b. Store positive values in deposits var
//1c. Store negative values in withdrawals var
//2. Set labelSumIn text content to deposits
//3. Set labelSumOut text content to withdrawals

const displaySummary = account => {
  const deposits = account.movements.filter(movement => movement > 0);
  const withdrawals = account.movements.filter(movement => movement < 0);
  const interest = deposits
    .map(deposit => deposit * (account.interestRate / 100))
    .filter(deposits => deposits > +1);
  const calcSum = movements => movements.reduce((tot, mov) => tot + mov, 0);
  labelSumIn.textContent = `$${calcSum(deposits).toFixed(2)}`;
  labelSumOut.textContent = `$${Math.abs(calcSum(withdrawals)).toFixed(2)}`;
  labelSumInterest.textContent = `$${calcSum(interest).toFixed(3)}`;
};

//Chaining a lot of methods together can cause performnce issues if working with large arrays
//It is a bad practice to chain methods that mutate the original array. For example, the splice or reverse method.
const updateUI = account => {
  displaySummary(account);
  displayBalance(account);
  displayMovements(account.movements);
};

//The currentAmount variable needs to be declared in the global scope so it can be accessed inside of other functions
let currentAccount;

//EVENT LISTENERS

//On the click of the login button current account will equal the account that has a user name equal to the value of the userName input
//If the inputUserPin value (number format) is equal to the the current account's pin property, then the login is successful
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  //Optional chaining can be used to prevent error message if non-existent username is entere
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Order of events
    //Disply UI & Welcome Message
    containerApp.style.opacity = '100';
    labelWelcome.textContent = `Welcome, ${currentAccount.owner
      .split(' ')
      .at(0)}`;

    sorted = false;
    updateUI(currentAccount);

    //Clear Login Credientials
    inputLoginUsername.value = inputLoginPin.value = ``;
    //Because the assignment operator works from right to left, we can reset the value ot both input fields in one line
    inputLoginPin.blur(); //The blur method removes focus from the input field

    //Start/Restart Lougout Timer
  }
});

//User Transfers Money
//Add event listener to btnTransfer
//Add negative movement to current user
//Add positive movement to recipient
let recepientAccount;
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let transferAmount = +inputTransferAmount.value;
  //currentAccount = account1;
  recepientAccount = accounts.find(
    acct => acct.userName === inputTransferTo.value
  );
  //Run Tests
  //Does recipient account exist?
  //Is the transfer amount greater than 0
  //Is transfer amount less than or equal to the balance?
  //Is the transfer recipient different from the current account?
  if (
    recepientAccount &&
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    recepientAccount?.userName !== currentAccount?.userName
  ) {
    currentAccount.movements.push(-transferAmount);
    recepientAccount.movements.push(transferAmount);
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = ``;
    inputTransferAmount.blur();
  } else {
    alert(`The transfer is invalid and cannot be completed`);
  }
});

//Run Tests to close account
//Is the username entered the same as the current account username?
//Is the pin for the entered username correct?

//Function notes
//1. Check if credentials are correct
//2. Prompt to confirm deletion
//3. Remove currentAccount from data
//4. Hide UI
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const confirmDelete = prompt(
      'Are you sure you would like to delete this account? This action cannot be undone. Yes or No?'
    );

    if (confirmDelete === null) {
      inputCloseUsername.value = inputClosePin.value = '';
      alert('Deletion cancelled: You must enter Yes or No');
      return;
    } else if (confirmDelete.toLowerCase() === 'yes') {
      const deletedAccountIndex = accounts.findIndex(
        account => account === currentAccount
      );
      accounts.splice(deletedAccountIndex, 1);
      containerApp.style.opacity = '0';
      labelWelcome.textContent = `Log in to get started`;
      alert(`Account successfully deleted`);
      console.log(accounts);
    } else {
      inputCloseUsername.value = inputClosePin.value = '';
      return;
    }
  } else alert(`Invalid username and/or pin.`);
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

//Function Notes - User requests loan
//Any deposit > 35% of request?
//If so, add positive value to movements,
//if not, alert user
//If loan amount is less than or equal to 0 OR value is null, send alert

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  let loanAmount = Math.floor(inputLoanAmount.value);
  if (loanAmount === null || loanAmount <= 0)
    alert(`Please enter valid amount.`);
  else if (currentAccount.movements.some(mov => mov >= loanAmount * 0.25)) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
    inputLoanAmount.value = ``;
    inputLoanAmount.blur();
  } else {
    alert(
      `For this loan to be approved, a deposit of at least $${
        loanAmount * 0.25
      } (25% of loan request) must be deposited`
    );
    inputLoanAmount.value = ``;
    inputLoanAmount.blur();
  }
});

//Sorted state defaults to false on user login
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
