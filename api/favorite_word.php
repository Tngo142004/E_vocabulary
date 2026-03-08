<?php

include "db.php";

$data=json_decode(file_get_contents("php://input"),true);

$id=$data["id"];

$conn->query("
UPDATE words 
SET favorite = 1 - favorite 
WHERE id=$id
");

echo json_encode(["status"=>"ok"]);