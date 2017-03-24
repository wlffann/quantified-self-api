const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const FoodsController = require('./lib/controllers/foods-controller.js')

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.options('*', cors(corsOptions))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self API';

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
