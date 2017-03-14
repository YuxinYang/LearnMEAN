var MongoClient = require('mongodb').MongoClient;
var ObjectID = require("mongodb").ObjectID;
var DB_CONN_STR = 'mongodb://localhost:27017/cai'; 


/************************ usefull functions **********************************/
var selectData = function(db, request, callback) {  
  //bind collection
  var collection = db.collection(request);

  collection.find().toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    callback(result);
  });
}

var getProfile = function(db, name, password, callback) {  
  var profiles = db.collection('profile');
  var accounts = db.collection('account');
  accounts.findOne({"name":name},function(err,doc){   
    if(err){                                       
      console.log(err);
      return;
    }else if(!doc){                                
      callback('profile not exist');
    }else{ 
      if(password != doc.password){   
        callback('wrong password');
      }else{                                     
        var whereStr2 = {"username": name};
        profiles.find(whereStr2).toArray(function(err, result) {
          if(err)
          {
            console.log('Error:'+ err);
            return;
          }     
          callback(result);
        });  
      }
    }
  });
}


var getOneProfile = function(db, first_name, last_name, callback) {  
  var profiles = db.collection('profile');
  var pets = db.collection('pet');
  var whereStr = { };
  if(first_name == '' && last_name == ''){
    callback("please give a name");
    return;
  }else if(last_name == ''){
    whereStr = {"first_name": first_name};
  }else if(first_name == ''){
    whereStr = {"last_name": last_name};
  }else{
    whereStr = {"first_name": first_name, "last_name": last_name};
  }
  
  profiles.findOne(whereStr, function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    } 
    if(!result){
      callback('profile not exist');
    }else{
      profiles.find(whereStr).toArray(function(err, result) {
        if(err)
        {
          console.log('Error:'+ err);
          return;
        }     
        callback(result);
      });        
    }
  });
}

var getPet = function(db, first_name, last_name, callback) 
{  
  var profiles = db.collection('profile');
  var pets = db.collection('pet');
  var whereStr = { };  
  if(first_name == '' && last_name == '')
  {
    callback("please give a name");
    return;
  }
  else if(last_name == '')
  {
    whereStr = {"first_name": first_name};
  }
  else if(first_name == '')
  {
    whereStr = {"last_name": last_name};
  }
  else
  {
    whereStr = {"first_name": first_name, "last_name": last_name};
  }
      
  profiles.findOne(whereStr, function(err, result) 
  {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    } 
    if(!result)
    {
      callback('profile not exist');
    }
    else
    {
      profiles.find(whereStr).toArray(function(err, result2) 
      {
        if(err)
        {
          console.log('Error:'+ err);
          return;
        }   
        var pet_ids = [];
        for(var j = 0; j < result2.length; j++)
        {
          for(var i = 0; i < result2[j].pet_id.length; i++)
          {
              pet_ids.push(result2[j].pet_id[i].toString());
          }
        }
        console.log(pet_ids); 
        var pet_arr = [];
        for(var i = 0; i < pet_ids.length; i++)
        {
          console.log(pet_ids[i]); 
          var whereStr2 = {"_id": ObjectID("58c2821d89d463dd3217ab7b")};
          // var whereStr2 = {"_id": ObjectID("58c2821d89d463dd3217ab7b")};
          // var whereStr2 = {"name": "Mojo"};
          profiles.findOne(whereStr2, function(err, result3)
          {
            if(err)
            {
              console.log('Error:'+ err);
              return;
            } 
            pet_arr.push(result3);
            callback(result3);
          });
        }          
        // callback(pet_arr);
      });
    }
  });
}
 
/********************************************************************/

var express = require('express');
var app = express();

 
app.use(express.static('public'));

//home page
app.get('/', function (req, res) {
  res.sendFile( __dirname + "/" + "index.html" );
})

//get profile
app.get('/get_profile', function(req, res) {
  var name = req.query.name;
  var password = req.query.password;
  MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("success！");
    getProfile(db, name, password, function(result) {
      res.send(result);
      db.close();
    });
  });  
})


//get one profile
app.get('/get_one_profile', function(req, res) {
  var first_name = req.query.first_name;
  var last_name = req.query.last_name;
  MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("success！");
    getOneProfile(db, first_name, last_name, function(result) {
      res.send(result);
      db.close();
    });
  });  
})
 
//get pet
app.get('/get_pet', function(req, res) {
  var first_name = req.query.first_name;
  var last_name = req.query.last_name;
  MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("success！");
    getPet(db, first_name, last_name, function(result) {
      res.send(result);
      db.close();
    });
  });  
})


/*************************************************************************
**************************** get function ********************************
*************************************************************************/
//try to use just one function, but not succeed
//need to finden a better way
var get_collection = function (col) {
    console.log("visit %s", col);
    MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("success！");
    selectData(db, col, function(result) {
      // console.log(result);
      res.send(result);
      db.close();
    });
  });
}
// app.get('/account', function (req, res) {
//    get_collection('account');
// })

//account
app.get('/account', function (req, res) {
   console.log("visit account");
   MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("success！");
    selectData(db, 'account', function(result) {
      // console.log(result);
      res.send(result);
      db.close();
    });
  });
})
 
//pet
app.get('/pet', function (req, res) {
   console.log("visit pet");
   MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("success！");
    selectData(db, 'pet', function(result) {
      // console.log(result);
      res.send(result);
      db.close();
    });
  });
})
 
//profile
app.get('/profile', function (req, res) {
   console.log("visit profile");
   MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("success！");
    selectData(db, 'profile', function(result) {
      // console.log(result);
      res.send(result);
      db.close();
    });
  });
})

/********************************************************************/
 
 
var server = app.listen(8081, function () {
 
  var port = server.address().port
 
  console.log("IP: http://localhost:%s", port)
 
})