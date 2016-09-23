module.exports = function(context, cb) {
  var http = require('http');
  var https = require('https');
  var zlib = require('zlib');
  var body2 = '';
  var cheerio = require('cheerio@0.19.0');
  
  function getUP(callback) {

    var host = "www.poste.it";
    var path = '/online/dovequando/ricerca.do';
    options = {
       method: "POST",
       host: host,
       path: path,
       headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'deflate',
        'Accept-Language': 'en-US,en;q=0.5', 
        'Connection': 'keep-alive',
        'Cookie': 'JSESSIONID=A542BE6876B12F701289250814BA11C5; WT_FPC=id=4a10f112-c240-4c4b-9ea8-0381aa8c025b:lv=1474283509137:ss=1474282046038; bmuid=82C77698-D46-48B8-8679-26105D1A6730',
        'Host': 'www.poste.it',
        'Referer': 'http://www.poste.it/online/dovequando/ricerca.do',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:38.0) Gecko/20100101 Firefox/38.0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*'
       },
       host: host,
       path: path
   }
    
    var req = http.request(options, function (response) {
        //response.setEncoding('utf8');

        response.on('data', function(d2) {
            body2 += d2;
        });
        response.on('end', function() {
              myCb(body2);
      });
   });
    var postData = ("mpcode1=" + context.data.code + "&mpdate=" + context.data.lapse);
    console.log(postData);
  req.write(postData);
    req.end();
  }
  
  function parsePage(body){
  var outArray = [];
    var $ = cheerio.load(body);
    $('#tabella-0 tbody tr').each(function() {
        tds = $(this).find('td');
        var dove = $(tds[2]).text().replace(/[\n\r\t]+/g, '');
        outArray.push({data: $(tds[0]).text(), stato: $(tds[1]).text(), luogo: dove});
        
    });
    return outArray;
   }
  
  function myCb(b){
    //console.log("BODY", b);
    out = parsePage(b);
    cb(null, {result: out});
  }
  
  getUP(myCb);
  
} ;

