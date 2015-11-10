//var pg = require('pg');
var q = require('q');
var options = {
    promiseLib: q
};
var pgp = require('pg-promise')(options);

var connectionObject = {
  host: process.env.OPENSHIFT_POSTGRESQL_DB_HOST,
  port: process.env.OPENSHIFT_POSTGRESQL_DB_PORT,
  database: 'recipedb',
  user: process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME,
  password: process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD
};

var db = pgp(connectionObject); //New Hotness.

/*
//var openshift_DB_host = process.env.OPENSHIFT_POSTGRESQL_DB_HOST;
//var openshift_DB_port = process.env.OPENSHIFT_POSTGRESQL_DB_PORT;
//var openshift_DB_user = process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME;
//var openshift_DB_pass = process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD;
//var openshift_DB_name = process.env.PGDATABASE;
//var openshift_DB_url  = process.env.OPENSHIFT_POSTGRESQL_DB_URL;
//Old implmentation
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
      return client.query(query,function(err,result){
        if (errorHandler(err,{"message":"There was a problem with the query.", "query":query} )){
          andAnotherThing(err, null); // return the error on an error.
        }
        else{
          done(client);
          andAnotherThing(null, result); //All is good, no error found, move out.
        }
      }); // end of client query.
    });//the last of the connect scope.
  };//
*/
//promised

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
    db.query(query)
      .then(function(data){
        connection.response = data;
        next();
      })
      .catch(function(error){
        connection.response.error = error;
        next();
      });

    /*
    databaseConnect(query, function(err, output){
      if (output){
        connection.response.query = query;
        connection.response.rows = output.rows;
      }
      next();
    });
    */
  }

};
//promised
exports.getListOfRecipes = {
  name:"getListOfRecipes",
  description: "I return the full list of all recipes without ingredients and directions.",
  inputs: {},
  run: function(api,connection,next){

    db.query("SELECT * FROM recipes")
      .then(function(data){
        connection.response = data;
      })
      .catch(function(error){
        connection.response.error = error;
      });

    /*
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
    */
  }
}
//promised:
exports.getListOfIngredientsForRecipe = {
  name:"getListOfIngredientsForRecipe",
  description: "I return the list of ingredients for a given recipe id.",
  inputs: {
    id: {required:true}
  },
  run: function(api,connection,next){
    var recipe_id = connection.params.id;

    var query = "SELECT * FROM ingredients AS ing, recipeingredientlist AS list WHERE ing.id = list.ingredient_id AND list.recipe_id= "+recipe_id;

    db.query(query)
      .then(function(data){
        connection.response = data;
        next();
      })
      .catch(function(error){
        connection.response.error = error;
        next();
      });
    /*
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
    */
  }
}
//promised:
exports.getListOfDirectionsForRecipe = {
  name:"getListOfDirectionsForRecipe",
  description:"I return the list of directions for a given recipe id.",
  inputs: {
    id: {required:true}
  },
  run: function(api,connection,next){

    var recipe_id = connection.params.id;
    var query = "SELECT * FROM recipedirectionslist WHERE recipe_id=" + recipe_id + " ORDER BY steporder";
    /*databaseConnect(query, function(err,result){
      if (err){
        connection.response.error = err;
        next();
      }
      else{
        connection.response = result.rows;
        next();
      }
    });
    */
    db.query(query)
      .then(function(data){
        connection.response = data;
        next();
      })
      .catch(function(error){
        connection.response.error = error;
        next(new Error("There was an error."));
      });
  }
}
//promised:
exports.findIngredientIdFromName = {
  name:"findIngredientIDFromName",
  description: "I search the ingredients table and see if an ingredients exists or if one is similar, and if one of these thing is, I return its id and name.",
  inputs:{
    name:{required:true}
  },
  run: function(api,connection,next){
    var searchName = connection.params.name;
    searchName = "'%"+searchName+"%'"; //format query;
    var query = "SELECT id, name FROM ingredients WHERE UPPER(name) LIKE " + searchName.toUpperCase();
    /*
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
    */
    db.query(query)
      .then(function(data){
        connection.response = data;
        next();
      })
      .catch(function(error){
        connection.response.error = error;
        next();
      });
      /*
    var result = databaseConnect(query, function(err,result){
      return result;
    });
    connection.response.result = result;
    next();*/
  }
}
//todo:

exports.addIngredientToDB = {
  name:"addIngredientToDB",
  description: "I add a named ingredient to its database table and return the id:name pair that is returned.",
  inputs:{
    name:{required:true}
  },
  run: function(api, connection, next){
    var newIngName = connection.params.name;
    var insertNewIngredient = "INSERT INTO ingredients (name) VALUES(" + newIngName +")";
    var doesIngredintExist  = "SELECT * FROM ingredients WHERE UPPER(name)=" + newIngName.toUpperCase();
    db.query(doesIngredintExist)
      .then(function(data){
        if (data.length = 0){
          db.query(insertNewIngredient)
            .then(function(data){
              connection.response = data;
              next();
            })
            .catch(function(error){
              connection.response.error = error;
              next();
            });
        }
        else{
          return null; //that must exist
        }
      })
      .catch(function(error){
        connection.response.error = error;
        next();
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
    var query = "INSERT INTO "
  }
}
