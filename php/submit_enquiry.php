<?php
include 'db_config.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fields = [
        'full-name','email','phone','date-of-birth','address','city','state','zip-code',
        'loan-type','loan-amount-request','loan-purpose','loan-term-request','employment-status',
        'annual-income','message'
    ];

    $data = [];
    foreach ($fields as $field) {
        $data[$field] = htmlspecialchars(trim($_POST[$field] ?? ''));
    }

    // Basic validation
    if (!$data['full-name'] || !$data['email'] || !$data['phone']) {
        die("❌ Required fields missing.");
    }

    $stmt = $conn->prepare("INSERT INTO enquiries (
        full_name, email, phone, dob, address, city, state, zip_code,
        loan_type, loan_amount, loan_purpose, loan_term, employment_status,
        annual_income, message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("ssssssssssssdss",
        $data['full-name'], $data['email'], $data['phone'], $data['date-of-birth'], $data['address'],
        $data['city'], $data['state'], $data['zip-code'], $data['loan-type'], $data['loan-amount-request'],
        $data['loan-purpose'], $data['loan-term-request'], $data['employment-status'],
        $data['annual-income'], $data['message']
    );

    if ($stmt->execute()) {
        echo "✅ Enquiry submitted successfully!";
    } else {
        echo "❌ Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "⚠️ No POST data received.";
}
?>
