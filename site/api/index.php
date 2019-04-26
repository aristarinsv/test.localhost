<?php
require '../../vendor/autoload.php';
$app = new \Slim\App();
$app->get('/', function($request, $response) {
    $response->write("Hello");
    return $response;
});
require '../../dbConf.php';

$db = new PDO("mysql:host=" . DB_HOST .";dbname=" . DB_NAME, DB_USER, DB_PASS);
$app->post('/create', function ($request, $response, $args) use ($db, $app) {
    $emp = $request->getQueryParams();
    $sql = "INSERT INTO  users (usersname, usersstatus) VALUES (:usersname, 'Новый')";
    try {
        $stmt = $db->prepare($sql);
        $stmt->bindParam("usersname", $emp['fio']);
        $stmt->execute();
        $emp['id'] = $db->lastInsertId();
        return json_encode($emp);
    } catch(PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
    }
});
$app->put('/update/{id}', function ($request, $response, $args) use ($db, $app) {
    $emp = $request->getQueryParams();
    $id = $request->getAttribute('id');
    $str = "";
    if($emp['fieldname']) {
        $str = $emp['fieldname'] . "=:val";
    }

    $sql = "UPDATE  users SET $str WHERE idusers=:idusers";
       try {
           $stmt = $db->prepare($sql);
           if(str !== "") {
               $stmt->bindParam("val", $emp['val']);
           }
           $stmt->bindParam("idusers", $id);
           $stmt->execute();

           $db = null;
           return json_encode($emp);
       } catch(PDOException $e) {
           return '{"error":{"text":'. $e->getMessage() .'}}';
       }
});
$app->delete('/delete/{id}', function ($request, $response) use ($db) {
    $emp = json_decode($request->getBody());
	$id = $request->getAttribute('id');
    $sql = "DELETE FROM users WHERE idusers=:id";
    try {
        $stmt = $db->prepare($sql);
        $stmt->bindParam("idusers", $id);
        $stmt->execute();
        $db = null;
        return '{"error":{"text":"successfully! deleted Records"}}';
    } catch(PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
    }
});
$app->get('/users', function ($request, $response) use ($db, $app) {
    $nameLike = $request->getQueryParam('name_like');
    $sql = 'SELECT * FROM users';
    $bindLike = false;
    if(isset( $nameLike) &&  $nameLike !== ""){
        $nameLike = "%" . $request->getQueryParam('name_like') . "%";
        $sql .= " WHERE usersname LIKE :nameLike OR usersstatus LIKE :nameLike";
        $bindLike = true;
    }
    $sql .= ";"; 
    try {
        $stmt = $db->prepare($sql);
        if($bindLike) $stmt->bindValue(':nameLike', $nameLike, PDO::PARAM_STR);
        $stmt->execute();
        $contact = $stmt->fetchAll(PDO::FETCH_OBJ);
        $response->getBody()->write(json_encode($contact));
        $newResponse = $response->withHeader(
            'Content-type',
            'application/json; charset=utf-8'
        );
        return $newResponse;
    } catch(PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
    }
});
$app->run();