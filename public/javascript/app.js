(
  function(){
    var app = angular.module("recipeBook", []);

    app.service("RecipeService",['$http',function($http){
      this.ListAllIngredients = function(){
        return $http.get("/api/listAllIngredients");
      };
      this.ListAllRecipes = function(){
        return $http.get("/api/listAllRecipes");
      };
      this.Search = function(query){
        return $http.get("/api/search?q="+query);
      }
      this.getRecipe = function(id){
        return $http.get("/api/getRecipe?id="+id);
      }
    }]);

    app.config('$stateProvider',function($stateProvider){

      //Recipe List State//////////////////////////
      $stateProvider
      .state('recipes', {
        url:'/recipes',
        resolve:{
          recipes:['RecipeService', function(RecipeService){
            return RecipeService.ListAllRecipes();
          }],
          recipe:function(){ return {}; }
        },
        templateUrl:'...',
        controller:'RecipeController';
        controllerAs: 'recipes'
      })

      //Recipe Search///////////////////////////////
      .state('search',{
        url:'/recipe/search/:query',
        resolve:{
          recipe: ['$stateParams', 'RecipeService', function($stateParams,RecipeService){
            return RecipeService.Search($stateParams.query);
          }],
          recipe:function() {return {};}
        },
        templateUrl: '...',
        controller:'RecipeController',
        controllerAs:'recipes'
      })

      //Edit Recipe//////////////////////////////////
      .state('recipe',{
        url:'recipes/:id',
        resolve:{
          recipes: function(){return [];},
          recipe: ['$stateParams', 'RecipeService',
            function($stateParams, RecipeService){
              return RecipeService.getRecipe($stateParams.id);
            }]
        },
        templateUrl: '...',
        controller: 'RecipeController',
        controllerAs: 'recipes'
      });

    });

    app.controller('RecipeController', ['$state','RecipeService','recipes', 'recipe', function($state,goatService,recipes,recipe){
      this.recipe = recipe.data;

      this.recipeQuery = $state.params.query;

      this.recipes = recipes.data;

      this.saveRecipe = function(){
        RecipeService.saveRecipe(this.recipe)
          .then(function(){ $state.go('recipes'); });
      };

      this.searchRecipes = function(query){
        if (!query.length) return $state.go('recipes');
        $state.go('search', {query:query});
      };

    }]);

    app.controller("BookController", function(){
        this.recipeList = recipes;

        this.UpdateRecipes = function(){
          getTheRecipes();
        }

    });
  }
)()
