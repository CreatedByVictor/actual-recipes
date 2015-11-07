var pg = require('pg');
var openshift_DB_host = process.env.OPENSHIFT_POSTGRESQL_DB_HOST;
var openshift_DB_port = process.env.OPENSHIFT_POSTGRESQL_DB_PORT;
var openshift_DB_user = process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME;
var openshift_DB_pass = process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD;
var openshift_DB_name = process.env.PGDATABASE;
var openshift_DB_url  = process.env.OPENSHIFT_POSTGRESQL_DB_URL;

function databaseConnect(_api, _conn, andThen, query, andAnotherThing){

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
          andAnotherThing(undefined);
        }
        andThen();
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

      andAnotherThing(rows);
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
    /*
    var connectionString = connString;
    pg.connect(connectionString, function(err, client, done) {

      var handleError = function(err) {
       // no error occurred, continue with the request
       if(!err) return false;

       // An error occurred, remove the client from the connection pool.
       // A truthy value passed to done will remove the connection from the pool
       // instead of simply returning it to be reused.
       // In this case, if we have successfully received a client (truthy)
       // then it will be removed from the pool.
       if(client){
         done(client);
       }
       connection.response.result = {"error message":"An error occured.","error":err};
       console.log("an error occured \n", err);
       next();
       return true;
    };

    if(handleError(err)){ return;}

    client.query('SELECT 1 + 5 AS number', function(err, result) {
      if (err){
        done(client);
        console.log("There was a problem with the query \n", err);
        next();
      }
      else{
        done();  // client idles for 30 seconds before closing
        connection.response.result = result.rows[0].number;
        console.log("Success.");
        next();
      }
    });
  });
  */
  //Big test below.

    var query = "SELECT * FROM recipes";

    databaseConnect(api,connection,next,query, function(output){
      if (output){
        connection.response.query = query;
        connection.response.rows = output;
        next();
      }
    });

  }

};
