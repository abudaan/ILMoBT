<?php

$contentType = explode(';', $_SERVER['CONTENT_TYPE']); // Check all available Content-Type
$rawBody = file_get_contents("php://input"); // Read body
$data = array(); // Initialize default data array

if(in_array('application/json', $contentType)) { // Check if Content-Type is JSON
  $data = json_decode($rawBody); // Then decode it
} else {
  parse_str($data, $data); // If not JSON, just do same as PHP default method
}

// $json = $_POST['json'];
// /* sanity check */
// if (json_decode($json) != null) {
//   $file = fopen('new_map_data.json','w+');
//   fwrite($file, $json);
//   fclose($file);
// }

$id = uniqid();
$file = fopen($id . '.json','w+');
fwrite($file, $json);
fclose($file);

header('Content-Type: application/json; charset=UTF-8');
echo json_encode(array( // Return data
  'id' => $id
));