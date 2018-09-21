// "mysql": "^2.16.0",


function send(data, type){ // type is the type of operation (add, delete, or modify)
  console.log("sending post request");
  data.push(type);
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = handle_res
  xhr.open("POST", "/stuff", true);
  xhr.send(data);

  function handle_res(){
    if(this.readyState != 4) return;
    if(this.status != 200){
      console.log("ERROR: State 4 of request");
    }
  }

}

function handle_add(){
  var type = 'add';
  var data = [];
  //var data = ["Ben", "How to Live", "Lol"];

  // populate data with data from user
  var x = document.getElementById("form1");
  data[0] = x.elements[0].value;
  data[1] = x.elements[1].value;
  data[2] = x.elements[2].value;

  send(data, type);
}

function handle_delete(){
  var type = 'delete';
  var data = [];
  //var data = ["How to Live"];

  // populate data with data from user
  var x = document.getElementById("form3");
  data[0] = x.elements[0].value;

  send(data, type);
}

function handle_modify(){
  var type = 'modify';
  var data = [];
  //var data = ["Dave", "How to Live", "the start", "F bruv"];

  // populate data with data from user
  var x = document.getElementById("form2");
  data[0] = x.elements[1].value;
  data[1] = x.elements[0].value;
  data[2] = x.elements[3].value;
  data[3] = x.elements[2].value;

  send(data, type);
}

function get(){
  console.log("sending get request");
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = handle_res
  xhr.open("GET", "/stuff");
  //xhr.responseType = 'json';
  xhr.send();

  var data = [];
  function handle_res(){
    if(this.readyState != 4) return;
    data = JSON.parse(this.responseText);
    // print the data
    print(data);

    if(this.status != 200){
      console.log("ERROR: State 4 of request");
    }
  }



}

function print(data){
  var i, j;
  var table = document.getElementById("myTable")
  //console.log(table.rows.length);
  var row;

  for (i=0; i<=data.length; i++){
    if(table.rows.length <= data.length){
      row = table.insertRow();
      row.insertCell();
      row.insertCell();
      row.insertCell();
    }
  }

  while (table.rows.length != data.length+1){
    table.deleteRow(1);
  }

  for(j=1; j<data.length+1; j++){
    table.rows.item(j).cells[0].innerHTML = data[j-1].author;
    table.rows.item(j).cells[1].innerHTML = data[j-1].title;
    table.rows.item(j).cells[2].innerHTML = data[j-1].body;
  }

}
