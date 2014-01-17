'use strict';

var app = angular.module('guthub',
  ['guthub.directives', 'guthub.services']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      controller: 'ListCtrl',
      resolve: {
        recipes: ["MultiRecipeLoader", function (MultiRecipeLoader) {
          return MultiRecipeLoader();
        }]
      },
      templateUrl: '/views/list.html'
    }).when('/edit/:recipeId', {
      controller: 'EditCtrl',
      resolve: {
        recipe: ["RecipeLoader", function (RecipeLoader) {
          return RecipeLoader();
        }]
      },
      templateUrl: '/views/recipeForm.html'
    }).when('/view/:recipeId', {
      controller: 'ViewCtrl',
      resolve: {
        recipe: ["RecipeLoader", function (RecipeLoader) {
          return RecipeLoader();
        }]
      },
      templateUrl: '/views/viewRecipe.html'
    }).when('/new', {
      controller: 'NewCtrl',
      templateUrl: '/views/recipeForm.html'
    }).otherwise({redirectTo: '/'});

  $locationProvider.html5Mode(true);
}]);

app.controller('ListCtrl', ['$scope', 'recipes',
  function ($scope, recipes) {
    $scope.recipes = recipes;
  }]);

app.controller('ViewCtrl', ['$scope', '$location', 'recipe',
  function ($scope, $location, recipe) {
    $scope.recipe = recipe;

    $scope.edit = function () {
      $location.path('/edit/' + recipe.id);
    };
  }]);

app.controller('EditCtrl', ['$scope', '$location', 'recipe',
  function ($scope, $location, recipe) {
    $scope.recipe = recipe;

    $scope.save = function () {
      $scope.recipe.$save(function (recipe) {
        $location.path('/view/' + recipe.id);
      });
    };

    $scope.remove = function () {
      $scope.recipe.$delete();
//    delete $scope.recipe; //delets recipe from the scope
      $location.path('/');
    };
  }]);

app.controller('NewCtrl', ['$scope', '$location', 'Recipe',
  function ($scope, $location, Recipe) {
    $scope.recipe = new Recipe({
      featured: "true",
      ingredients: [
        {}
      ]
    });

    $scope.save = function () {
      $scope.recipe.$save(function (recipe) {
        $location.path('/view/' + recipe.id);
      });
    };
  }]);

app.controller('IngredientsCtrl', ['$scope',
  function ($scope) {
    $scope.addIngredient = function () {
      var ingredients = $scope.recipe.ingredients;
      ingredients[ingredients.length] = {};
    };
    $scope.removeIngredient = function (index) {
      $scope.recipe.ingredients.splice(index, 1);
    };
  }]);

function NamesListCtrl($scope, $http) {

}

app.controller('NamesListCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('/names', {params: {filter: 'none'}}).success(function (data) {
      $scope.names = data;
    });
  }]);
