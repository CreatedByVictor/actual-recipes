var pg = require('pg');
var openshift_DB_host = process.env.OPENSHIFT_POSTGRESQL_DB_HOST;
var openshift_DB_port = process.env.OPENSHIFT_POSTGRESQL_DB_PORT;
var connString = "postgresql://admineie8ym9:pQDGG_EQLTRd@"+openshift_DB_host+":"+openshift_DB_port+"/recipesdb";

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

    var client = new pg.Client(connString);
    var query = connection.params.q;
    var output = undefined;

    if(client.connection._events != null)
    {
      client.connect(
        function(err){
          if (err){
            console.error("Could not connect to the database.\n", err);
            connection.error="Could not connect to the Database.";
            next();
          }
          client.query('SELECT 1 + 1;',function(err,result){
            if (err){
              return console.error("error running query", err);
            }

            connection.response.results = result.rows;
            console.log("boop",result.rows)

            client.end();

            next();
          });
        }
      );

    }
    else{
      console.error("preexisting connection?");
      next();
    }
  }
};
