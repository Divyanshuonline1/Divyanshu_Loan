<?php
session_start();
include '../php/db_config.php';

if (!isset($_SESSION['admin'])) {
    die("Unauthorized access.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['type'] ?? '';

    if ($type === 'enquiries') {
        $conn->query("DELETE FROM enquiries");
        header("Location: dashboard.php?deleted_all=enquiries");
        exit;
    }

    if ($type === 'subscribers') {
        $conn->query("DELETE FROM newsletter");
        header("Location: dashboard.php?deleted_all=subscribers");
        exit;
    }

    header("Location: dashboard.php?error=invalid_type");
    exit;
}
