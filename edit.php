<?php
require 'database.php';
ini_set("session.cookie_httponly", 1);
session_start();
header("Content-Type: application/json");

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);


//Variables can be accessed as such:

  $date = $_POST['date'];
  $month = $_POST['month'];
  $year = $_POST['year'];

$stmt2 = $mysqli->prepare("UPDATE events SET event=?, date=?, month = ?, year = ?, time=? where event = ?");
If(!$stmt2) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt2->bind_param('siiiss', $newName, $day, $month, $year , $newTime, $oldName);
$stmt2->execute();
$stmt2->close();
echo json_encode(array(
    "success" => true
));
exit;
?>
