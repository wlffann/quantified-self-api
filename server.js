const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const Food = require('./lib/models/food.js');
const FoodsController = require('./lib/controllers/foods-controller.js')

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
  FoodsController.create(request, response)
});

app.get('/foods', (request, response) => {
  FoodsController.index(request, response)
});

app.get('/foods/:id', (request, response) => {
  FoodsController.show(request, response)
});

app.patch('/foods/:id', (request, response) => {
  FoodsController.update(request, response)
});

app.delete('/foods/:id', (request, response) => {
  FoodsController.destroy(request, response)
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app
