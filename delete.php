
<?php
//delete an event
require 'database.php';

header("Content-Type: application/json"); // We are sending a JSON response
//For HTTP-only Cookies
ini_set("session.cookie_httponly", 1);
session_start();

//Posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

$username = $_SESSION['username'];
$title = $_GET['title'];
$date = $_GET['date'];
$time = $_GET['time'];
$notes = $_GET['notes'];

//Variables can be accessed as such and is equivalent to what I previously did with $_POST['username'] and $_POST['password']

$stmt2 = $mysqli->prepare("DELETE FROM events WHERE title = ?");
if(!$stmt2){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt2->bind_param('s', $title);
$stmt2->execute();
$stmt2->close();
echo json_encode(array(
    "success" => true
));
