<?php
header("Content-Type: application/json");

include "db.php";

$data=json_decode(file_get_contents("php://input"),true);

$word=$data["word"];
$phonetic=$data["phonetic"];
$type=$data["type"];
$meaning=$data["meaning"];

$stmt=$conn->prepare(
"INSERT INTO words(word,phonetic,type,meaning)
VALUES(?,?,?,?)"
);

$stmt->bind_param("ssss",$word,$phonetic,$type,$meaning);

if($stmt->execute()){
 echo json_encode(["status"=>"success"]);
}else{
 echo json_encode(["status"=>"error"]);
}