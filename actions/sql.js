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
        return;
      }
      else{
        connection.response = recipes.rows[];
        next();        
      }
    }); // end of first database connection
  }
}
