<?php
$DB_HOST = "localhost";
$DB_USER = "u294201679_Sandeep123";
$DB_PASS = "DivyanshuSandeep9294@98"; // Replace with the password you set
$DB_NAME = "u294201679_intelliflicks";

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
