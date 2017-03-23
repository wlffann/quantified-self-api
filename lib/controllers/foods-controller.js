const Food = require('../models/food.js');

function create(request, response) { 
  return Food.create(request.body.food.name, request.body.food.calories, new Date)
  .then((data) => {
    response.status(201).json(data.rows[0]);
  });

}

function index(request, response){
  return Food.all().then((data) => {
    response.status(200).json(data.rows);
  });
}

function show(request, response){
  return Food.find(request.params.id)
  .then((data) => {
    if (!data.rowCount) {
      response.sendStatus(404)
    }
    response.json(data.rows[0])
  });
}

function update(request, response){
  return Food.updateFood(request.body.food.name, request.body.food.calories, request.params.id)
  .then((data) => {
    if (!data.rowCount) {
      response.sendStatus(404);
    }
    response.status(202).json(data.rows[0])
  });
}

function destroy(request, response){
  return Food.deleteFood(request.params.id)
  .then((data) => {
    response.sendStatus(202);
  })
}

module.exports = {
  create: create,
  index: index,
  show: show,
  update: update,
  destroy: destroy
}
