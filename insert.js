var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8000;

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "powerful",
  database: "stuff"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var server = http.createServer (function (req, res) {

  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/':
      sendFile(res, 'public/index.html')
      break
    case '/index.html':
      sendFile(res, 'public/index.html')
      break
    case '/js/scripts.js':
      sendFile(res, 'public/js/scripts.js')
      break
    case '/stuff':
      if(req.method == "POST"){
        handle_post(req);
      } else if (req.method == "GET"){
        handle_get(req, res);
      }
      break
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')

// subroutines
// NOTE: this is an ideal place to add your data functionality

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })

}

function handle_get(req, res){
  // turn DB into object that can be sent to the client

  var query = con.query('select * from stuff', function(err, result){
    if(err){
      console.log(err);
      return;
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(result));
    res.end();
    //console.log(result);
  });

}

function handle_post(req){
    var body = '';
    var arr = [];
    var type = '';
    req.on('data', function (data) {
        body += data;
        arr = body.split(',');
        type = arr.pop();

        if(type == "add"){
          handle_add(arr);
        } else if (type == "modify"){
          handle_modify(arr);
        } else if (type == "delete"){
          handle_delete(arr);
        } else {
          console.log("ERROR: Invalid operation on the database");
        }
    });
    req.on('end', function () {
        console.log('end');
    });
}

function handle_add(arr){

  var data = {
    author: arr[0],
    title: arr[1],
    body: arr[2]
  };

  var query = con.query('insert into stuff set ?', data, function(err, result){
    if(err){
      console.log(err);
      return;
    }

    console.log(result);
  });

}

function handle_delete(arr){
  var title = arr[0];

  var query = con.query('delete from stuff where title = ?', title, function(err, result){
    if(err){
      console.log(err);
      return;
    }

    console.log(result);
  });

}

function handle_modify(arr){
  var author = arr[0];
  var title = arr[1];
  var body = arr[2];
  var new_title = arr[3];

  var query_string = 'update stuff set author = ?, title = ?, body = ? where title = ?';

  var query = con.query(query_string, [author, new_title, body, title], function(err, result){
    if(err){
      console.log(err);
      return;
    }

    console.log(result);
  });

}
