<?php
//
//Bring in the necessary files.
require_once '../config.php';
//
function save_image($term, $image_content){
    //
    //The pdo object in the config file.
    global $pdo;
    //
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    //
    //The file type, e.g., image/png or image/jpeg etc.
    $type = $finfo->buffer($image_content);
    //
    //The extension format of the file.
    $ext = explode('/', $type);
    //
    //These characters will help in formulating random numbers.
    $lower_case = 'abcdefghijklmnopqrstuvwxyz';
    $numeric = '1234567890';
    $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //
    //Create a unique image name.
    $image_name = str_shuffle($numeric.$lower_case.$numeric.$uppercase.$numeric) . '.' . $ext[1];
    //
    //The query statement.
    $query = "INSERT INTO `image` ( `name`, `term`, `created_at` ) 
        VALUES('$image_name', '$term',CURRENT_TIMESTAMP)";
    //
    //Execute the query.
    if($pdo->exec($query)){
        //
        //A positive message
        echo json_encode(["success" => true]);
        //
        //Open the assets folder.
        $fh = fopen('../../src/assets/data/' . $image_name, 'w');
        //
        //Write the image in the opened folder.
        $fwrite = fwrite($fh, $image_content);
        //
        //Close the stream.
        fclose($fh);
    }
    else{
        //
        //A negative message.
        echo json_encode(["success" => false]);
    }
}