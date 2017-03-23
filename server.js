const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self API';

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

app.get('/', (request, response) => {
  response.send('Welcome to the Quantified Self API.')
})

app.post('/foods', (request, response) => {
  database.raw('INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?) RETURNING *', [request.body.food.name, request.body.food.calories, new Date])
  .then((data) => {
    response.status(201).json(data.rows[0]);
  });
});

app.get('/foods', (request, response) => {
  database.raw('SELECT * FROM foods')
  .then((data) => {
    response.status(200).json(data.rows);
  });
});

app.get('/foods/:id', (request, response) => {
  database.raw('SELECT * FROM foods WHERE id=?', [request.params.id])
  .then((data) => {
    if (!data.rowCount) {
      response.sendStatus(404)
    }
    response.json(data.rows[0])
  });
});

app.patch('/foods/:id', (request, response) => {
  database.raw('UPDATE foods SET name = ?, calories = ? WHERE id = ? RETURNING *', [request.body.food.name, request.body.food.calories, request.params.id])
  .then((data) => {
    if (!data.rowCount) {
      response.sendStatus(404);
    }
    response.status(202).json(data.rows[0])
  });
});

app.delete('/foods/:id', (request, response) => {
  database.raw('DELETE FROM foods WHERE id = ?', [request.params.id])
  .then((data) => {
    response.sendStatus(202);
  })
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app
