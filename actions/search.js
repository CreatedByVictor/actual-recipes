var pg = require('pg');
var openshift_DB_host = process.env.OPENSHIFT_POSTGRESQL_DB_HOST;
var openshift_DB_port = process.env.OPENSHIFT_POSTGRESQL_DB_PORT;
var openshift_DB_user = process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME;
var openshift_DB_pass = process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD;
var openshift_DB_name = process.env.PGDATABASE;
var openshift_DB_url  = process.env.OPENSHIFT_POSTGRESQL_DB_URL;
//var connString = "postgresql://admineie8ym9:pQDGG_EQLTRd@"+openshift_DB_host+":"+openshift_DB_port+"/recipesdb";
//var connString   = "postgresql://admineie8ym9:pQDGG_EQLTRd@127.7.190.2:5432/recipedb";

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

    //var client = new pg.Client(connString);
    /*
    var client = new pg.Client({
      user:"admineie8ym9",
      password: "pQDGG_EQLTRd",
      database:"recipedb",
      host:"127.7.190.2",
      port:"5432"
    });*/

    var query = connection.params.q;
    var output = {
      "host":openshift_DB_host,
      "port":openshift_DB_port,
      "user":openshift_DB_user,
      "pass":openshift_DB_pass,
      "url":openshift_DB_url,
      "db":openshift_DB_name
    };
      connection.response.output = output;
      connection.response.q = query;

    /*
    if(client.connection._events != null)
    {

      client.connect(
        function(err){
          if (err){
            console.error("Could not connect to the database.\n", err);
            connection.response.error={
              "general":"Could not connect to the database.",
              "errorDetails":err,
              "output":output
            };
            next();
          }
          client.query('SELECT *;',function(err,result){
            if (err){
              return console.error("error running query", err);
            }

            connection.response.results = result.rows[0];
            console.log("boop",result.rows);

            client.end();

            next();
          });
        }
      );

    }*/
      next();
  }
};
