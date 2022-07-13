<?php

include("config.php");

$data = json_decode(file_get_contents('php://input'), true);

if ($data["action"] == "load") {
  return loadData();
}
else if ($data["action"] == "insert") {
  return insertData($data);
}
else if ($data["action"] == "update") {
  return updateData($data);
}
else if ($data["action"] == "delete") {
  return deleteData($data);
}



function loadData(){
  $query = 'SELECT * FROM items ORDER BY id'; 
  $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE); 

  $result = $conn->query($query); 

  $items = array();	

  while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
    $item_id = $row['id'];
    $item_name = $row['name'];
    $item_address= $row['address']; 
    $item = array('id' => $item_id, 'name' => $item_name, 'address' => $item_address);
    array_push($items, $item);
  }

  $response = array('items' => $items, 'type' => 'load');

  echo json_encode($response);		
}


function insertData($data){
  $query = 'INSERT INTO items (name, address) VALUES ("'.$data["name"] .'", "'.$data["address"] .'")';
  $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);

  $conn->query($query);

  $query = 'SELECT * FROM items WHERE id="'.$conn->insert_id.'"';
  $result = $conn->query($query); 

  $row = $result->fetch_array(MYSQLI_ASSOC);
  $item_id = $row['id'];
  $item_name = $row['name'];
  $item_address= $row['address']; 
  $item = array('id' => $item_id, 'name' => $item_name, 'address' => $item_address);
  $response = array('item' => $item, 'result' => 'done');
  echo json_encode($response);
}


function updateData($data){}


function deleteData($data){
  $query = 'DELETE FROM items WHERE id="'.$data["id"].'"';
  $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);

  $conn->query($query);

  $result = array('type' => 'delete', 'result' => 'done');
  echo json_encode($result);
}
?>
