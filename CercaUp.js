/**
 * Docs: http://docs.stamplay.com/#code-blocks
 *  
 * WARNING: your code must stay inside module.exports
 * TEST: Save and click the "Snippet" tab to see how to execute this as an API
 */
module.exports = function(context, cb) {
var http = require('http');
var https = require('https');
var zlib = require('zlib');
  
var key = context.secrets.key;
//E' l'API_key per l'accesso alle API di Google Maps
  
var addr = encodeURI(context.data.address);
var path = "/maps/api/geocode/json?address=" + addr + "&key=" + key;


function getCoordinate(callback) {
    return https.get({
        host: 'maps.googleapis.com',
        path: path
    }, 
    function(response) {
        var body = '';
        response.on('data', function(d) {
          console.log(d);  
          body += d;
        });
        response.on('end', function() {
          callback(body);
      });
  });
}

function getUP(location, callback) {
  var lat = location.lat;
  var lon = location.lng;
  var host = "postemaps.appspot.com";
  var path = "/sharedpys/getUPbyDistanceKM?lat="+lat+"&lng="+lon+"&distance=" + context.data.distance;  
  return http.get({
      headers: {
          'Accept-Encoding': 'deflate',
          'Accept-Language': 'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
          'Accept': '*/*',
          'Referer': 'http://postemaps.appspot.com/maps/',
          'Cookie': '__utmt=1; __utma=89295130.1378992015.1473762420.1473947544.1474014694.3; __utmb=89295130.1.10.1474014694; __utmc=89295130; __utmz=89295130.1474014694.3.3.utmcsr=poste.it|utmccn=(referral)|utmcmd=referral|utmcct=/online/cercaup/',
          'Connection': 'keep-alive'
        },
        host: host,
        path: path
    },
    function(response) {
      var body2 = '';
        response.on('data', function(d2) {
            body2 += d2;
        });
        response.on('end', function() {

              callback(body2);

      });
  });
}

function firstCb(data){
    var location = JSON.parse(data).results[0].geometry.location;
  cercaUp(location);
}

function cercaUp(loc) {
    getUP(loc, myCb);
}
function myCb(d){
    var aaa = JSON.parse(d);
  cb(null, {data: aaa});
}
  
getCoordinate(firstCb);

} ;










