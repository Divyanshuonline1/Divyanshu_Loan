<?php
include '../../php/db_config.php';

$enquiries = $conn->query("SELECT * FROM enquiries ORDER BY submitted_at DESC");
while ($row = $enquiries->fetch_assoc()):
?>
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
      <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash-alt"></i> Delete</button>
    </form>
  </td>
</tr>
<?php endwhile; ?>
