<?php
session_start();
include '../php/db_config.php';

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit();
}

$username = $_SESSION['admin'];
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current = $_POST['current_password'];
    $new = $_POST['new_password'];
    $confirm = $_POST['confirm_password'];

    $stmt = $conn->prepare("SELECT * FROM admin_users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $admin = $stmt->get_result()->fetch_assoc();

    if (!password_verify($current, $admin['password'])) {
        $error = "Current password is incorrect.";
    } elseif ($new !== $confirm) {
        $error = "New passwords do not match.";
    } elseif (strlen($new) < 6) {
        $error = "Password must be at least 6 characters.";
    } else {
        $hashed = password_hash($new, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE admin_users SET password = ? WHERE username = ?");
        $stmt->bind_param("ss", $hashed, $username);
        $stmt->execute();
        $success = "Password changed successfully.";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
  <title>Change Password</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container mt-5" style="max-width:600px;">
  <h3><i class="fas fa-lock me-2"></i>Change Password</h3>

  <?php if ($success): ?>
    <div class="alert alert-success"><?= $success ?></div>
  <?php elseif ($error): ?>
    <div class="alert alert-danger"><?= $error ?></div>
  <?php endif; ?>

  <form method="POST" class="card p-4 border mt-3">
    <div class="mb-3">
      <label class="form-label">Current Password</label>
      <input type="password" name="current_password" class="form-control" required>
    </div>

    <div class="mb-3">
      <label class="form-label">New Password</label>
      <input type="password" name="new_password" class="form-control" required minlength="6">
    </div>

    <div class="mb-3">
      <label class="form-label">Confirm New Password</label>
      <input type="password" name="confirm_password" class="form-control" required>
    </div>

    <button type="submit" class="btn btn-primary"><i class="fas fa-check-circle me-1"></i> Update Password</button>
    <a href="dashboard.php" class="btn btn-secondary ms-2">Cancel</a>
  </form>
</div>

<!-- Scripts -->
<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
