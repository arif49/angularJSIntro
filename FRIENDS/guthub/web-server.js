var databaseUrl = "test"; // "username:password@example.com/mydb"
var collections = [ "angularjs" ]
var db = require("mongojs").connect(databaseUrl, collections);

var express = require("express"),
  app = express(),
  port = parseInt(process.env.PORT, 10) || 8080;

app.configure(function () {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
});

var recipes_map = {
  '1': {
    "id": "1",
    "title": "Cookies",
    "featured": "true",
    "description": "Delicious, crisp on the outside, chewy on the outside, oozing with chocolatey goodness cookies. The best kind",
    "ingredients": [
      {
        "amount": "1",
        "amountUnits": "packet",
        "ingredientName": "Chips Ahoy"
      }
    ],
    "instructions": "1. Go buy a packet of Chips Ahoy\n2. Heat it up in an oven\n3. Enjoy warm cookies\n4. Learn how to bake cookies from somewhere else"
  },
  '2': {
    "id": "2",
    'title': 'Recipe 2',
    'featured': 'false',
    'description': 'Description 2',
    'instructions': 'Instruction 2',
    ingredients: [
      {amount: 13, amountUnits: 'pounds', ingredientName: 'Awesomeness'}
    ]
  }
};

app.get('/view/*',function(req,res){
  console.log('/#'+req.url)
  res.redirect('/#'+req.url)
});

app.get('/recipes', function (req, res) {
  var recipe_array = [];
  db.angularjs.find({}, function (err, recipes) {
    if (err || !recipes) console.log("No recipe found");
    else {
      recipes.forEach(function (recipe) {
        recipe_array.push(recipe);
      });
      res.send(recipe_array);
    }
  });
  // Simulate delay in server
//  setTimeout(function() {
//    res.send(recipe_array);
//  }, 500);
});

app.get('/names', function (req, res) {
  res.send(['Brad', 'Shyam']);
});


app.get('/recipes/:id', function (req, res) {
  console.log('Requesting recipe with id', req.params.id);
  db.angularjs.find({'id': parseInt(req.params.id)}, function (err, recipe) {
    if (err || !recipe) console.log("No recipe found");
    else
      res.send(recipe[0])
  });
});
// handles new recipe creation request
app.post('/recipes', function (req, res) {
  var recipe = {};
  recipe.title = req.body.title;
  recipe.description = req.body.description;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;

  db.angularjs.find({}, {}, {limit: 1}).sort({_id: -1}, function (err, lastRecipe) {
    if (err || !lastRecipe) console.log("No recipe found");
    else if (lastRecipe instanceof Array && lastRecipe.length > 0) {
      recipe.id = lastRecipe[0].id + 1;
      db.angularjs.insert(recipe, function (err, inserted) {
        if (err || !inserted) console.log("Recipe not updated " + err);
        else {
          res.send(recipe);
          console.log("Recipe Inserted " + recipe.id)
        }
      });
    }
  });
});
// handles update event of an existing recipe
app.post('/recipes/:id', function (req, res) {
  var recipe = {};
  recipe.id = parseInt(req.params.id);
  recipe.title = req.body.title;
  recipe.featured = req.body.featured;
  recipe.description = req.body.description;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;

  db.angularjs.update({'id': recipe.id}, recipe, function (err, updated) {
    if (err || !updated) console.log("Recipe not updated " + err);
    else console.log("Recipe updated " + recipe.id);
  });
  res.send(recipe);
});

app.delete('/recipes/:id', function (req, res) {
  delete recipes_map[req.params.id];
  console.log('Delete Request Received');
});

app.listen(port);
console.log('Now serving the app at http://localhost:' + port + '/');
