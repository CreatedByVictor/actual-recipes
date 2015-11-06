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
    var connectionString = openshift_DB_url;
    pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT 1 + 5', ['brian@example.com'], function(err, result) {
      connection.response.result.row[0];
      done();  // client idles for 30 seconds before closing
    });
});
  }
};
