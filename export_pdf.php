<?php
require('fpdf/fpdf.php');
include '../php/db_config.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    die("❌ Invalid or missing enquiry ID.");
}

$id = intval($_GET['id']);
$result = $conn->query("SELECT * FROM enquiries WHERE id = $id");

if ($result->num_rows === 0) {
    die("❌ No enquiry found.");
}

$data = $result->fetch_assoc();

$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 16);
$pdf->Cell(0, 10, 'Loan Enquiry Summary', 0, 1, 'C');
$pdf->Ln(5);

// Applicant Info
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(0, 10, 'Name: ' . $data['full_name'], 0, 1);
$pdf->Cell(0, 10, 'Email: ' . $data['email'], 0, 1);
$pdf->Cell(0, 10, 'Phone: ' . $data['phone'], 0, 1);
$pdf->Cell(0, 10, 'Address: ' . $data['address'], 0, 1);
$pdf->Cell(0, 10, 'City: ' . $data['city'] . ', State: ' . $data['state'] . ', ZIP: ' . $data['zip_code'], 0, 1);
$pdf->Ln(5);

// Loan Info
$pdf->SetFont('Arial', 'B', 13);
$pdf->Cell(0, 10, 'Loan Details:', 0, 1);
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(0, 10, 'Loan Type: ' . $data['loan_type'], 0, 1);
$pdf->Cell(0, 10, 'Amount: $' . $data['loan_amount'], 0, 1);
$pdf->Cell(0, 10, 'Purpose: ' . $data['loan_purpose'], 0, 1);
$pdf->Cell(0, 10, 'Term: ' . $data['loan_term'] . ' years', 0, 1);
$pdf->Cell(0, 10, 'Employment: ' . $data['employment_status'], 0, 1);
$pdf->Cell(0, 10, 'Income: $' . $data['annual_income'], 0, 1);
$pdf->Ln(5);

// Additional
$pdf->MultiCell(0, 10, 'Message: ' . $data['message']);

$pdf->Output('D', 'Enquiry_' . $data['id'] . '.pdf');
exit;
?>
