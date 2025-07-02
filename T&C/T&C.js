document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("agreeCheckbox");
  const proceedBtn = document.getElementById("proceedBtn");

  // Enable button when checkbox is checked
  checkbox.addEventListener("change", function () {
    proceedBtn.disabled = !checkbox.checked;
  });

  // Redirect on button click
  proceedBtn.addEventListener("click", function () {
    if (checkbox.checked) {
      // Adjust path if needed
      window.location.href = "../index.html";
    }
  });
});
