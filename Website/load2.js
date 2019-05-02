var mysql=require("mysql");

var con=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'1Mysql_!',
	database:'mydb'
});

var locations;

con.connect(function(err){
	if(err) throw err;
    console.log("Connected...!!");
    
    con.query("SELECT * from markers", function(err,result) {
        locations=result;
    });
});

function initMap() {
    var map=new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 22.713527, lng: 75.855961}
    });

    var markers=locations.map(function(location, i){
        return new google.maps.Marker({
            position : location,
        });
    });

    var markerCluster=new MarkerClusterer(map, markers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}