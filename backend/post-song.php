<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require 'vendor/autoload.php';


// $contentType = explode(';', $_SERVER['CONTENT_TYPE']); // Check all available Content-Type
$json_string = file_get_contents("php://input"); // Read body
$json = json_decode($json_string);

$id = uniqid();
$file = fopen('./songs/' . $id . '.json','w+');
fwrite($file, $json_string);
fclose($file);


// Instantiation and passing `true` enables exceptions
$mail = new PHPMailer(true);
$url = "https://www.jenkutler.com/inlovingmemory-player";

try {
    //Server settings
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                   // Enable verbose debug output
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = 'ilmobt.heartbeatjs.org';               // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'jen@ilmobt.heartbeatjs.org';           // SMTP username
    $mail->Password   = ':gD0IW}f>r)KWj7sQ>C!';                 // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port       = 465;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    //Recipients
    $mail->setFrom('jen@ilmobt.heartbeatjs.org', 'In Loving Memory of Being Touched');
    $mail->addAddress($json->{'emailFriend'}, $json->{'nameFriend'});   
    $mail->addReplyTo('jenkutleraudio@gmail.com', 'Jen Kuttler');
    // $mail->addCC('cc@example.com');
    // $mail->addBCC('bcc@example.com');

    // Attachments
    // $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'In Loving Memory of Being Touched';
    $mail->Body    = "Hey {$json->{'nameFriend'}},
    <br/><br/>{$json->{'name'}} has created a <a href='{$url}?id={$id}'>touch composition</a> for you.
    <br/><br/>{$json->{'message'}}
    <br/><br/>Best";

    $mail->AltBody = "Hey {$json->{'nameFriend'}},
    \n\n{$json->{'name'}} has created a for you: {$url}?id={$id}
    \n\n{$json->{'message'}}
    \n\nBest";

    $mail->send();
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(array(
      'msg' => 'Message has been sent'
    ));
} catch (Exception $e) {
  header('Content-Type: application/json; charset=UTF-8');
  echo json_encode(array(
    'msg' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"
  ));

}

