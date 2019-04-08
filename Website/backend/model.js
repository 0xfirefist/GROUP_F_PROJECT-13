var mysql = require('mysql')
var fs = require('fs');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'map',
  password : 'musicmaps',
  database : 'data'
});
connection.connect()


module.exports = {
	place : function(res) {
		var place_data;
		connection.query('SELECT * FROM location', function (err, rows, fields) {
			place_data = rows;		  	
			res.send(place_data);
		});
	},
	addplace : function(lat,lon,locationName,shortDesc){
		var values = [[lat,lon,locationName,shortDesc]]
		var count;
		connection.query('SELECT COUNT(*) as count  FROM location where latitude like '+lat+' and longitude like '+lon, function (err, rows) {
			if(err) throw err 
			count = rows[0].count
		})
		if(count==0){
			connection.query('INSERT INTO location (latitude,longitude,name,description) VALUES ?',[values],function (err){
				if(err) throw err
		})}
	},
	deleteplace : function(req,res){
		if(req.query.lat!=undefined || req.query.lon!=undefined)
		connection.query('DELETE FROM location WHERE latitude LIKE $req.query.lat AND longitude LIKE $req.query.lon', function (err){
			if(err) throw err;
			res.send('done')
			fs.unlink('/blog/'+req.query.lat+'_'+req.query.lon+'.html')
			fs.unlink('/Images/'+'insImage_'+req.query.lat+'_'+req.query.lon+'.jpg')
			fs.unlink('/Images/'+'locImage_'+req.query.lat+'_'+req.query.lon+'.jpg')
		});
		else
			res.send('enter lon and lat to delete')
	}
}



