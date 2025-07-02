<?php
include 'db_config.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "Only POST allowed.";
    exit;
}

$name  = trim($_POST["name"] ?? '');
$email = trim($_POST["email"] ?? '');
$agree = isset($_POST["agree"]);

if (!$name || !$email || !$agree) {
    http_response_code(400);
    echo "All fields are required.";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Invalid email format.";
    exit;
}

$stmt = $conn->prepare("INSERT INTO newsletter (name, email) VALUES (?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo "Database error.";
    exit;
}

$stmt->bind_param("ss", $name, $email);

if ($stmt->execute()) {
    echo "Your subscription has been submitted successfully.";
} else {
    http_response_code(500);
    echo "Failed to save your subscription.";
}

$stmt->close();
$conn->close();
?>
