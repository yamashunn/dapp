<?php
$readjson = file_get_contents("test.json");
$readjson = json_decode($readjson, true);
//unset($readjson[0]);
//print_r($readjson);

/*
$newjson = json_decode($readjson, JSON_OBJECT_AS_ARRAY);
print_r($newjson);
*/

$array = array( 
    "0" => array(
        "id" => (int)$_POST['text1'] ,
        "name" => $_POST['text2'] ,
        "picture" => $_POST['text3'] ,
        "price" =>(int)$_POST['text4'] ,
        "artist" => $_POST['text5'] ,
        "location" => $_POST['text6'] ,
        "date" => $_POST['text7'] ,
    )
);
//print_r($array);

$finaljson = json_encode(array_merge($readjson,$array),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
//print_r($finaljson);


file_put_contents("test.json", $finaljson);
echo ("ファイル書き込み完了<br/>");


header("Location:http://localhost:3000/");
/*
echo($_POST['text1']);


echo($_POST['text2']);
*/
?>