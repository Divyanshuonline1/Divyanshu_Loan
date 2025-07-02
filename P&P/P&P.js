const policyCheckbox = document.getElementById("agreePolicy");
const acceptPolicyBtn = document.getElementById("acceptPolicyBtn");

policyCheckbox.addEventListener("change", () => {
  if (policyCheckbox.checked) {
    acceptPolicyBtn.disabled = false;
    acceptPolicyBtn.classList.add("enabled");
  } else {
    acceptPolicyBtn.disabled = true;
    acceptPolicyBtn.classList.remove("enabled");
  }
});

acceptPolicyBtn.addEventListener("click", () => {
  // Perform the action when the button is clicked
  // For example, you can redirect the user to another page or perform some other action
  window.location.href = "../index.html";
})
