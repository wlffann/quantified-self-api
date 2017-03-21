const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self API';
app.locals.food = {}

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

app.get('/', (request, response) => {
  response.send('Welcome to the Quantified Self API.')
})

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
  response.status(201).json({
    food 
  });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app
