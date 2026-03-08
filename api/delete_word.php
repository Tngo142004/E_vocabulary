<?php

include "db.php";

$data=json_decode(file_get_contents("php://input"),true);

$id=$data["id"];

$conn->query("DELETE FROM words WHERE id=$id");

echo json_encode(["status"=>"success"]);