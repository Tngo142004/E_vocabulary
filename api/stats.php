<?php

include "db.php";

$total=$conn->query("SELECT COUNT(*) t FROM words")->fetch_assoc()["t"];
$fav=$conn->query("SELECT COUNT(*) t FROM words WHERE favorite=1")->fetch_assoc()["t"];
$learned=$conn->query("SELECT COUNT(*) t FROM words WHERE learned=1")->fetch_assoc()["t"];

echo json_encode([
 "total"=>$total,
 "favorite"=>$fav,
 "learned"=>$learned
]);