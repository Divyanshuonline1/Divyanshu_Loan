<?php
session_start();
include '../php/db_config.php';

// Check admin login
if (!isset($_SESSION['admin'])) {
    die("Unauthorized access.");
}

// Determine export type
$type = $_GET['type'] ?? '';
$type = strtolower(trim($type));

// Set CSV headers
$filename = 'export_' . $type . '_' . date('Y-m-d') . '.csv';
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $filename . '"');

// Open output buffer
$output = fopen('php://output', 'w');

if ($type === 'enquiries') {
    // Column headers
    fputcsv($output, ['ID', 'Full Name', 'Email', 'Phone', 'Loan Type', 'Loan Amount', 'Submitted At']);

    // Fetch data
    $query = $conn->query("SELECT * FROM enquiries ORDER BY submitted_at DESC");
    while ($row = $query->fetch_assoc()) {
        fputcsv($output, [
            $row['id'],
            $row['full_name'],
            $row['email'],
            $row['phone'],
            $row['loan_type'],
            $row['loan_amount'],
            $row['submitted_at']
        ]);
    }

} elseif ($type === 'subscribers') {
    // Column headers
    fputcsv($output, ['ID', 'Name', 'Email', 'Subscribed At']);

    // Fetch data
    $query = $conn->query("SELECT * FROM newsletter ORDER BY subscribed_at DESC");
    while ($row = $query->fetch_assoc()) {
        fputcsv($output, [
            $row['id'],
            $row['name'],
            $row['email'],
            $row['subscribed_at']
        ]);
    }

} else {
    fputcsv($output, ['Invalid export type. Please use ?type=enquiries or ?type=subscribers']);
}

fclose($output);
exit;
