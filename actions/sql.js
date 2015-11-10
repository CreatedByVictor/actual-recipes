var pg = require('pg');
var openshift_DB_host = process.env.OPENSHIFT_POSTGRESQL_DB_HOST;
var openshift_DB_port = process.env.OPENSHIFT_POSTGRESQL_DB_PORT;
var openshift_DB_user = process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME;
var openshift_DB_pass = process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD;
var openshift_DB_name = process.env.PGDATABASE;
var openshift_DB_url  = process.env.OPENSHIFT_POSTGRESQL_DB_URL;

function databaseConnect( query, andAnotherThing ){

  var connString = "postgresql://" + openshift_DB_user + ":" + openshift_DB_pass + "@" + openshift_DB_host + ":" + openshift_DB_port + "/recipedb";

  pg.connect(connString, function(err, client, done){

    var errorHandler = function(isAnError,obj){
      if (isAnError){
        console.log("SQL Error:",isAnError);
        if (obj){
          console.log(obj);
        };
        if (client){
          done(client);
        }
        if (andAnotherThing){
          andAnotherThing(err); //Just return the error,
        return true;
        }
      }
      else{
        return false; //were all good.
      }
    }

    if(errorHandler(err, {"message":"Had trouble connecting."})){return;}

    client.query(query,function(err,result){

      if (errorHandler(err,{"message":"There was a problem with the query.", "query":query} )){
        andAnotherThing(err, null); // return the error on an error.
        return;
      }
      done(client);
      andAnotherThing(null, result); //All is good, no error found, move out.
    }); // end of client query.
  });//the last of the connect scope.
};//

exports.search = {
  name: 'search',
  description: 'I will return an object of results from a database query.',

  inputs:{
    q:{required:false}
  },

  outputExample:{
    "results":"query"
  },

  run: function(api, connection, next){

    var query = "SELECT * FROM recipes";

    databaseConnect(query, function(err, output){
      if (output){
        connection.response.query = query;
        connection.response.rows = output.rows;
      }
      next();
    });

  }

};

exports.getListOfRecipes = {
  name:"getListOfRecipes",
  description: "I return the full list of all recipes without ingredients and directions.",
  inputs: {},
  run: function(api,connection,next){
    databaseConnect("SELECT * FROM recipes", function(err,recipes){
      if (err){
        connection.response.error = err;
        next();
      }
      else{
        connection.response = recipes.rows;
        next();
      }
    }); // end of first database connection
  }
}

exports.getListOfIngredientsForRecipe = {
  name:"getListOfIngredientsForRecipe",
  description: "I return the list of ingredients for a given recipe id.",
  inputs: {
    id: {required:true}
  },
  run: function(api,connection,next){
    var recipe_id = connection.params.id;

    var query =
    "SELECT * FROM ingredients AS ing, recipeingredientlist AS list WHERE ing.id = list.ingredient_id AND list.recipe_id= "+recipe_id;

    databaseConnect(query, function(err,result){
      if (err){
        connection.response.error = err;
        next();
      }
      else{
        connection.response = result.rows;
        next();
      }
    });
  }
}

exports.getListOfDirectionsForRecipe = {
  name:"getListOfDirectionsForRecipe",
  description:"I return the list of directions for a given recipe id.",
  inputs: {
    id: {required:true}
  },
  run: function(api,connection,next){
    var recipe_id = connection.params.id;

    var query = "SELECT * FROM recipedirectionslist WHERE recipe_id=" + recipe_id + " ORDER BY steporder";
    databaseConnect(query, function(err,result){
      if (err){
        connection.response.error = err;
        next();
      }
      else{
        connection.response = result.rows;
        next();
      }
    });
  }
}
exports.findIngredientIdFromName = {
  name:"findIngredientIDFromName",
  description: "I search the ingredients table and see if an ingredint exists, and if it does, I return its id.",
  inputs:{
    name:{required:true}
  },
  run: function(api,connection,next){
    var searchName = connection.params.name;

    searchName = "'%"+searchName+"%'"; //format query;

    query = "SELECT id FROM ingredients WHERE UPPER(name) LIKE " + searchName.toUpperCase();

    databaseConnect(query, function(err, result){
      if(err){
        connection.response.error = err;
        next();
      }
      else{
        if (result.rows.length === 0){
          var errText = "The query ( " + connection.params.name + " ) was not found in the Ingredients Database.";
          var newError = new Error(errText);
          connection.response.error = errText;
          next(newError);
        }
        else{
          connection.response = result.rows;
          next();
        }
      }
    });
  }
}

exports.addIngredientToRecipe = {
  name:"addIngredientToRecipe",
  description: "I add an Ingredient to a recipe selected by the id.",
  inputs:{
    id:   {required:true},
    name: {required:true},
    qty:  {required:true},
    unit: {required:false},
    note: {required:false}
  },
  run: function(api,connection,next){
    var recipe_id     = connection.params.id;
    var ing_quantity  = connection.params.qty;
    var ing_unit      = connection.params.unit;
    var ing_name      = connection.params.name;
    var ing_note      = connection.params.note;

    var listQuery = function(){
      var string = "INSERT INTO recipeingredientlist ()"
    };
  }
}
