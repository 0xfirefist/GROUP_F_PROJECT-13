const express = require('express')
const controller = require("./controller.js") // contain functions
const model = require("./model.js")
const multer = require('multer');
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const session = require('express-session')
const port = 3001

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'Images/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '_' + req.body.lat + '_' + req.body.lon + '.jpg');
  }
});

var upload = multer({ storage: storage });
var image = upload.fields([{name :'insImage' ,maxCount:1},{name : 'locImage', maxCount:1}])

app.use(session({
	secret  : '2C44-4D44-WppQ786',
	resave : true,
	saveUninitialized : true
}));

var auth = function(req,res,next){
	if (req.session && req.session.user === 'amy' && req.session.admin){
		console.log(req.session)
		return next()
	}
	else
		res.sendStatus(401);
} 

app.get('/', function(req,res){
	controller.usermap(req,res); // render map to client side
})
app.get('/place',function(req,res){
	model.place(res);	
}) 
app.get('/blog/', function(req,res){
	controller.blog(req,res); // return the blog	
})

///////  admin routing starts now //////
app.get('/admin/', function(req, res){
	controller.admin(req,res);	// login page
});

app.post('/admin/login/',function(req,res){
	controller.adminlogin(req,res) //admin authentication
});

app.post('/admin/add/',[auth,image] ,function(req, res){
	console.log(req.body.name)
	controller.adminadd(req,res); // add data
});

app.get('/admin/edit/',auth ,function(req,res){
	controller.adminedit(req,res); //edit data
});

app.get('/admin/delete/',auth ,function(req,res){
	controller.admindelete(req,res); //delete data
});

app.get('/admin/logout/',auth ,function(req,res){
	controller.adminlogout(req,res); //logout data
});
//// static files
app.use('/Images/',express.static(__dirname +'/Images'))
app.use('/admin/Images/',express.static(__dirname +'/Images'))
app.listen(port, () => console.log(`The app is listening on port ${port}!`))
