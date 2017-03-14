/************************ connect with DB ***************************/

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/playground');
db.connection.on("error", function (error) {
 console.log("failed connect with database：" + error);
});
db.connection.on("open", function () {
 console.log("------connection successed！------");
});


/************************ creat new collection ***************************/

var accounts = mongoose.model('accounts', {
	name : {type : String},
	password : {type : String, default: '123456'},
	profile_ids : {type : [String]}
});

var profiles = mongoose.model('profiles', {
	username : {type : String},
	first_name : {type : String},
	last_name : {type : String},
	age : {type : Number},
	gender : {type : String},
	pet_ids : {type : [String]}
});

var pets = mongoose.model('pets', {
	name : {type : String},
	catergory : {type : String},
	age : {type : Number},
	color : {type : String},
	profile_ids : {type : [String]}
});

/************************ test entities ***************************/

// var user = new accounts ({
// 	name : 'yuxinyang',
// 	password : '123'
// });

// user.save(function(error,doc){
//   if(error){
//      console.log("error :" + error);
//   }else{
//      console.log(doc);
//   }
// });

/************************ creat a Express app ***************************/

var express = require('express');
var app = express(); 
app.use(express.static('public'));

//home page
app.get('/', function (req, res) {
  res.sendFile( __dirname + "/" + "index2.html" );
})

//account
app.get('/accounts', function (req, res) {
   	console.log("visit accounts");
   	accounts.find({}, function (error, docs) {
	if(error) {
	   console.log("error :" + error);
	} else {
	   console.log(docs);
	   res.send(docs);
	}
	}); 
})
 
//pet
app.get('/pets', function (req, res) {
   	console.log("visit pets");
   	pets.find({}, function (error, docs) {
	if(error) {
	   console.log("error :" + error);
	} else {
	   console.log(docs);
	   res.send(docs);
	}
	}); 
})
 
//profile
app.get('/profiles', function (req, res) {
   	console.log("visit profiles");
   	profiles.find({}, function (error, docs) {
	if(error) {
	   console.log("error :" + error);
	} else {
	   console.log(docs);
	   res.send(docs);
	}
	}); 
})

//create account
app.get('/create_account', function(req, res) {
  	var name = req.query.name;
  	var password = req.query.password;

  	var account = new accounts ({
		name : name,
		password : password
	});

	account.save(function(error,doc){
	  if(error){
	     console.log("error :" + error);
	  }else{
	     console.log(doc);
	  }
	});

	accounts.find({}, function (error, docs) {
	if(error) {
	   console.log("error :" + error);
	} else {
	   console.log(docs);
	   res.send(docs);
	}
	}); 
  	
})

//create profile
app.get('/create_profile', function(req, res) {
  	var username = req.query.username;
  	var first_name = req.query.first_name;
  	var last_name = req.query.last_name;
  	var age = req.query.age;
  	var gender = req.query.gender;

  	var profile = new profiles ({
		username : username,
	  	first_name : first_name,
	  	last_name : last_name,
	  	age : age,
	  	gender : gender
	});

	profile.save(function(error,doc){
	  if(error){
	     console.log("error :" + error);
	  }else{
	     console.log(doc);
	  }
	});

	profiles.find({}, function (error, docs) {
	if(error) {
	   console.log("error :" + error);
	} else {
	   console.log(docs);
	   res.send(docs);
	}
	}); 

  	
})

//create pet
app.get('/create_pet', function(req, res) {
  	var name = req.query.name;
  	var password = req.query.password;

  	var user = new accounts ({
		name : name,
		password : password
	});

	user.save(function(error,doc){
	  if(error){
	     console.log("error :" + error);
	  }else{
	     console.log(doc);
	  }
	});

	pets.find({}, function (error, docs) {
	if(error) {
	   console.log("error :" + error);
	} else {
	   console.log(docs);
	   res.send(docs);
	}
	}); 
  	
})

/************************** Start Server *******************************/

var server = app.listen(8081, function () {
 
  var port = server.address().port
 
  console.log("IP: http://localhost:%s", port)
 
})
