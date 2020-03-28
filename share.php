<?php
require 'database.php';

header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();
$username = $_SESSION['username'];

$newuser = $json_obj["newuser"];
//$title = $_POST['title'];
//$category=$_POST['category'];
//$date = $_POST['date'];
$eventid = $_POST['original_id'];

$eventdate = substr($eventid, 6, 16);
//echo($eventdate);
$eventitle = substr($eventid, 17);
//echo($eventitle);


$stmt = $mysqli->prepare("select title, date ,category from events where user=? );

if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => htmlentities($year)
    ));
    exit;
}

$stmt->bind_param('sss', $username, $date, $category);

$stmt->execute();

$stmt->bind_result($newuser,$eventitle, $eventdate, $eventid, $date,$username);

$stmt->fetch();

if($mysqli->error!=null){
	echo json_encode(array(
		"success" => false,
		"message" => " Nosuch events!"
	));
	exit;
}
$stmt->close();
$stmt = $mysqli->prepare("insert into events (title,username,date,category) values (?,?,?,?)");


if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "illegal!"
	));
	exit;
}

$stmt->bind_param('ssss', $title,$username,$date,$category) ;

$stmt->execute();

if($mysqli->error!=null){
	echo json_encode(array(
        "success" => false,
        "message" => "The username '".htmlentities($username)."' is not found!"
	));
	exit;
}
$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event Shared!"
));

exit;

?>
