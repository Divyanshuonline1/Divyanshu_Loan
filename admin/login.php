<?php
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', $_SERVER['HTTP_HOST']);
session_start();
include '../php/db_config.php';


// Handle form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    if ($user === "admin" && $pass === "admin123") {
        $_SESSION['admin'] = $user;
header("Location: /admin/dashboard.php");
        exit();
    } else {
        $error = "❌ Invalid username or password.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Intelliflicks Admin Login</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body {
      background: linear-gradient(135deg, #4a00e0, #8e2de2);
      height: 100vh;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', sans-serif;
    }

    .login-box {
      background: #fff;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 420px;
      animation: fadeInUp 0.6s ease;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .brand {
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 1.5rem;
      color: #4a00e0;
    }

    h2 {
      text-align: center;
      margin-bottom: 1.2rem;
      font-weight: 600;
      color: #444;
    }

    .form-label {
      font-weight: 500;
      color: #555;
    }

    .form-control {
      border-radius: 12px;
      padding: 0.75rem;
    }

    .btn-primary {
      background: #4a00e0;
      border: none;
      border-radius: 12px;
      padding: 0.75rem;
      font-weight: bold;
      transition: background 0.3s ease;
    }

    .btn-primary:hover {
      background: #5b26e5;
    }

    .alert {
      font-size: 14px;
      margin-bottom: 1rem;
    }

    .footer {
      text-align: center;
      margin-top: 1.2rem;
      font-size: 13px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="login-box">
    <div class="brand"><i class="fas fa-user-shield"></i> Intelliflicks Admin</div>
    <h2>Login to Dashboard</h2>

    <?php if (!empty($error)): ?>
      <div class="alert alert-danger text-center">
        <?= htmlspecialchars($error) ?>
      </div>
    <?php endif; ?>

    <form method="POST" novalidate>
      <div class="mb-3">
        <label for="username" class="form-label">👤 Username</label>
        <input type="text" class="form-control" id="username" name="username" required placeholder="Enter admin username">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">🔒 Password</label>
        <input type="password" class="form-control" id="password" name="password" required placeholder="Enter password">
      </div>
      <button type="submit" class="btn btn-primary w-100 mt-3">Login</button>
    </form>

    <div class="footer">© <?= date('Y') ?> Intelliflicks. All rights reserved.</div>
  </div>
</body>
</html>
