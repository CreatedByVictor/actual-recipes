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

var db = pgp(connectionObject);

//
//  Lists
//
exports.listAllRecipes = {
  name:"listOfRecipes",
  description: "I return the full list of all recipes without ingredients and directions.",
  inputs: {},
  run: function(api,connection,next){

    var recipe_array = [];
    var direction_array = [];
    var ingredient_array = [];
    var ingredient_master_array = [];
    var masterRecipes = [];

    db.many("SELECT * FROM recipes")
      .then(function(data){
        connection.response = data;
        next();
      })
      .catch(function(error){
        var message = "Had trouble getting a list of all the recipes.";
        connection.response.error = {
          "message": message,
          "evidence": error
        };
        next(new Error(message));
      });

  }
}
exports.listAllIngredients = {
  name:"listAllIngredients",
  description:"I return the current contents of the Ingredients database.",
  inputs:{},
  run: function(api, connection, next){
    db.query("SELECT * FROM ingredients")
      .then(function(data){
        connection.response = data;
        next();
      })
      .catch(function(error){
        connection.response.error = error;
        next( new Error(error));
      });
  }
}
//
//  Searches
//
exports.search = {
  name: 'search', //not fully implemented
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
  }

};
//Search is Not fully implemented.
exports.findIngredientIdFromName = {
  name:"findIngredientIdFromName",
  description: "I search the ingredients table and see if an ingredients exists or if one is similar, and if one of these thing is, I return its id and name.",
  inputs:{
    name:{required:false}
  },
  run: function(api,connection,next){
    var searchName = connection.params.name;
    searchName = "'%"+searchName+"%'"; //format query;
    var query = "SELECT id, name FROM ingredients WHERE UPPER(name) LIKE " + searchName.toUpperCase();
    db.query(query)
      .then(function(data){
        connection.response = data;
        next();
      })
      .catch(function(error){
        var message = "Had trouble getting a list of all the recipes.";
        connection.response.error = {
          "message": message,
          "evidence": error
        };
        next(new Error(message));
      });
  }
}
exports.findRecipeIngredients = {
  name:"findRecipeIngredients",
  description: "I return the list of ingredients and their respective data",
  inputs:{
    ingid:{required:true}
  },
  run: function(api, connection, next){
    var query = "SELECT list.id, list.recipe_id, list.quantity, list.unit, ing.name, list.note FROM ingredients AS ing, recipeingredientlist AS list WHERE list.recipe_id = ${recipe_id} AND list.ingredient_id = ing.id";
    var values = {"recipe_id":connection.params.ingid};
    db.query(query,values).then(function(data){
      connection.response = data;
      next();
    }).catch(function(error){
      var message = "Had trouble finding the list of ingredients associated with the recipe id: " + connection.params.id;
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
exports.findRecipeDirections = {
  name:"findRecipeDirections",
  description:"I return the directions and their order for a given recipe id.",
  inputs:{ recipeid:{required:true}},
  run: function(api, connection, next){
    var recipe_id = connection.params.recipeid;
    var query = "SELECT * FROM recipedirectionslist WHERE recipe_id = ${recipe_id} ORDER BY steporder";
    db.many(query,{"recipe_id":recipe_id}).then(function(data){
      connection.response = data;
      next();
    }).catch(function(error){
      var message = "Had trouble finding the list of directions associated with the recipe id: " + connection.params.id;
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
exports.findRecipesWithIngredient = {
  name:"findRecipesWithIngredient",
  description:"I take an ingredient id and return all recipe ids that include it.",
  inputs:{
    ingid:{required:true}
  },
  run:function(api, connection, next){
    var ingredient_id = connection.params.ingid;
    db.many("SELECT DISTINCT recipe_id FROM recipeingredientlist WHERE ingredient_id = $(ing_id)",{"ing_id":ingredient_id})
    .then(function(data){
      connection.response = data;
      next();
    }).catch(function(error){
      var message = "Had trouble getting a list of all the recipes with the ingredient id: "+ingredient_id;
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
//
//  CREATE
//
exports.addRecipeToDatabase = {
  name:"addRecipeToDatabase",
  description:"I add a new recipe to the database and return its id.",
  inputs:{
    name:         {required:true},
    description:  {required:false},
    yield:        {required:false},
    cooktime:     {required:false},
    preptime:     {required:false},
    author:       {required:false},
    link:         {required:false}
  },
  run:function(api, connection, next){
    var r_name = connection.params.name;
    var r_description = connection.params.description;
    var r_author = connection.params.author;
    var r_yield = connection.params.yield;
    var r_cooktime = connection.params.cooktime;
    var r_preptime = connection.params.preptime;
    var r_link = connection.params.link;

    var query = "INSERT INTO recipes (name, description, username, yield, preptime, cooktime, link) VALUES (${name}, ${description}, ${username}, ${yield}, ${preptime}, ${cooktime}, ${link})";
    var values = {
      "name":r_name,
      "description": r_description,
      "username": r_author,
      "yield": r_yield,
      "preptime":r_preptime,
      "cooktime":r_cooktime,
      "link":r_link
    };

    db.none(query,values).then(function(_){
      var message = "Successfully added the ingredient to the database.";
      connection.response = message;
      next();
    }).catch(function(error){
      var message = "Had trouble removing the ingredient from the ingredients database.";
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
exports.addIngredientToDatabase = {
  name:"addIngredientToDatabase",
  description: "I add a named ingredient to its database table and return the id:name pair that is returned.",
  inputs:{
    name:{required:true}
  },
  run: function(api, connection, next){
    //var newIngName = connection.params.name;
    //var insertNewIngredient = "INSERT INTO ingredients (name) VALUES('" + newIngName +"')";
    //doesIngredintExist  = "SELECT id, name FROM ingredients WHERE UPPER(name) LIKE " + newIngName.toUpperCase();

    var searchName = connection.params.name;
    var formattedName = "'"+searchName+"'"; //format query;

    var doesIngredientExist = "SELECT id, name FROM ingredients WHERE UPPER(name) LIKE " + formattedName.toUpperCase();
    var insertNewIngredient = "INSERT INTO ingredients (name) VALUES('" + searchName + "')";

    db.query(doesIngredientExist).then(
      function(data){
        return {
          "rows":data,
          "length": data.length
        };
      }
    ).then(function(data){
      if (data.length !== 0){
        var message = "There is already an ingredient with the name: " + searchName + " in the database 'ingredients'."
        connection.response.error = {
          "message": message,
          "evidence": data.rows,
        }
        next( new Error(message) );
      }
      else{ // it is safe to add this ingredient
        db.query(insertNewIngredient).then(function(data){
          db.query(doesIngredientExist).then(function(data){
            var message = "Successfuly added ingredient with the name: " + searchName;
            connection.response = {
              "message": message,
              "evidence": data
            }
            next();
          }).catch(function(error){
            var message = "Had trouble verifying that the ingredient with the name: " + searchName + " was added.";
            connection.response.error = {
              "message": message,
              "evidence": error
            }
            next( new Error(message));
          });
        }).catch(function(error){
          var message = "Had trouble inserting the ingredient with the name: " + searchName + " to the database.";
          connection.response.error = {
            "message": message,
            "evidence": error
          }
          next( new Error(message));
        });
      }
    }).catch(function(error){
      var message = "Had trouble checking for a duplicate ingredient with the name: " + searchName;
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next( new Error(message));
    });
  }
}
exports.addIngredientToRecipe = {
  name:"addIngredientToRecipe",
  description: "I add an Ingredient to a recipe selected by the id.",
  inputs:{
    recipeid: {required:true},
    name:     {required:false},
    qty:      {required:true},
    ingid:    {required:false}, //Either ingid or name is required here. the id will be given priority if both are present.
    unit:     {required:false},
    note:     {required:false}
  },
  run: function(api,connection,next){
    var recipe_id     = connection.params.recipeid;
    var ing_quantity  = connection.params.qty;
    var ing_unit      = connection.params.unit || null;
    var param_ing_id  = connection.params.ingid;
    var ing_note      = connection.params.note || null;
    var insertQuery   = "INSERT INTO recipeingredientlist (recipe_id, ingredient_id, quantity, unit, note) VALUES( ${recipe_id}, ${ing_id}, ${ing_quantity}, ${ing_unit}, ${ing_note})";
    var ing_name = connection.params.name;

    var getIngredientIdQuery = "SELECT id, name FROM ingredients WHERE UPPER(name) LIKE ${ing_name}";

    if (param_ing_id === undefined){
      db.query(getIngredientIdQuery,{"ing_name" : ing_name.toUpperCase()}).then(function(data){
        var ing_id = data[0].id;
        var values = {
          "recipe_id":recipe_id,
          "ing_id": ing_id,
          "ing_quantity": ing_quantity,
          "ing_unit": ing_unit,
          "ing_note": ing_note
        };
        console.log("ing_name", ing_name);
        db.none(insertQuery,values).then(function(data){
          var message = "Successfuly added a new ingredient to the list associated with recipe_id: " +recipe_id;
          connection.response = message;
          next();
        }).catch(function(error){
          var message = "Had trouble adding a new ingredient to the list associated with recipe_id: " + recipe_id;
          connection.response.error = {
            "message": message,
            "evidence": error
          };
          next(new Error(message));
        });
      }).catch( function(error){
        var message = "Had trouble finding the id of the ingredient named " + ing_name;
        connection.response.error = {
          "message": message,
          "query":getIngredientIdQuery,
          "evidence": error
        };
        next(new Error(message));
      });
    }
    else if (param_ing_id !== undefined){
      var values = {
        "recipe_id":recipe_id,
        "ing_id": param_ing_id, //here, we are using the defined value
        "ing_quantity": ing_quantity,
        "ing_unit": ing_unit,
        "ing_note": ing_note
      };
      db.none(insertQuery, values).then(function(data){
        var message = "Successfuly added a new ingredient to the list associated with recipe_id: " +recipe_id;
        connection.response = message;
        next();
      }).catch(function(error){
        var message = "Had trouble adding a new ingredient to the list associated with recipe_id: " + recipe_id;
        connection.response.error = {
          "message": message,
          "evidence": error
        };
        next(new Error(message));
      });
    }
    else{
      var message = "This Action requires either an 'ingid' or 'name' in order to function."
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    }
  }
}
exports.addStepToRecipe = {
  name:"addStepToRecipe",
  description:"I add a step to the directions of a recipe with a given id.",
  inputs:{
    recipeid:{required:true},
    order:{required:true},
    text:{required:true}
  },
  run: function(api, connection, next){
    var step_text  = connection.params.text;
    var step_order = connection.params.order;
    var recipe_id  = connection.params.recipeid;

    var order = "INSERT INTO recipedirectionslist (recipe_id, steporder, text) VALUES(${recipe_id} ${step_order} ${step_text})";
    var values = {
      "recipe_id":recipe_id,
      "step_order":step_order,
      "step_text":step_text
    };

    db.many(order,values).then(function(data){
      var message = "Successfully inserted this step data into the directions of the recipe with the id of: " + recipe_id;
      connection.response = {
        "message": message
      };
      next();
    }).catch(function(error){
      var message = "Had trouble inserting this step data into the directions of the recipe with the id of: " + recipe_id;
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
//
//  DELETE
//
exports.removeRecipeFromDatabase = {
  name:"removeRecipeFromDatabase",
  description:"I remove a recipe, its ingredients, and directions from the database given the recipe id.",
  inputs:{
    recipeid:{required:true}
  },
  run:function(api, connection, next){
    var recipe_id = connection.params.recipeid;
    db.none("DELETE FROM recipes WHERE id = ${recipe_id}",{"recipe_id":recipe_id}).then(function(_){
      db.none("DELETE FROM listRecipeDirections WHERE recipeid = ${recipe_id}", {"recipe_id":recipe_id}).then(function(_){
        db.none("DELETE FROM listRecipeIngredients WHERE recipeid = ${recipe_id}", {"recipe_id":recipe_id}).then(function(_){
          var message = "Successfully removed everything associated with recipe id: " + recipe_id;
          connection.response = {
            "message": message,
          };
          next();
        }).catch(function(error){
          var message = "Had trouble removing the ingredients associated with recipe id: " + recipe_id;
          connection.response.error = {
            "message": message,
            "evidence": error
          };
          next(new Error(message));
        })
      }).catch(function(error){
        var message = "Had trouble removing the directions associated with recipe id: " + recipe_id;
        connection.response.error = {
          "message": message,
          "evidence": error
        };
        next(new Error(message));
      })
    }).catch(function(error){
      var message = "Had trouble removing the recipe with the id: " + recipe_id;
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
exports.removeIngredientFromRecipe = {
  name:"removeIngredientFromRecipe",
  description:"I take a recipeingredientList id and remove it from the database.",
  inputs:{
    inglistid:{required:true}
  },
  run: function(api, connection, next){
    var r_ing_id = connection.params.inglistid;
    db.none("DELETE FROM recipeingredientlist WHERE id = ${id}",{"id":r_ing_id})
    .then(function(_){
      var message = "Successfully removed the ingredient from its list in the database.";
      connection.response = message;
      next();
    }).catch(function(error){
      var message = "Had trouble removing the ingredient with the id: " + r_ing_id;
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
exports.removeStepFromRecipe = {
  name:"removeStepFromRecipe",
  description:"I take a recipedirectionslist id and remove it from the database.",
  inputs:{
    stepid:{required:true}
  },
  run: function(api, connection, next){
    var r_step_id = connection.params.stepid;
    db.none("DELETE FROM recipedirectionslist WHERE id = ${id}",{"id":r_step_id})
    .then(function(_){
      var message = "Successfully removed the step from its list in the database.";
      connection.response = message;
      next();
    }).catch(function(error){
      var message = "Had trouble removing the step with the id: " + r_step_id;
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
exports.removeIngredientFromDatabase = {
  name:"removeIngredientFromDatabase",
  description:"I take an ingredient id and remove said ingredient from the database as well as in every instance of its use in any recipe in the database.",
  inputs:{
    ingid:{required:true}
  },
  run: function(api,connection,next){
    var ing_id = connection.params.ingid;
    db.none("DELETE FROM ingredients WHERE id = ${id}",{"id":ing_id}).then(function(_){
      db.none("DELETE FROM recipeingredientlist WHERE ingredient_id = ${id}",{"id":ing_id}).then(function(_){
        var message = "Successfully removed the ingredient and everywhere it was used in the database.";
        connection.response = message;
        next();
      }).catch(function(error){
        var message = "Ingredient removed, however I had trouble removing the ingredient from recipies in which it occued.";
        connection.response.error = {
          "message": message,
          "evidence": error
        };
        next(new Error(message));
      });
    }).catch(function(error){
      var message = "Had trouble removing the ingredient from the ingredients database.";
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
//
//  UPDATE
//
exports.updateRecipe = {
  name:"updateRecipe",
  description:"I update a recipe with a given id, with new data.",
  inputs:{
    recipeid:     {required:true},
    name:         {required:true},
    description:  {required:false},
    yield:        {required:false},
    cooktime:     {required:false},
    preptime:     {required:false},
    author:       {required:false},
    link:         {required:false}
  },
  run:function(api, connection, next){
    var r_id = connection.params.recipeid;
    var r_name = connection.params.name;
    var r_description = connection.params.description;
    var r_author = connection.params.author;
    var r_yield = connection.params.yield;
    var r_cooktime = connection.params.cooktime;
    var r_preptime = connection.params.preptime;
    var r_link = connection.params.link;

    var query = "UPDATE recipes SET name = ${name}, description = ${description}, username = ${username}, yield = ${yield}, preptime = ${preptime}, cooktime = ${cooktime}, link = ${link}) WHERE id = ${r_id}";
    var values = {
      "r_id": r_id,
      "name":r_name,
      "description": r_description,
      "username": r_author,
      "yield": r_yield,
      "preptime":r_preptime,
      "cooktime":r_cooktime,
      "link":r_link
    };

    db.none(query,values).then(function(_){
      var message = "Successfully Updated Recipe.";
      connection.response = {
        "message": message,
      };
      next();
    }).catch(function(error){
      var message = "Had trouble updating the recipe.";
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });

  }
}
exports.updateIngredient ={
  name:"updateIngredient",
  description:"I update an ingredint in the ingredient database",
  inputs:{
    ingid:  {required:true},
    name:   {required:true}
  },
  run:function(api, connection, next){
    var ing_id = connection.params.ingid;
    var ing_name = connection.params.name;
    var values = {
      "name":ing_name,
      "ingid":ing_id
    };
    var query = "UPDATE ingredients SET name = ${name} WHERE id = ${ingid}";
    db.none(query,values).then(function(_){
      var message = "Successfully updated ingredient.";
      connection.response = {
        "message": message,
      };
      next();
    }).catch(function(error){
      var message = "Had trouble updating the specified ingredient.";
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
exports.updateIngredientInRecipe={
  name:"updateIngredientInRecipe",
  description:"I update an ingredient (with a given id) that is also used in a recipe, with new data.",
  inputs:{
    ringid:   {required:true},
    name:     {required:false},
    qty:      {required:false},
    unit:     {required:false},
    note:     {required:false}
  },
  run:function(api, connection, next){
    var r_ing_id =    connection.params.ringid;
    var r_ing_name =  connection.params.name;
    var r_ing_qty =   connection.params.qty;
    var r_ing_unit =  connection.params.unit;
    var r_ing_note =  connection.params.note;

    var query = "UPDATE recipeingredientlist SET name = ${name}, quantity = ${qty}, unit = ${unit}, note = ${note} WHERE id = ${ringid}";
    var values = {
      "name":r_ing_name,
      "qty":r_ing_qty,
      "unit":r_ing_unit,
      "note":r_ing_note,
      "ringid":r_ing_id
    }
    db.none(query,values).then(function(_){
      var message = "Successfully updated ingredient in the list.";
      connection.response = {
        "message": message,
      };
      next();
    }).catch(function(error){
      var message = "Had trouble updating the specified ingredient in the list.";
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
exports.updateStep={
  name:"updateStep",
  description:"I update a Step with a given id, with new data.",
  inputs:{
    stepid: {required:true},
    order:  {required:true},
    text:   {required:true}
  },
  run:function(api, connection, next){
    var r_step_id =     connection.params.stepid;
    var r_step_order =  connection.params.order;
    var r_step_text =   connection.params.text;

    var query = "UPDATE listRecipeDirections SET order = ${order}, text = ${text} WHERE id = ${id}";
    var values = {
      "order":r_step_order,
      "text":r_step_text,
      "id":r_step_id
    };

    db.none(query,values).then(function(_){
      var message = "Successfully updated this step.";
      connection.response = {
        "message": message,
      };
      next();
    }).catch(function(error){
      var message = "Had trouble updating the specified step.";
      connection.response.error = {
        "message": message,
        "evidence": error
      };
      next(new Error(message));
    });
  }
}
