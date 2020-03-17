<?php
require 'database.php';

header("Content-Type: application/json");

session_start();
$username = $_SESSION['username'];

//const dataString = "title=" + encodeURIComponent(t) + "&date=" + encodeURIComponent(d)  + "&notes=" + encodeURIComponent(notes);

$title = $_POST['title'];
$date = $_POST['date'];
$time = $_POST['time'];
$notes = $_POST['notes'];

$stmt = $mysqli->prepare("insert into events (title, date, time, user, description) values (?, ?, ?, ?, ?)");
if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
  // Check the username that was entered to make sure that it is not a duplicate, and that both the username and password are nonempty string

if (strlen($title)>0){
    $stmt->bind_param('sssss', $title, $date, $time, $username, $notes);
    $stmt->execute();
    if (!$stmt->execute()){
    echo json_encode(array(
      "success" => false,
      "message" => "Unable to add event!"
    ));

}
else{
   echo json_encode(array("success" => true));
}

    $stmt->close();
    exit;
}

else{
 echo json_encode(array(
      "success" => false,
      "message" => "Event invalid"
    ));
$stmt->close();
    exit;
}
?>