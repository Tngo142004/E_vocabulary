<?php

include "db.php";

$result=$conn->query("
SELECT * FROM words
ORDER BY RAND()
LIMIT 5
");

$data=[];

while($row=$result->fetch_assoc()){
 $data[]=$row;
}

echo json_encode($data);