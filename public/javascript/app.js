(function(){

  //var app = angular.module("recipeBook", ['ngMaterial']); //For angular material usage
  var app = angular.module("recipeBook", []);

  var bookListing = [
        {
          title:"Stuffed Jack-O-Lantern Bell Peppers",
          date:1446403471,
          username:"stepperanddaniel",
          description:"My own stuffed bell pepper recipe with a festive twist for Halloween.",
          link:"http://allrecipes.com/recipe/180596/stuffed-jack-o-lantern-bell-peppers/",
          yield:"6",
          image:"http://yumuniverse.com/wp-content/uploads/2012/09/Jack_o_lantern_Peppers_Main.jpg",
          time:{
            prep:undefined,
            cook:"1 hour and 25 minutes"
          },
          ingredients:[
            {
              quantity:6,
              unit:"whole",
              name:"Bell Pepper",
              note:"any color"
            },{
              quantity:1,
              unit:"pound",
              name:"ground beef",
              note:undefined
            },{
              quantity:1,
              unit:undefined,
              name:"egg",
              note:undefined
            },{
              quantity:"4",
              unit:"slices",
              name:"whole wheat bread",
              note:"cubed"
            },{
              quantity:"1",
              unit:"whole",
              name:"small onion",
              note:"chopped"
            },{
              quantity:"1",
              unit:"whole",
              name:"small tomato",
              note:"diced"
            },{
              quantity:"2",
              unit:"cloves",
              name:"garlic",
              note:"minced"
            },{
              quantity:"1/2",
              unit:"cup",
              name:"chili sauce",
              note:undefined
            },{
              quantity:"1/4",
              unit:"cup",
              name:"prepared yellow mustard",
              "note":undefined
            },{
              quantity:"3",
              unit:"tablespoons",
              name:"Worcestershire sauce",
              note:undefined
            },{
              quantity:"1/4",
              unit:"teaspoons",
              name:"salt",
              note:undefined
            },{
              quantity:"1/4",
              unit:"teaspoon",
              name:"pepper",
              note:undefined
            }
          ],
          directions:[
            {value:"Preheat oven to 350 degrees F (175 degrees C). Grease an 8x8 inch baking dish."},
            {value:"Lightly mix together the ground beef, egg, bread cubes, onion, tomato, garlic, chili sauce, mustard, Worcestershire sauce, salt, and pepper in a bowl."},
            {value:"Wash the peppers, and cut jack-o'-lantern faces into the peppers with a sharp paring knife, making triangle eyes and noses, and pointy-teeth smiles. Slice off the tops of the peppers, and scoop out the seeds and cores. Stuff the peppers lightly with the beef stuffing, and place them into the prepared baking dish so they lean against each other."},
            {value:"Bake in the preheated oven until the peppers are tender and the stuffing is cooked through and juicy, about 1 hour."}
          ],
          footnotes:"Aluminum foil can be used to keep food moist, cook it evenly, and make clean-up easier."
        },
        {
          title:"Different Stuffed Jack-O-Lantern Bell Peppers",
          date:1446403471,
          username:"stepperanddaniel",
          description:"My own stuffed bell pepper recipe with a festive twist for Halloween.",
          link:"http://allrecipes.com/recipe/180596/stuffed-jack-o-lantern-bell-peppers/",
          yield:"6",
          image:"http://yumuniverse.com/wp-content/uploads/2012/09/Jack_o_lantern_Peppers_Main.jpg",
          time:{
            prep:undefined,
            cook:"1 hour and 25 minutes"
          },
          ingredients:[
            {
              quantity:6,
              unit:"whole",
              name:"Bell Pepper",
              note:"any color"
            },{
              quantity:1,
              unit:"pound",
              name:"ground beef",
              note:undefined
            },{
              quantity:1,
              unit:undefined,
              name:"egg",
              note:undefined
            },{
              quantity:"4",
              unit:"slices",
              name:"whole wheat bread",
              note:"cubed"
            },{
              quantity:"1",
              unit:"whole",
              name:"small onion",
              note:"chopped"
            },{
              quantity:"1",
              unit:"whole",
              name:"small tomato",
              note:"diced"
            },{
              quantity:"2",
              unit:"cloves",
              name:"garlic",
              note:"minced"
            },{
              quantity:"1/2",
              unit:"cup",
              name:"chili sauce",
              note:undefined
            },{
              quantity:"1/4",
              unit:"cup",
              name:"prepared yellow mustard",
              "note":undefined
            },{
              quantity:"3",
              unit:"tablespoons",
              name:"Worcestershire sauce",
              note:undefined
            },{
              quantity:"1/4",
              unit:"teaspoons",
              name:"salt",
              note:undefined
            },{
              quantity:"1/4",
              unit:"teaspoon",
              name:"pepper",
              note:undefined
            }
          ],
          directions:[
            {value:"Preheat oven to 350 degrees F (175 degrees C). Grease an 8x8 inch baking dish."},
            {value:"Lightly mix together the ground beef, egg, bread cubes, onion, tomato, garlic, chili sauce, mustard, Worcestershire sauce, salt, and pepper in a bowl."},
            {value:"Wash the peppers, and cut jack-o'-lantern faces into the peppers with a sharp paring knife, making triangle eyes and noses, and pointy-teeth smiles. Slice off the tops of the peppers, and scoop out the seeds and cores. Stuff the peppers lightly with the beef stuffing, and place them into the prepared baking dish so they lean against each other."},
            {value:"Bake in the preheated oven until the peppers are tender and the stuffing is cooked through and juicy, about 1 hour."}
          ],
          footnotes:"Aluminum foil can be used to keep food moist, cook it evenly, and make clean-up easier."
        }
      ];
/*
  app.config(function($mdThemingProvider) {
      // Configure a dark theme with primary foreground yellow
      $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
    });*/

    var _currentMode="select"; //start with Select

    var _globalSelectedIndex = 0; //start with 0

  app.controller("BookController", function(){
    this.echo = function(input){return input;};
    this.recipes = bookListing;

    this.presentState={
      "mode":_currentMode,
      "index":_globalSelectedIndex,
    };

    this.isSelectMode = function(){return _currentMode === "select"};
    this.isViewingMe = function(myIndex){
      if( _currentMode === "view"){
        return _globalSelectedIndex === myIndex;
      }
      else{
        return false;
      }
    };
    this.isEditingMe = function(myIndex){
      if( _currentMode === "edit"){
        return _globalSelectedIndex === myIndex;
      }
      else{
        return false;
      }
    };
  });

  app.controller("ModeController",function(){

    function setTo(input){
      if (_currentMode !== input){
        _currentMode = input;
      }
      //console.log("globalIndex", _globalSelectedIndex, "mode", input);
    }
    this.setToViewMode = function(index){
      _globalSelectedIndex = index;
      setTo("view");
    }
    this.setToEditMode = function(index){
      _globalSelectedIndex = index;
      setTo("edit");
    }
    this.setToSelectMode = function(){
      _globalSelectedIndex = -1;
      setTo("select");
    }
  });

  app.controller("EditModeController", function(){
    this.addEmptyIngredientTo = function (targetRecipe) {
      var emptyIngredient = {
        quantity:undefined,
        unit:undefined,
        name:undefined,
        note:undefined
      };

      targetRecipe.ingredients.push(emptyIngredient);

      console.log("Added Empty Ingredient");
    }

    this.removeIngredientFrom = function(ingIndex, targetRecipe){
      targetRecipe.ingredients.splice(ingIndex,1);
      console.log("Removed an Ingredient");
    }
    this.addEmptyStepTo = function(targetRecipe){
      console.log("Step Count Before Addition: ", targetRecipe.directions.length);
      var emptyStep ={ value:undefined };
      targetRecipe.directions.push(emptyStep);
      console.log("Step Count After Addition: ", targetRecipe.directions.length);
    }
    this.removeStepFrom = function(stepIndex,targetRecipe){
      targetRecipe.directions.splice(stepIndex,1);
      console.log("Remove Step From: ", targetRecipe.directions.length);
    }
  });


/*
  Directive Space Below,
*/

  app.directive("recipePanel", function(){
    return{
      resctrict:'E',
      templateUrl:'/directives/recipe-panel'
    }
  });
/*
  app.controller('DialogController', function($scope, $mdDialog){

  });

  app.controller('MyController', function($scope, $mdBottomSheet) {
    $scope.openBottomSheet = function() {
    $mdBottomSheet.show({template: '<md-bottom-sheet>Hello!</md-bottom-sheet>'});
  };
});*/

})()
