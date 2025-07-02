document.addEventListener('DOMContentLoaded', function() {
    // Multi-step form functionality
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    let currentStep = 0;
    
    // Next step button click
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep === 1) updateSummary();
                formSteps[currentStep].classList.remove('active');
                currentStep++;
                formSteps[currentStep].classList.add('active');
                updateProgress();
            }
        });
    });
    
    // Previous step button click
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            formSteps[currentStep].classList.remove('active');
            currentStep--;
            formSteps[currentStep].classList.add('active');
            updateProgress();
        });
    });
    
    function updateProgress() {
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= currentStep);
        });
    }
    
    function validateStep(step) {
        let isValid = true;
        const currentFields = formSteps[step].querySelectorAll('input[required], select[required]');
        
        currentFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
                let errorMessage = field.parentElement.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    field.parentElement.appendChild(errorMessage);
                }
            } else {
                field.classList.remove('error');
                const errorMessage = field.parentElement.querySelector('.error-message');
                if (errorMessage) field.parentElement.removeChild(errorMessage);
            }
        });
        return isValid;
    }
    
    function updateSummary() {
        document.getElementById('summary-name').textContent = document.getElementById('full-name').value;
        document.getElementById('summary-email').textContent = document.getElementById('email').value;
        document.getElementById('summary-phone').textContent = document.getElementById('phone').value;
        
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zipCode = document.getElementById('zip-code').value;
        document.getElementById('summary-address').textContent = `${address}, ${city}, ${state} ${zipCode}`;
        
        const loanTypeText = document.getElementById('loan-type').selectedOptions[0].text;
        document.getElementById('summary-loan-type').textContent = loanTypeText;
        
        document.getElementById('summary-loan-amount').textContent = `USD ${document.getElementById('loan-amount-request').value}`;
        
        const loanPurposeText = document.getElementById('loan-purpose').selectedOptions[0].text;
        document.getElementById('summary-loan-purpose').textContent = loanPurposeText;
        
        const loanTermText = document.getElementById('loan-term-request').selectedOptions[0].text;
        document.getElementById('summary-loan-term').textContent = loanTermText;
    }

    // AJAX Form submission
    const loanEnquiryForm = document.getElementById('loan-enquiry-form');
    if (loanEnquiryForm) {
        loanEnquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!document.getElementById('terms-checkbox').checked) {
                alert('Please agree to the Terms and Conditions to proceed.');
                return;
            }

            const formData = new FormData(loanEnquiryForm);

            fetch('php/submit_enquiry.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(response => {
                const formContainer = document.querySelector('.form-container');
                formContainer.innerHTML = `
                  <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h2>Thank You for Your Enquiry!</h2>
                    <p>Your loan application has been successfully submitted.</p>
                    <p>Our team will contact you within 24 hours at 
                      <strong>${document.getElementById('email').value}</strong> or 
                      <strong>${document.getElementById('phone').value}</strong>.</p>
                    <p>Your reference number: <strong>FE-${Math.floor(100000 + Math.random() * 900000)}</strong></p>
                    <div class="text-center">
                      <a href="index.html" class="btn">Back to Home</a>
                    </div>
                    <div style="margin-top:10px;font-size:14px;color:green;">${response}</div>
                  </div>
                `;

                const style = document.createElement('style');
                style.textContent = `
                  .success-message {
                    text-align: center;
                    padding: 20px;
                  }
                  .success-message i {
                    font-size: 60px;
                    color: var(--success);
                    margin-bottom: 20px;
                  }
                  .success-message h2 {
                    margin-bottom: 15px;
                  }
                  .success-message p {
                    margin-bottom: 10px;
                  }
                `;
                document.head.appendChild(style);
            })
            .catch(err => {
                console.error('Enquiry submission failed:', err);
                alert('Something went wrong. Please try again.');
            });
        });
    }

    // Pre-fill loan type from URL
    const urlParams = new URLSearchParams(window.location.search);
    const loanType = urlParams.get('type');
    if (loanType && document.getElementById('loan-type')) {
        const loanTypeSelect = document.getElementById('loan-type');
        const optionExists = Array.from(loanTypeSelect.options).some(option => option.value === loanType);
        if (optionExists) loanTypeSelect.value = loanType;
    }
});
