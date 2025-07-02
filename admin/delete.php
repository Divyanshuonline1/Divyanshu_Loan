<?php
session_start();
include '../php/db_config.php';

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $type = $_POST['type'];
    $id = (int) $_POST['id'];

    if ($type === 'enquiry') {
        $conn->query("DELETE FROM enquiries WHERE id = $id");
    } elseif ($type === 'subscriber') {
        $conn->query("DELETE FROM newsletter WHERE id = $id");
    }
}

header("Location: dashboard.php");
exit();
