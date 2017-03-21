const app = require('../server.js');
const assert = require('chai').assert;
const request = require('request');

describe('API', () => {
  
  before(done => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, result) => {
      if (err) { done(err) }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
    
    app.locals.foods = {
      1: {'name': 'banana',
          'calories': '105'},
      2: {'name': 'carrot',
          'calories': '25'}
    };
  });

  after(() => {
    this.server.close();
  });
  
  describe('server', () => {
    it('it exsists', (done) => {
      assert(app);
      done();
    });
  });

  describe('GET /foods/:id', () => {
    it('returns a successful status code if record found', (done) => {
      this.request.get('/foods/1', (error, response) => {
        if (error) { done(error) };
        assert.equal(response.statusCode, 201);
        done();
      });
    });

    it('returns 404 if record not found', (done) => {
      this.request.get('/foods/3', (error, response) => {
        if (error) { done(error) };
        assert.equal(response.statusCode, 404);
        done();
      });
    });

    it('returns a particular food', (done) => {
      this.request.get('/foods/1', (error, response) => {
        if (error) { done(error) };
        var expectedFood = app.locals.foods[1]
        var foundFood = JSON.parse(response.body)['food'];
        assert.equal(foundFood.name, expectedFood.name);
        assert.equal(foundFood.calories, expectedFood.calories);
        done();
      });
    });
  });

  describe('GET /foods', () => {
    it('returns a successful status code', (done) => {
      this.request.get('/foods', (error, response) => {
        if (error) { done(error) };
        assert.equal(response.statusCode, 200)
        done();
      });
    });

    it('returns all foods avaiable', (done) => {
      this.request.get('/foods', (error, response) => {
        if (error) { done(error) };
        var foods = JSON.parse(response.body);
        assert.equal(foods.count, app.locals.foods.count);
        done();
      });
    });
  });

  describe('POST /foods', () => {
  
  });
});
