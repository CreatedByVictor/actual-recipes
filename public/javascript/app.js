(
  angular.module('recipeBook')
  .service("recipeService", ['$http', function($http){

    this.listIngredients = function(){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/listAllIngredients');
    };

    this.listRecipes = function(){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/listAllRecipes');
    };

    this.getRecipe = function(id){
      return $http.get('http://blackoak-fogwoods.rhcloud.com/api/getRecipe?recipeid='+id);
    };

  }]);

  angular.module('recipeBook')
  .config(['$stateProvider', function($stateProvider){

    #stateProvider.state('recipes'{
      url:"/recipes",
      resolve:{
        recipes:['RecipeService', function(RecipeService){
          return RecipeService.listRecipes();
        }],
        recipe:function(){ return {}; }
      },
      //templateUrl: '...',
      controller:'recipeController',
      controllerAs:'recipes'
    }).state('search',{
      url:'/recipes/search/:query',
      resolve:{
        recipes:['$stateParams','recipeService',
          function($stateParams,recipeService){
            return recipeService.getRecipe($stateParams.query);
          }],
        recipe:function(){ return {}; }
      },
      //templateUrl: '...',
      controller:'recipeController',
      controllerAs:'recipes'
    })

  }]);

  angular.module('recipeBook')
  .controller('recipeController', ['$state', 'recipeService', 'recipes', 'recipe', function($state, recipeService, recipes, recipe){
    this.recipe = recipe.data;
    this.recipeQuery = $state.params.query;
    this.recipes = recipes.data;
    this.getRecipes = function(query){
      if(!query.length) return $state.go('recipes');
      $state.go('search',{"id":query});
    };
  }]);

)()
