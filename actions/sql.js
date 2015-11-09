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
        console.log("Error:",isAnError);
        if (obj){
          console.log(obj);
        };
        if (client){
          done(client);
        }
        if (andAnotherThing){
          andAnotherThing(err, undefined);
        }
        return true;
      }
      else{
        return false; //were all good.
      }
    }

    if(errorHandler(err, {"message":"Had trouble connecting."})){return;}

    client.query(query,function(err,result){

      if (errorHandler(err,{"message":"There was a problem with the query.", "query":query} )){
        return;
      }

      var rows = result.rows;

      andAnotherThing(err, rows);
    });
  });//the last of the connect scope.
};

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
        connection.response.rows = output;
      }
      next();
    });

  }

};

exports.recipe = {
  name: "recipe",
  description: "I will return all recipes within the range.",
  inputs: {
    id:{
      required:true,
    }
  },
  run: function(api,connection,next){
    var index = connection.params.id;
    var recipeQuery = "SELECT * FROM recipes WHERE id = "+index;

    databaseConnect(err1, recipeQuery, function(err, recipeOut){
      if (recipeOut && recipeOut[0]){

        //now, lets collect the ingredients.
        var ingredientQuery = "SELECT * FROM recipeingredientlist WHERE recipe_id =" + index;
        databaseConnect(err2, ingredientQuery, function(ingOut){

          //and lastly, lets get all those steps.
          var stepQuery = "SELECT * FROM recipedirectionslist WHERE recipe_id =" + index;
          databaseConnect(err3, stepQuery, function(stepOut){

            var recipeData = recipeOut[0]; // just the first row is needed.
            var ingredientData = ingOut;   // the array of the ingredients and their data.
            var directionsData = stepOut;  // the array of the Steps.

            //directions and ingredients will return undefined if there was an error.

            var outputObject = {
              "recipe_id": recipeData.id,
              "title": recipeData.title,
              "description": recipeData.description,
              "username": recipeData.username,
              "time":{
                "prep":recipeData.preptime,
                "cook":recipeData.cooktime
              },
              "yield": recipeData.yield,
              "link": recipeData.link,
              "ingredients":ingredientData,
              "directions": directionsData
            };

            connection.response.recipe = outputObject;
            console.log("success?");
            next();
          });
        });
      } else {
        connection.response.error = "No recipe found with that id. It should be a whole number and be greater than 0";
        next();
      };
    });

  }
}

exports.getIngredientName = {
  name: "getIngredientName",
  description: "I retrieve the Ingredient name from the db using its id.",
  inputs: {
    id:{required: true}
  },
  run: function(api, connection, next){
    var ingId = connection.params.id;
    var query = "SELECT name FROM ingredients WHERE id="+ingId;
    databaseConnect(query, function(err, rows){
      if (rows && row[0]){
        connection.response.name = rows[0].name;
      }
      else {
        connection.response.error = "Could not retrieve this Ingredient name. Is the id correct?";
        connection.response.param = ingId;
      }
      next();
    });
  }
}