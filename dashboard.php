<?php
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', $_SERVER['HTTP_HOST']);
session_start();
include '../php/db_config.php';

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit();
}

$enquiries = $conn->query("SELECT * FROM enquiries ORDER BY submitted_at DESC");
$subs = $conn->query("SELECT * FROM newsletter ORDER BY subscribed_at DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Dashboard | Intelliflicks</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
  <style>
    body {
      background-color: #f8f9fb;
      font-family: 'Segoe UI', sans-serif;
    }
    .container {
      padding-top: 40px;
      padding-bottom: 40px;
    }
    .dashboard-header h2 {
      font-weight: 700;
      color: #333;
    }
    .nav-tabs .nav-link.active {
      background-color: #0d6efd;
      color: white;
      font-weight: 600;
    }
    .table th, .table td {
      vertical-align: middle;
    }
    .btn i {
      margin-right: 6px;
    }
    .action-buttons .form-control {
      max-width: 300px;
    }
    .badge {
      font-size: 0.9rem;
    }
    .dropdown-menu a i {
      width: 20px;
    }
  </style>
</head>

<body>
<div class="container">

  <!-- Flash messages -->
  <?php if (isset($_GET['deleted_all'])): ?>
    <div class="alert alert-success">✅ All <?= htmlspecialchars($_GET['deleted_all']) ?> deleted successfully.</div>
  <?php elseif (isset($_GET['error'])): ?>
    <div class="alert alert-danger">❌ Error: <?= htmlspecialchars($_GET['error']) ?></div>
  <?php endif; ?>

  <!-- Top Header -->


  <div class="d-flex justify-content-between align-items-center mb-4 dashboard-header">
    <h2><i class="fas fa-chart-line text-primary"></i> Admin Dashboard <span class="text-muted">| Intelliflicks</span></h2>
    <div class="dropdown">
      <button class="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown">
        <i class="fas fa-user-circle me-1"></i> Admin
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="profile.php"><i class="fas fa-id-badge"></i> View/Edit Profile</a></li>
        <li><a class="dropdown-item" href="change_password.php"><i class="fas fa-lock"></i> Change Password</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
      </ul>
    </div>
  </div>

  <!-- Tabs -->
  <ul class="nav nav-tabs mb-3" id="dashboardTabs" role="tablist">
    <li class="nav-item">
      <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#enquiries" role="tab">Loan Enquiries</button>
    </li>
    <li class="nav-item">
      <button class="nav-link" data-bs-toggle="tab" data-bs-target="#newsletter" role="tab">Newsletter Subscribers</button>
    </li>
  </ul>

  <!-- Tab Contents -->
  <div class="tab-content">

    <!-- Enquiries Tab -->
    <div class="tab-pane fade show active" id="enquiries" role="tabpanel">
      <div class="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <h4 class="text-dark">📄 Loan Enquiries</h4>
        <span class="badge bg-primary">Total: <?= $enquiries->num_rows ?></span>
      </div>

      <div class="d-flex flex-wrap gap-2 align-items-center mb-3 action-buttons">
        <a href="export_csv.php?type=enquiries" class="btn btn-sm btn-success">
          <i class="fas fa-file-csv"></i> Export CSV
        </a>
        <form method="POST" action="delete_all.php" onsubmit="return confirm('Delete all enquiries?');">
          <input type="hidden" name="type" value="enquiries">
          <button class="btn btn-sm btn-danger">
            <i class="fas fa-trash-alt"></i> Delete All
          </button>
        </form>
        <a href="#" id="refreshEnquiries" class="btn btn-sm btn-secondary">
  <i class="fas fa-sync-alt"></i> Refresh
</a>

        <input type="text" class="form-control ms-auto" id="searchEnquiries" placeholder="🔍 Search enquiries...">
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Loan Type</th><th>Amount</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php while($row = $enquiries->fetch_assoc()): ?>
            <tr>
              <td><?= htmlspecialchars($row['full_name']) ?></td>
              <td><?= htmlspecialchars($row['email']) ?></td>
              <td><?= htmlspecialchars($row['phone']) ?></td>
              <td><?= htmlspecialchars($row['loan_type']) ?></td>
              <td>$<?= htmlspecialchars($row['loan_amount']) ?></td>
              <td><?= $row['submitted_at'] ?></td>
              <td>
                <a href="export_pdf.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-outline-secondary">
                  <i class="fas fa-file-pdf"></i> Print
                </a>
                <form action="delete.php" method="POST" class="d-inline" onsubmit="return confirm('Delete this enquiry?');">
                  <input type="hidden" name="type" value="enquiry">
                  <input type="hidden" name="id" value="<?= $row['id'] ?>">
                  <button class="btn btn-sm btn-outline-danger">
                    <i class="fas fa-trash-alt"></i> Delete
                  </button>
                </form>
              </td>
            </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Newsletter Tab -->
    <div class="tab-pane fade" id="newsletter" role="tabpanel">
        
      <div class="d-flex justify-content-between align-items-center flex-wrap mb-3 mt-4">
        <h4 class="text-dark">📧 Newsletter Subscribers</h4>
        <span class="badge bg-success">Total: <?= $subs->num_rows ?></span>
      </div>

      <div class="d-flex flex-wrap gap-2 align-items-center mb-3 action-buttons">
  <a href="export_csv.php?type=subscribers" class="btn btn-sm btn-success">
    <i class="fas fa-file-csv"></i> Export CSV
  </a>
  <form method="POST" action="delete_all.php" onsubmit="return confirm('Delete all subscribers?');">
    <input type="hidden" name="type" value="subscribers">
    <button class="btn btn-sm btn-danger">
      <i class="fas fa-trash-alt"></i> Delete All
    </button>
  </form>
 <a href="#" id="refreshSubscribers" class="btn btn-sm btn-secondary">
  <i class="fas fa-sync-alt"></i> Refresh
</a>
</div>


      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <?php while($row = $subs->fetch_assoc()): ?>
            <tr>
              <td><?= htmlspecialchars($row['name']) ?></td>
              <td><?= htmlspecialchars($row['email']) ?></td>
              <td><?= $row['subscribed_at'] ?></td>
              <td>
                <form action="delete.php" method="POST" class="d-inline" onsubmit="return confirm('Delete this subscriber?');">
                  <input type="hidden" name="type" value="subscriber">
                  <input type="hidden" name="id" value="<?= $row['id'] ?>">
                  <button class="btn btn-sm btn-outline-danger">
                    <i class="fas fa-trash-alt"></i> Delete
                  </button>
                </form>
              </td>
            </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</div>


<!-- Scripts -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchEnquiries');
  const tableRows = document.querySelectorAll('#enquiries tbody tr');
  searchInput?.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    tableRows.forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });
});
</script>
<script>
document.addEventListener('DOMContentLoaded', () => {
  // Enquiries Refresh
  const refreshEnquiries = document.getElementById('refreshEnquiries');
  const enquiriesTable = document.querySelector('#enquiries tbody');

  if (refreshEnquiries && enquiriesTable) {
    refreshEnquiries.addEventListener('click', function (e) {
      e.preventDefault();
      refreshEnquiries.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
      fetch('ajax/load_enquiries.php')
        .then(res => res.text())
        .then(data => {
          enquiriesTable.innerHTML = data;
          refreshEnquiries.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        })
        .catch(err => {
          alert("❌ Failed to refresh enquiries.");
          console.error(err);
        });
    });
  }

  // Subscribers Refresh
  const refreshSubscribers = document.getElementById('refreshSubscribers');
  const subsTable = document.querySelector('#newsletter tbody');

  if (refreshSubscribers && subsTable) {
    refreshSubscribers.addEventListener('click', function (e) {
      e.preventDefault();
      refreshSubscribers.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
      fetch('ajax/load_subscribers.php')
        .then(res => res.text())
        .then(data => {
          subsTable.innerHTML = data;
          refreshSubscribers.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        })
        .catch(err => {
          alert("❌ Failed to refresh subscribers.");
          console.error(err);
        });
    });
  }
});
</script>

</body>
</html>
