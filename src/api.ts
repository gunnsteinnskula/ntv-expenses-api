import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const port = 4000;
const api = express();

api.use(cors());
api.set('port', port);
api.use(morgan('dev'));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

let nextId = 4;
let expenses = [
  { id: 1, name: 'Beer', cost: 5690 },
  { id: 2, name: 'Candy', cost: 355 },
  { id: 3, name: 'VIM course', cost: 10990 },
];

api.get('/api/expenses', (req, res) => {
  return res.json(expenses);
});

api.post('/api/create-expense', (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const cost = req.body.cost;

  if (!name || !cost) {
    res.json({
      success: false,
      error: 'Must supply name and cost for the expense',
    });
    return;
  }

  const expense = { id: nextId, name, cost };
  expenses.push(expense);
  nextId += 1;

  return res.json({
    success: true,
    expense,
  });
});

api.get('/api/expense/:id', (req, res) => {
  const expenseId = parseInt(req.params.id, 10);
  const expense = expenses.find((e) => e.id === expenseId);
  if (expense) {
    return res.json(expense);
  } else {
    res.json({
      success: false,
      error: `Could not find expense with id=${expenseId}`,
    });
  }
});

api.delete('/api/expense/:id', (req, res) => {
  const expenseId = parseInt(req.params.id, 10);
  const expense = expenses.find((e) => e.id === expenseId);
  if (expense) {
    expenses = expenses.filter((e) => e.id !== expenseId);
    res.json({
      success: true,
      deletedExpense: expense,
    });
  } else {
    res.json({
      success: false,
      error: `Could not find expense with id=${expenseId}`,
    });
  }
});

api.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Expenses API is running on port ${port}`);
});
