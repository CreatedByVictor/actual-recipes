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

    var clientConfig = {
      "user":openshift_DB_user,
      "password":openshift_DB_pass,
      "host":openshift_DB_host,
      "port":openshift_DB_port,
      "database":"recipedb",
      "application_name":"blackoak",
      "ssl":true
    };
    pg.connect(clientConfig,function(err,client,done){
      client.query("SELECT 1 + 1",function(err,result){

        var query = connection.params.q;

        if (err){
          connection.response.error={
            "error":err,
            "query":query;
          };
          done();
          next();
        }
        else{
          connection.response.horse = result.rows;

          client.query()

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

          done();
          next();
        }
      });
    });
  }
};
