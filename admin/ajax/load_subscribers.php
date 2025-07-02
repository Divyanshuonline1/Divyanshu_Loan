<?php
include '../../php/db_config.php';

$subs = $conn->query("SELECT * FROM newsletter ORDER BY subscribed_at DESC");
while ($row = $subs->fetch_assoc()):
?>
<tr>
  <td><?= htmlspecialchars($row['name']) ?></td>
  <td><?= htmlspecialchars($row['email']) ?></td>
  <td><?= $row['subscribed_at'] ?></td>
  <td>
    <form action="delete.php" method="POST" class="d-inline" onsubmit="return confirm('Delete this subscriber?');">
      <input type="hidden" name="type" value="subscriber">
      <input type="hidden" name="id" value="<?= $row['id'] ?>">
      <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash-alt"></i> Delete</button>
    </form>
  </td>
</tr>
<?php endwhile; ?>
