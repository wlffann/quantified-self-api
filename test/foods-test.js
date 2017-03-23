const app = require('../server.js');
const assert = require('chai').assert;
const request = require('request');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const Food = require('../lib/models/food.js');

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
    beforeEach((done) => {
        Food.create("banana", 105, new Date).then(() => done());
    })

    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })
    
    it('returns a successful status code if record found', (done) => {
      this.request.get('/foods/1', (error, response) => {
        if (error) { done(error) };
        assert.equal(response.statusCode, 200);
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
        
        const id = 1
        const name = 'banana'
        const calories = 105

        let foundFood = JSON.parse(response.body)
        assert.equal(foundFood.id, id)
        assert.equal(foundFood.name, name)
        assert.equal(foundFood.calories, calories)
        done()
      });
    });
  });

  describe('GET /foods', () => {
    beforeEach((done) => {
      Food.create("banana", 105, new Date).then(() => done());
    })

    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })
    
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
        
        let foods = JSON.parse(response.body);
        
        assert.equal(foods.length, 1); 
        done();
      });
    });
  });

  describe('POST /foods', () => {
    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })
    
    it('recieves and stores data', (done) => {
      var food = {'food': {'name': 'banana', 'calories': '105'}}
      this.request.post('/foods', { form: food }, (error, response) => {
        if (error) { done(error) };
        var food = JSON.parse(response.body)
        assert.equal(food.name, 'banana');
        assert.equal(food.calories, '105');
        done();
      });
    });
  });

  describe('PATCH /foods/:id', () => {
    beforeEach((done) => {
      Food.create('banana', '105', new Date).then(() => done());
    })
    
    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })
    
    it('can update an exsisting record', (done) => {
      var food = {'food': {'name': 'apple', 'calories': '105'}}
      this.request.patch('/foods/1', { form: food }, (error, response) => {
        if (error) { done(error) } 
        var food = JSON.parse(response.body);
        assert.equal(food.name, 'apple');
        assert.equal(food.calories, '105');
        done();
      });
    });  
  });

  describe('DELETE /foods/:id', () => {
    beforeEach((done) => {
      Food.create('banana', 105, new Date).then(() => done());
    })
    
    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })
    
    it('removes a specific record', (done) => {
      this.request.delete('/foods/1', (error, response) => {
        if (error) { done(error) }
        
        assert.equal(response.statusCode, 202)
        done();
      });
    });
  });
});
