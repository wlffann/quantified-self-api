const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

function find(id) {
  return database.raw('SELECT * FROM foods WHERE id=?', [id])
}

function clearFoods() {
  return database.raw('TRUNCATE foods RESTART IDENTITY')
}

function create(name, calories, created_at) {
  return database.raw(
    'INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?) RETURNING *',
    [name, calories, created_at]
  )
}

function all() {
  return database.raw('SELECT * FROM foods');
}

function deleteFood(id) {
  return database.raw('DELETE FROM foods WHERE id = ? RETURNING *', [id])
}

function updateFood(name, calories, id) {
  return database.raw('UPDATE foods SET name = ?, calories = ? WHERE id = ? RETURNING *', 
    [name, calories, id])
}

module.exports = {
  all: all,
  clearFoods: clearFoods,
  create: create,
  find: find,
  deleteFood: deleteFood,
  updateFood: updateFood
}
