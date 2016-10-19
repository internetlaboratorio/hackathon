module.exports = function(context, cb) {
var http = require('http');
var https = require('https');
var zlib = require('zlib');

var key = context.secrets.key;
var addr = encodeURI(context.data.address);
var distance = context.data.distance;
var path = "/maps/api/geocode/json?address=" + addr + "&key=" + key;

function getCoordinate(callback) {
    return https.get({
      host: 'maps.googleapis.com',
      path: path
    },
    function(response) {
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
      callback(body);
   });
});
}

function getPuntiSconti(location) {
  var y = location.lat;
  var x = location.lng;
  var host = "www.geocms.it";
  var path = "/Server/servlet/S3JXServletCall?parameters=method_name%3DGetObject%26callback%3DparseData%26id%3D1%26maxResult%3D100%26distanza%3D" + distance + "%26query%3D%255BMERCH_STATE%255D!%253D%255BVV%255D%26y%3D" + y + "%26x%3D" + x + "%26licenza%3Dgeo-posteitalianespa%26progetto%3DEsercenti%26frontend%3Dapiv3";

  return https.get({
    headers: {
    'Accept-Encoding': 'deflate',
    'Accept-Language': 'it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
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
      eval(body2);
    });
  });
}

function parseData (jsonData, p1, p2){
  if(jsonData == ""){
    cb(null, {data: "Nessun risultato trovato"});
  } else {
    var obj = JSON.parse(jsonData);
    cb(null, {data: obj});
  }
}

function firstCb(data){
  var location = JSON.parse(data).results[0].geometry.location;
  getPuntiSconti(location);
}

getCoordinate(firstCb);

};