'use strict';

// Data
const account1 = {
  owner: 'Willie Whitfield',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-09-23T07:42:02.383Z',
    '2021-10-11T23:36:17.929Z',
    '2021-11-27T17:01:17.194Z',
    '2021-12-08T14:11:59.604Z',
    '2021-12-16T21:31:17.178Z',
    '2022-02-18T09:15:04.904Z',
    '2022-02-20T10:17:24.185Z',
    '2022-02-21T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Luna Wibsey',
  movements: [5000, 3400, -150, -790, -3210, -1000],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-27T17:01:17.194Z',
    '2021-12-17T14:11:59.604Z',
    '2021-12-25T21:31:17.178Z',
    '2022-01-16T10:17:24.185Z',
    '2022-02-09T09:15:04.904Z',
    '2022-02-11T10:51:36.790Z',
  ],
  currency: 'CAD',
  locale: 'en-CA',
};

const account3 = {
  owner: 'Michael Bakari Jordan',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2021-09-23T07:42:02.383Z',
    '2021-10-11T23:36:17.929Z',
    '2021-11-27T17:01:17.194Z',
    '2021-12-08T14:11:59.604Z',
    '2021-12-18T21:31:17.178Z',
    '2022-02-11T10:17:24.185Z',
    '2022-02-12T09:15:04.904Z',
    '2022-02-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'fr-FR',
};

const account4 = {
  owner: 'Tal Prephd',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
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

//The currentAmount variable needs to be declared in the global scope so it can be accessed inside of other functions
let currentAccount;

//The timer variable needs to be declared in the global scope so it exist between different logins and callback functions
let timer;

//=========
//Functions
//=========

const formatDateLong = date => {
  const options = {
    second: 'numeric',
    minute: 'numeric',
    hour: 'numeric',
    day: '2-digit',
    week: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const formattedDate = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(date);
  return formattedDate;
};

const formatDateShort = date => {
  const formattedDate = new Intl.DateTimeFormat(currentAccount.locale).format(
    date
  );
  return formattedDate;
};

//Function notes
//1. Function takes two date parmmeters
//2. Date objesct will be converted to a  number
//3. Subtract the start from the end
//4. Reduce the difference from number of milliseconds to number of days
const checkDaysPassed = (date1, date2) => {
  const timeDifference = +date1 - +date2;
  return Math.abs(timeDifference) / 1000 / 60 / 60 / 24;
};

//Function Notes - displayMovements
//** Function will expect an array of number values as a parameter
//** Second parameter (sort) will be use to set state of the movements array. If set to true, movements will be displaying from highest to lowest
//1. Clear out inner html of the movements container
//2. Loop through movements array
//3. Declare variable that displays 'withdrawal' or 'deposit' based on if movement is > or < 0.
//4. Declare variable that stores html markup that will be rendered in string format
//5. Use the .insertAdjacentHTML() method and pass the html variable. HTML will be positioned 'afterbegin' so last element in array is rendered at the top of the movements container
const displayMovements = function (account, sort = false) {
  const movements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  containerMovements.innerHTML = '';
  movements.forEach(function (movement, i) {
    const transactionType = movement < 0 ? 'withdrawal' : 'deposit';
    const transactionDate = new Date(account.movementsDates[i]);
    const daysPassed = Math.round(checkDaysPassed(new Date(), transactionDate));
    const daysAgoStr =
      daysPassed === 0
        ? 'today'
        : daysPassed === 1
        ? 'yesterday'
        : daysPassed === 7
        ? '1 week ago'
        : daysPassed > 7
        ? formatDateShort(transactionDate)
        : `${daysPassed} days ago`;

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
        <div class="movements__date">
        ${daysAgoStr}
        </div>
        <div class="movements__value">${formatCurrency(movement)}</div>
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
  const now = new Date();
  labelDate.textContent = formatDateLong(now);

  const currentBalance = account.movements.reduce(
    (balance, movement) => balance + movement,
    0
  );

  labelBalance.textContent = formatCurrency(currentBalance);
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
  // labelSumIn.textContent = `$${calcSum(deposits).toFixed(2)}`;
  labelSumIn.textContent = formatCurrency(calcSum(deposits));
  labelSumOut.textContent = formatCurrency(Math.abs(calcSum(withdrawals)));
  labelSumInterest.textContent = formatCurrency(calcSum(interest));
};

//Chaining a lot of methods together can cause performnce issues if working with large arrays
//It is a bad practice to chain methods that mutate the original array. For example, the splice or reverse method.
const updateUI = account => {
  displaySummary(account);
  displayBalance(account);
  displayMovements(account);
};

//Function Notes
//1. Pass in a number as a parameter
//2. Create options object that will include formating styles for number
//3. Call Intl.NumberFormat function
//4. Pass in currentAccount.locale and options as parameters
//5. Chain format function, with num passed in as parameter
const formatCurrency = num => {
  const options = {
    style: 'currency',
    currency: currentAccount.currency,
    currencyDisplay: 'symbol',
  };
  return new Intl.NumberFormat(currentAccount.locale, options).format(num);
};

//Function Notes
//Set the time to 5 minutes
//Call the timer every second
//Print the remaining time to UI
//Logout timer reaches 0, logout currentAccount
const startLogoutTimer = function () {
  //setTimeout/setInterval only invokes the function after the specified time
  //to call the function immediately, store callback into its own variable, then call it before the setTimeout/setInterval
  const ticker = () => {
    //Convert minute and second to string to apply the padStart method
    let minute = (time / 60).toString().padStart(2, 0);
    let second = (time % 60).toString().padStart(2, 0);
    labelTimer.textContent = `${Math.trunc(minute)}:${second}`;

    if (time === 0) {
      clearInterval(remainingTime);
      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'Log in to get started';
    }

    time--;
  };

  let time = 300;
  ticker();
  const timer = setInterval(ticker, 1000);
  return timer;
};

//Check if a timer already exist, if stop timer
const resetTimer = () => {
  if (timer) clearInterval(timer);
  //Start/Restart Logout Timer
  timer = startLogoutTimer();
};

//==============================
//Simulate always logged in
//==============================
// currentAccount = account1;
// updateUI(account1);
// containerApp.style.opacity = '100';

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

    resetTimer();
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
    currentAccount.movementsDates.push(new Date().toISOString());
    recepientAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = ``;
    inputTransferAmount.blur();
  } else {
    alert(`The transfer is invalid and cannot be completed`);
  }
  resetTimer();
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
  resetTimer();
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
    currentAccount.movementsDates.push(new Date().toISOString()); //Add loan date
    //Include a setTimeout to simulate the processing of the loan
    inputLoanAmount.value = ``;
    inputLoanAmount.blur();
    document.body.style.cursor = 'progress';
    setTimeout(() => {
      alert('Loan was approved');
      updateUI(currentAccount);
      document.body.style.cursor = 'auto';
    }, 3000);
  } else {
    alert(
      `For this loan to be approved, a deposit of at least $${
        loanAmount * 0.25
      } (25% of loan request) must be deposited`
    );
    inputLoanAmount.value = ``;
    inputLoanAmount.blur();
  }
  resetTimer();
});

//Sorted state defaults to false on user login
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  resetTimer();
});
