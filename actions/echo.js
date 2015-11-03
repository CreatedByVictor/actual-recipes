exports.echo = {
  name: 'echo',
  description: 'I will return what I am told',

  inputs:{
    id:{required:false}

  },

  outputExample:{
    "output":"Hello World",
  },

  run: function(api, data, next){
    var resp = data.params.id;
    data.response.output = resp;

    next();
  }
};
