var moment = require('moment');
exports.vtlobj = {
  name: 'vtlobj',
  description: 'I will return some basic information about Victor',

  outputExample:{
    "name":{
      "firstName":"Victor",
      "middleName":"Thomas",
      "lastName":"Lawrence",
      "fullName":"Victor Lawrence",
      "previousAliases": ["Viktor Wilczak", "Viktor Crane"]
    },
    "currentAge": {
      "timestamp": "239494223394"
    }
  },

  run: function(api, data, next){
    data.response.name = {
        "firstName":        "Victor",
        "middleName":       "Thomas",
        "lastName":         "Lawrence",
        "fullName":         "Victor Lawrence",
        "previousAliases":   ["Viktor Wilczak", "Victor Crane"]
    };
    data.response.currentAge  = {
      "timestamp" = (new Date().getTime()) - (new Date("November 26, 1986 23:26:00").getTime())
    };

    next();
  }
};
