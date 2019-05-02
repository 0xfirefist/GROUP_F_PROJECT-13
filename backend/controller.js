
const model = require('./model.js');
const fs = require('fs');
const { exec } = require('child_process');
function data(name,locationName,insImage,locImage,type,genre,address,description,phoneNumber,youtube,facebook,twitter){
	this.name = name 
	this.locationName = locationName
	this.insImage = "../Images/"+insImage
	this.locImage = "../Images/"+locImage
	this.type = type
	this.genre = genre
	this.address = address
	this.description = description
	this.youtube = youtube
	this.facebook = facebook
	this.twitter = twitter
	this.phoneNumber = phoneNumber
}
module.exports = {
	usermap : function(req,res){
		//model.place(res)
		var filename =  "/home/snowman/Desktop/project/GROUP_F_PROJECT-13/backend/index.html"
		res.sendFile(filename,{dotfiles:'deny'},function(err){
			if(err)
				res.send('some error')
			else
				console.log('sent')
		})
	},
	
	blog : function(req,res){
		var filename  = "/home/snowman/Desktop/project/GROUP_F_PROJECT-13/backend/blog/" + req.query.lat + "_" + req.query.lon + ".html";
		res.sendFile(filename,{dotfiles: 'deny'},function(err){
			if(err)
				res.send("no such blog")
			else
				console.log("sent")
		})
	},

	admin : function(req,res){
		var filename =  "/home/snowman/Desktop/project/GROUP_F_PROJECT-13/backend/logIn.html"
		res.sendFile(filename,{dotfiles:'deny'},function(err){
			if(err)
				res.send('some error')
			else
				console.log('sent')
		})
	},

	adminlogin : function(req, res){
		if (req.body.username==undefined  || req.body.password==undefined) {
			var filename =  "/home/snowman/Desktop/project/GROUP_F_PROJECT-13/backend/logIn.html"
			res.sendFile(filename,{dotfiles:'deny'},function(err){
				if(err)
					res.send('some error')
				else
					console.log('sent')
			})
  		}
		else if(req.body.username === "amy" && req.body.password === "amyspassword") {
    			req.session.user = "amy";
    			req.session.admin = true;
			var filename =  "/home/snowman/Desktop/project/GROUP_F_PROJECT-13/backend/admin.html"
			res.sendFile(filename,{dotfiles:'deny'},function(err){
				if(err)
					res.send('some error')
				else
					console.log('sent')
			})
  		}
		else{
			res.send("wrong credentials");
		}
	},
	
	adminadd : function(req, res){
		var f = req.body
		console.log(req.body)
		var obj = new data(f.name,f.locationName,'insImage_'+f.lat+'_'+f.lon+'.jpg','locImage_'+f.lat+'_'+f.lon+'.jpg',f.type,f.genre,f.address,f.description,f.phoneNumber,f.youtube,f.facebook,f.twitter);
		fs.writeFile('./blog/data.json',JSON.stringify(obj),(err)=>{
			if(!err){
				model.addplace(f.lat,f.lon,f.locationName,f.shortDesc);
				var comm ='mustache data.json blog.mustache > '+req.body.lat+'_'+req.body.lon+'.html'
				exec(comm,{cwd : "/home/snowman/Desktop/project/GROUP_F_PROJECT-13/backend/blog/"},function(){
					res.sendFile("/home/snowman/Desktop/project/GROUP_F_PROJECT-13/backend/blog/"+req.body.lat+"_"+req.body.lon+".html");
				});
			}
			else
				res.send('some error try again');
		});	
	},

	admindelete : function(req, res){
		model.deleteplace(req,res);
	},
	
	adminlogout : function(req,res){
		req.session.admin=false;
		console.log(req.session)
		res.send("logout success")
	}
}
