<?php
//delete an event
require 'database.php';

header("Content-Type: application/json"); // We are sending a JSON response

ini_set("session.cookie_httponly", 1);
session_start();

$username = $_SESSION['username'];

$eventid = $_POST['eventid'];

$eventdate = substr($eventid, 0, 10);
//echo($eventdate);
$eventitle = substr($eventid, 11);
//echo($eventitle);

$edate = date('Y-m-d', strtotime($eventdate));
//echo($edate);

//Variables can be accessed as such and is equivalent to what I previously did with $_POST['username'] and $_POST['password']

if(!hash_equals($_SESSION['token'], $_POST['token'])){
        die("Request forgery detected");
}

$stmt2 = $mysqli->prepare("DELETE FROM events WHERE title = ? AND date = ? AND user = ?");
if(!$stmt2){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt2->bind_param('sss', $eventitle, $edate, $username);

if (!$stmt2->execute()){
    echo json_encode(array(
      "success" => false,
      "message" => "Unable to delete event!"
    ));

}
else{
   echo json_encode(array("success" => true));
}
$stmt2->close();
exit;

?>

