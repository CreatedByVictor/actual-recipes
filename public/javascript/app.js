(function(){
  var app = angular.module("recipeBook", ['ui.router','ui.bootstrap']);

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
    search = function(query){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/findRecipeIngredients?q='+query);
    };
    //////////////
    // Creation //
    //////////////
    addRecipe = function(title,author,description,cooktime,preptime,yield,link){
     var query = function(){
       var output;

       if(title){       output += "title="        +title+"&"};
       if(author){      output += "author="       +author+"&"};
       if(description){ output += "description="  +description+"&"};
       if(yield){       output += "yield="        +yield+"&"};
       if(cooktime){    output += "cooktime="     +cooktime+"&"};
       if(preptime){    output += "preptime="     +preptime+"&"};
       if(link){        output += "link="         +link+"&"};

       return output;
     }
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/addRecipeToDatabase?'+ query());
    }
    addStep = function(recipeid, steporder, text){
      var query = function(){
        var output = "";
        if(recipeid){output += "recipeid="+recipeid+"&"};
        if(order){output += "order="+order+"&"};
        if(text){output += "text="+text+"&"};
        return output;
      }
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/addStepToRecipe?'+ query())
    }
    addIngredientToRecipe = function(recipeid, ing_id, ing_name, quantity, unit, note){
      var query = function(){
        var output = "";

        if(recipeid){output += "recipeid=" + recipeid + "&"};
        if(ing_id){output += "ingid=" + ing_id + "&"};
        if(ing_name){output += "name=" + ing_name + "&"};
        if(quantity){output += "qty=" + quantiy + "&"};
        if(unit){output += "unit=" + unit + "&"};
        if(note){output += "note=" + note + "&"};

        return output;
      }
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/addIngredientToRecipe?'+query());
    }
    addIngredientToDatabase = function(name){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/addIngredientToDatabase?name='+name);
    }
    /////////////////////
    // The Holy Return //
    /////////////////////
    return {
      ////////////////////////
      // Lists and Searches //
      ////////////////////////
      "ingredients":ingredients,
      "recipes":recipes,
      "recipe":recipe,
      "recipeDirections":recipeDirections,
      "recipeIngredients":recipeIngredients,
      "search":search,
      //////////////
      // Creation //
      //////////////
      "addRecipe" : addRecipe,
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
