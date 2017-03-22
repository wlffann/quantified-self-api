const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self API';
app.locals.foods = {}

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

app.get('/', (request, response) => {
  response.send('Welcome to the Quantified Self API.')
})

app.post('/foods', (request, response) => {
  var id = Date.now();
  var food = request.body.food;
  app.locals.foods[id] = food;
  response.sendStatus(200);
});

app.get('/foods', (request, response) => {
  var foods = app.locals.foods
  response.status(200).json({
    foods
  });
});

app.get('/foods/:id', (request, response) => {
  var food = app.locals.foods[request.params.id]
  if (!food) {
    return response.sendStatus(404);
  };
  response.status(200).json({
    food 
  });
});

app.patch('/foods/:id', (request, response) => {
  var food = app.locals.foods[request.params.id];
  if (!food) {
    return response.sendStatus(404);
  }
  food['name'] = request.body.food.name;
  food['calories'] = request.body.food.calories;
  response.status(202).json({
    food
  });
});

app.delete('/foods/:id', (request, response) => {
  var food = app.locals.foods[request.params.id];
  if (!food) {
    return response.sendStatus(404);
  }
  delete app.locals.foods[request.params.id];
  response.sendStatus(202);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app
