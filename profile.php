<?php
session_start();
include '../php/db_config.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ Check if admin is logged in
if (!isset($_SESSION['admin'])) {
    die("<h4 style='color:red; text-align:center;'>Access denied. Please <a href='login.php'>log in</a>.</h4>");
}

$username = $_SESSION['admin'];
$success = '';
$error = '';

// ✅ Fetch admin data
$stmt = $conn->prepare("SELECT * FROM admin_users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$admin = $result->fetch_assoc();

// ✅ Check if user exists
if (!$admin) {
    die("<h4 style='color:red; text-align:center;'>❌ Admin user not found in the database. Check your session or table setup.</h4>");
}

// ✅ Handle profile update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['update_profile'])) {
        $new_username = trim($_POST['username']);
        $new_email = trim($_POST['email']);

        if (!filter_var($new_email, FILTER_VALIDATE_EMAIL)) {
            $error = "❌ Invalid email address.";
        } else {
            $stmt = $conn->prepare("UPDATE admin_users SET username = ?, email = ? WHERE id = ?");
            $stmt->bind_param("ssi", $new_username, $new_email, $admin['id']);
            $stmt->execute();

            $_SESSION['admin'] = $new_username;
            $admin['username'] = $new_username;
            $admin['email'] = $new_email;
            $success = "✅ Profile updated successfully.";
        }
    }

    if (isset($_POST['change_password'])) {
        $current = $_POST['current_password'];
        $new = $_POST['new_password'];
        $confirm = $_POST['confirm_password'];

        if (!password_verify($current, $admin['password'])) {
            $error = "❌ Current password is incorrect.";
        } elseif ($new !== $confirm) {
            $error = "❌ New passwords do not match.";
        } elseif (strlen($new) < 6) {
            $error = "❌ Password must be at least 6 characters.";
        } else {
            $hashed = password_hash($new, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE admin_users SET password = ? WHERE id = ?");
            $stmt->bind_param("si", $hashed, $admin['id']);
            $stmt->execute();
            $success = "✅ Password changed successfully.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Profile Settings</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
  <style>
    body {
      background-color: #f4f6f9;
    }
    .card-title i {
      color: #0d6efd;
    }
    .form-label i {
      color: #6c757d;
    }
    .info-label {
      font-weight: bold;
      color: #333;
    }
  </style>
</head>
<body>

<div class="container mt-5 mb-5" style="max-width: 800px;">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h3><i class="fas fa-user-cog me-2"></i>Admin Profile</h3>
    <a href="dashboard.php" class="btn btn-outline-secondary btn-sm"><i class="fas fa-arrow-left me-1"></i> Back</a>
  </div>

  <?php if ($success): ?>
    <div class="alert alert-success"><?= $success ?></div>
  <?php elseif ($error): ?>
    <div class="alert alert-danger"><?= $error ?></div>
  <?php endif; ?>

  <!-- Profile Overview -->
  <div class="card shadow-sm mb-4">
    <div class="card-body">
      <h5 class="card-title"><i class="fas fa-id-badge me-2"></i>Your Profile Information</h5>
      <p><span class="info-label">Admin ID:</span> <?= $admin['id'] ?></p>
      <p><span class="info-label">Username:</span> <?= htmlspecialchars($admin['username']) ?></p>
      <p><span class="info-label">Email:</span> <?= htmlspecialchars($admin['email']) ?></p>
      <p><span class="info-label">Role:</span> Super Admin</p>
    </div>
  </div>

  <!-- Edit Profile Form -->
  <div class="card shadow-sm mb-4">
    <div class="card-body">
      <h5 class="card-title"><i class="fas fa-user-edit me-2"></i>Edit Profile</h5>
      <form method="POST">
        <div class="mb-3">
          <label class="form-label"><i class="fas fa-user me-1"></i>Username</label>
          <input type="text" name="username" class="form-control" required value="<?= htmlspecialchars($admin['username']) ?>">
        </div>
        <div class="mb-3">
          <label class="form-label"><i class="fas fa-envelope me-1"></i>Email</label>
          <input type="email" name="email" class="form-control" required value="<?= htmlspecialchars($admin['email']) ?>">
        </div>
        <button type="submit" name="update_profile" class="btn btn-primary">
          <i class="fas fa-save me-1"></i> Save Changes
        </button>
      </form>
    </div>
  </div>

  <!-- Change Password Form -->
  <div class="card shadow-sm mb-5">
    <div class="card-body">
      <h5 class="card-title"><i class="fas fa-key me-2"></i>Change Password</h5>
      <form method="POST">
        <div class="mb-3">
          <label class="form-label"><i class="fas fa-lock me-1"></i>Current Password</label>
          <input type="password" name="current_password" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label"><i class="fas fa-unlock me-1"></i>New Password</label>
          <input type="password" name="new_password" class="form-control" required minlength="6">
        </div>
        <div class="mb-3">
          <label class="form-label"><i class="fas fa-check me-1"></i>Confirm New Password</label>
          <input type="password" name="confirm_password" class="form-control" required>
        </div>
        <button type="submit" name="change_password" class="btn btn-warning text-white">
          <i class="fas fa-sync-alt me-1"></i> Update Password
        </button>
      </form>
    </div>
  </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
