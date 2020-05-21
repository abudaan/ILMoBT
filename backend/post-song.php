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
    $mail->Body    = "This is the HTML message body " . $json->{'name'};
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}


// header('Content-Type: application/json; charset=UTF-8');
// echo json_encode(array(
//   'id' => $id
// ));