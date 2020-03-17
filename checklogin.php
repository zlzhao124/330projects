<?php

session_start();

if (!(isset($_SESSION['username']) || $_SESSION['username'] != '')) {
        //logged out
        echo json_encode(array(
                "success" => true
        ));
        exit;
}
else{

        $username = (string)$_SESSION['username'];
        ini_set("session.cookie_httponly", 1);

        echo json_encode(array(
                "success" => false,
                "message" => $username
        ));
        exit;
}
?>
