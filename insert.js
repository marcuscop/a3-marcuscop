var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8000;

  const {Pool, Client} = require('pg');
  const connectionString = 'postgres://ybbgcyonkhxfkh:b050728e57088416717e0e22e004fe9525308d4ce83d7a157c0fd74af3c1810f@ec2-174-129-32-37.compute-1.amazonaws.com:5432/d303imgiddvnf9';

  const client = new Client({
    connectionString: connectionString,
  })


/*
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

*/

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
//console.log('listening on 8080')

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
  // turn DB into object that can be sent to the pool
  client.connect();
  var query_string = "select * from stuff";
  client.query(query_string, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(result.rows));
    res.end();
    console.log(result.rows);
    client.end();
  })

  /*var query = con.query('select * from stuff', function(err, result){
    if(err){
      console.log(err);
      return;
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(result));
    res.end();
    //console.log(result);
  });*/

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
  client.connect();
  var query_string = "INSERT INTO stuff (author, title, body) values ('" + arr[0] + "','" + arr[1] + "','" + arr[2] + "')";
  console.log(query_string);
  client.query(query_string, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    console.log(result);
    client.end();
  })

/*
  var query = con.query('insert into stuff set ?', data, function(err, result){
    if(err){
      console.log(err);
      return;
    }

    console.log(result);
  });
  */

}

function handle_delete(arr){
  var title = arr[0];

  var query_string = "DELETE FROM stuff WHERE title = '" + arr[0] + "'";
  console.log(query_string);
  client.connect();
  client.query(query_string, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    console.log(result);
    client.end();
  })

  /*
  var query = con.query('delete from stuff where title = ?', title, function(err, result){
    if(err){
      console.log(err);
      return;
    }

    console.log(result);
  });
  */
}


function handle_modify(arr){
  var author = arr[0];
  var title = arr[1];
  var body = arr[2];
  var new_title = arr[3];

  var query_string = "UPDATE stuff SET author = '" + author + "',title = '" +new_title+ "',body = '" + body + "' WHERE title = '" + title + "'";
  console.log(query_string);
  client.connect();
  client.query(query_string, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    console.log(result);
    client.end();
  })

  /*
  var query_string = 'update stuff set author = ?, title = ?, body = ? where title = ?';
  var query = con.query(query_string, [author, new_title, body, title], function(err, result){
    if(err){
      console.log(err);
      return;
    }

    console.log(result);
  });
  */

}
