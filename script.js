'use strict';

// Data
const account1 = {
  owner: 'Willie Whitfield',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
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

//Function Notes - displayMovements
//** Function will expect an array of number values as a parameter
//1. Clear out inner html of the movements container
//2. Loop through movements array
//3. Declare variable that displays 'withdrawal' or 'deposit' based on if movement is > or < 0.
//4. Declare variable that stores html markup that will be rendered in string format
//5. Use the .insertAdjacentHTML() method and pass the html variable. HTML will be positioned 'afterbegin' so last element in array is rendered at the top of the movements container
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (movement, i) {
    const transactionType = movement < 0 ? 'withdrawal' : 'deposit';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
        <div class="movements__value">$${Math.abs(movement)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);

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
  labelBalance.textContent = `$${currentBalance}`;
};

displayBalance(account1);
