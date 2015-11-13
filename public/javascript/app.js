(function(){
  var app = angular.module("recipeBook", ['ui.router']);

  app.factory("recipeFactory",function($http){
    var search, ingredients, recipes, recipe, recipeSteps, recipeIngredients;
    var removeRecipe, removeIngredient, removeRecipeIngredient, removeRecipeStep;
    var addRecipe, addRecipeStep, addRecipeIng, addIngredient;
    var updateRecipe, updateRecipeStep, updateRecipeIngredient, updateIngredient;
    ////////////////////////
    // Lists and Searches //
    ////////////////////////
    ingredients = function(){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/listAllIngredients');
    };
    recipes = function(){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/listAllRecipes/');
    };
    recipe = function(id){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/getRecipe?recipeid='+id);
    };
    recipeDirections = function(id){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/findRecipeDirections?recipeid='+id);
    };
    recipeIngredients = function(id){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/findRecipeIngredients?recipeid='+id);
    };
    //
    //
    //
    return {
      ////////////////////////
      // Lists and Searches //
      ////////////////////////
      "ingredients":ingredients,
      "recipes":recipes,
      "recipe":recipe,
      "recipeDirections":recipeDirections,
      "recipeIngredients":recipeIngredients
      //
      //
      //
    };
  });

  app.directive("recipePanel",function(){
    return {
      restrict: 'A',
      replace:true,
      templateUrl:"public/directives/recipe-panel.html",
      controller: function($scope, recipeFactory){
        $scope.recipes = [];
        return recipeFactory.recipes().success(function(result){ return $scope.recipes = result; });
      }
    }
  });
  app.directive("ingredientPanel", function(){
    return {
      restrict: 'A',
      replace: true,
      templateUrl:"public/directives/ingredient-panel.html",
      scope:{ recipeId:'@'},
      controller:function($scope, recipeFactory){
        $scope.ingredients = [];
        var recipe_id = parseInt($scope.recipeId);
        return recipeFactory.recipeIngredients(recipe_id)
        .success(function(result){
          $scope.ingredients = result;
          return $scope.ingredients;
        });

      }
    }
  });
  app.directive("directionPanel", function(){
    return {
      restrict: 'A',
      replace: true,
      templateUrl:"public/directives/direction-panel.html",
      scope:{recipeId:'@'},
      controller:function($scope, recipeFactory){
        $scope.directions = [];
        var recipe_id = parseInt($scope.recipeId);
        return recipeFactory.recipeDirections(recipe_id)
        .success(function(result){
          $scope.directions = result;
          return $scope.directions;
        });
      }
    }
  })

})()
