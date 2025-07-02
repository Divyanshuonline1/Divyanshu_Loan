<?php
session_start();
include '../php/db_config.php';

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit();
}

$username = $_SESSION['admin'];
$stmt = $conn->prepare("SELECT * FROM admin_users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$admin = $stmt->get_result()->fetch_assoc();

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_username = trim($_POST['username']);
    $new_email = trim($_POST['email']);

    if (!filter_var($new_email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email address.";
    } else {
        $stmt = $conn->prepare("UPDATE admin_users SET username = ?, email = ? WHERE id = ?");
        $stmt->bind_param("ssi", $new_username, $new_email, $admin['id']);
        $stmt->execute();

        $_SESSION['admin'] = $new_username;
        $success = "Profile updated successfully.";
        $admin['username'] = $new_username;
        $admin['email'] = $new_email;
    }
}
?>
<!DOCTYPE html>
<html>
<head>
  <title>Edit Profile</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container mt-5" style="max-width:600px;">
  <h3><i class="fas fa-edit me-2"></i>Edit Profile</h3>

  <?php if ($success): ?>
    <div class="alert alert-success"><?= $success ?></div>
  <?php elseif ($error): ?>
    <div class="alert alert-danger"><?= $error ?></div>
  <?php endif; ?>

  <form method="POST" class="card p-4 border mt-3">
    <div class="mb-3">
      <label class="form-label">Username</label>
      <input type="text" name="username" class="form-control" required value="<?= htmlspecialchars($admin['username']) ?>">
    </div>

    <div class="mb-3">
      <label class="form-label">Email</label>
      <input type="email" name="email" class="form-control" required value="<?= htmlspecialchars($admin['email']) ?>">
    </div>

    <button type="submit" class="btn btn-primary"><i class="fas fa-save me-1"></i> Save Changes</button>
    <a href="dashboard.php" class="btn btn-secondary ms-2">Cancel</a>
  </form>
</div>

<!-- Scripts -->
<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
