var pg = require('pg');
var openshift_DB_host = process.env.OPENSHIFT_POSTGRESQL_DB_HOST;
var openshift_DB_port = process.env.OPENSHIFT_POSTGRESQL_DB_PORT;
var openshift_DB_user = process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME;
var openshift_DB_pass = process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD;
var openshift_DB_name = process.env.PGDATABASE;
var openshift_DB_url  = process.env.OPENSHIFT_POSTGRESQL_DB_URL;
//var connString = "postgresql://admineie8ym9:pQDGG_EQLTRd@"+openshift_DB_host+":"+openshift_DB_port+"/recipesdb";
//var connString = "postgresql://admineie8ym9:pQDGG_EQLTRd@127.7.190.2:5432/recipedb";
//var connString = "postgresql://admineie8ym9:pQDGG_EQLTRd@127.0.0.1:5432/mytest"

function databaseConnect(_api, _conn, andThen, query){

  var connString = "postgresql://" + openshift_DB_user + ":" + openshift_DB_pass + "@" + openshift_DB_host + ":" + openshift_DB_port + "/recipedb";

  pg.connect(connString, function(err, client, done){

    //lets make an error handler, shall we?
    var isAnError = function(error,message, obj){
      if (!error){ return false; }; // No harm. no fowl, moving on.
      else{

        if (client){ done(client); }// hmm, there was a problem, lets move everyone out of the door

        _conn.response.error = {
          "errorMessage":message,
          "error":error,
          "moreDetails":obj
        } //let us notify the proper authorities.
        console.log("There was an error. \n", err); // also a nice console out for good measure.
        andThen();
        return true;
      }
    }; //end of error handler scope.

    if (isAnError(err,"Could not make a connection.")) { return; } //Now we use the error handler, and if it turns out to be bad, we quit

    //if we get to here, we know that atleast we could connect.
    client.query(query, function(err, result){
      if(isAnError(err, "There was a problem with the query.",{"query":query})){ return;} //cover our ass.
      //Great success.
      done();
      //if we get to here, the request returned... something...
      _conn.response.rows = result.rows;
      andThen();
    }); // end of query

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

    databaseConnect(api,connection,next,"SELECT 1 + 5 AS number");

  }

};
