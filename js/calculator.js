document.addEventListener('DOMContentLoaded', function() {
    // Loan Calculator Elements
    const loanAmountInput = document.getElementById('loan-amount');
    const loanAmountSlider = document.getElementById('loan-amount-slider');
    const interestRateInput = document.getElementById('interest-rate');
    const interestRateSlider = document.getElementById('interest-rate-slider');
    const loanTermInput = document.getElementById('loan-term');
    const loanTermSlider = document.getElementById('loan-term-slider');
    const calculateBtn = document.getElementById('calculate-btn');
    const monthlyPaymentDisplay = document.getElementById('monthly-payment');
    const totalPaymentDisplay = document.getElementById('total-payment');
    const totalInterestDisplay = document.getElementById('total-interest');
    const rateDisplay = document.getElementById('rate-display');
    const termDisplay = document.getElementById('term-display');
    
    // Sync input fields and sliders
    loanAmountInput.addEventListener('input', () => {
        loanAmountSlider.value = loanAmountInput.value;
        calculateLoan();
    });
    
    loanAmountSlider.addEventListener('input', () => {
        loanAmountInput.value = loanAmountSlider.value;
        calculateLoan();
    });
    
    interestRateInput.addEventListener('input', () => {
        interestRateSlider.value = interestRateInput.value;
        calculateLoan();
    });
    
    interestRateSlider.addEventListener('input', () => {
        interestRateInput.value = interestRateSlider.value;
        calculateLoan();
    });
    
    loanTermInput.addEventListener('input', () => {
        loanTermSlider.value = loanTermInput.value;
        calculateLoan();
    });
    
    loanTermSlider.addEventListener('input', () => {
        loanTermInput.value = loanTermSlider.value;
        calculateLoan();
    });
    
    calculateBtn.addEventListener('click', calculateLoan);
    
    // Calculator tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Set default values based on loan type
            const loanType = button.getAttribute('data-tab');
            setDefaultValues(loanType);
            calculateLoan();
        });
    });
    
    // Set default values based on loan type
    function setDefaultValues(loanType) {
        switch (loanType) {
            case 'personal':
                loanAmountInput.value = 1000000;
                loanAmountSlider.value = 1000000;
                interestRateInput.value = 10.5;
                interestRateSlider.value = 10.5;
                loanTermInput.value = 5;
                loanTermSlider.value = 5;
                break;
            case 'home':
                loanAmountInput.value = 5000000;
                loanAmountSlider.value = 5000000;
                interestRateInput.value = 7.5;
                interestRateSlider.value = 7.5;
                loanTermInput.value = 20;
                loanTermSlider.value = 20;
                break;
            case 'auto':
                loanAmountInput.value = 800000;
                loanAmountSlider.value = 800000;
                interestRateInput.value = 8.5;
                interestRateSlider.value = 8.5;
                loanTermInput.value = 7;
                loanTermSlider.value = 7;
                break;
            case 'business':
                loanAmountInput.value = 3000000;
                loanAmountSlider.value = 3000000;
                interestRateInput.value = 12.0;
                interestRateSlider.value = 12.0;
                loanTermInput.value = 10;
                loanTermSlider.value = 10;
                break;
        }
    }
    
    // Calculate loan function
    function calculateLoan() {
        const principal = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(interestRateInput.value) / 100 / 12;
        const term = parseFloat(loanTermInput.value) * 12;
        
        if (principal > 0 && interestRate > 0 && term > 0) {
            const x = Math.pow(1 + interestRate, term);
            const monthlyPayment = (principal * x * interestRate) / (x - 1);
            const totalPayment = monthlyPayment * term;
            const totalInterest = totalPayment - principal;
            
            // Format numbers in Indian currency format
            monthlyPaymentDisplay.textContent = `₹${formatIndianCurrency(monthlyPayment)}`;
            totalPaymentDisplay.textContent = `₹${formatIndianCurrency(totalPayment)}`;
            totalInterestDisplay.textContent = `₹${formatIndianCurrency(totalInterest)}`;
            rateDisplay.textContent = `${parseFloat(interestRateInput.value).toFixed(2)}%`;
            termDisplay.textContent = `${loanTermInput.value} ${loanTermInput.value > 1 ? 'years' : 'year'}`;
            
            // Update chart
            updateChart(principal, totalInterest);
            
            // Generate amortization table
            generateAmortizationTable(principal, interestRate, term, monthlyPayment);
            
            // Update comparison chart
            updateComparisonChart();
        }
    }
    
    // Format number to Indian currency format (with commas)
    function formatIndianCurrency(number) {
        const round = Math.round(number * 100) / 100;
        const parts = round.toFixed(2).toString().split('.');
        let lastThree = parts[0].substring(parts[0].length - 3);
        const otherNumbers = parts[0].substring(0, parts[0].length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        const formattedNumber = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + (parts.length > 1 ? '.' + parts[1] : '');
        return formattedNumber;
    }
    
    // Create payment chart
    let paymentChart;
    function updateChart(principal, totalInterest) {
        const ctx = document.getElementById('payment-chart').getContext('2d');
        
        if (paymentChart) {
            paymentChart.destroy();
        }
        
        paymentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, totalInterest],
                    backgroundColor: [
                        '#3a86ff',
                        '#8338ec'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                return `${label}: ₹${formatIndianCurrency(value)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Generate amortization table
    function generateAmortizationTable(principal, interestRate, term, monthlyPayment) {
        const tableBody = document.querySelector('#amortization-table tbody');
        tableBody.innerHTML = '';
        
        let balance = principal;
        const currentDate = new Date();
        
        // Only show first 12 payments and last payment for large terms
        const maxRowsToShow = term > 24 ? 12 : term;
        
        for (let i = 1; i <= term; i++) {
            const interestPayment = balance * interestRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
            
            // Calculate payment date
            const paymentDate = new Date(currentDate);
            paymentDate.setMonth(currentDate.getMonth() + i);
            
            // Only add rows for the first maxRowsToShow payments and the last payment
            if (i <= maxRowsToShow || i === term) {
                // Add ellipsis row if we're skipping rows
                if (i === maxRowsToShow + 1 && term > maxRowsToShow + 1) {
                    const ellipsisRow = document.createElement('tr');
                    ellipsisRow.innerHTML = `<td colspan="6" style="text-align: center;">...</td>`;
                    tableBody.appendChild(ellipsisRow);
                }
                
                if (i <= maxRowsToShow || i === term) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${i}</td>
                        <td>${paymentDate.toLocaleDateString()}</td>
                        <td>₹${formatIndianCurrency(monthlyPayment)}</td>
                        <td>₹${formatIndianCurrency(principalPayment)}</td>
                        <td>₹${formatIndianCurrency(interestPayment)}</td>
                        <td>₹${formatIndianCurrency(Math.max(0, balance))}</td>
                    `;
                    tableBody.appendChild(row);
                }
            }
        }
    }
    
    // Save results functionality
    document.getElementById('save-results').addEventListener('click', function() {
        const loanAmount = loanAmountInput.value;
        const interestRate = interestRateInput.value;
        const loanTerm = loanTermInput.value;
        const monthlyPayment = monthlyPaymentDisplay.textContent;
        const totalPayment = totalPaymentDisplay.textContent;
        const totalInterest = totalInterestDisplay.textContent;
        
        const resultsText = `
Loan Calculation Results
-----------------------
Date: ${new Date().toLocaleDateString()}
Loan Amount: ₹${formatIndianCurrency(loanAmount)}
Interest Rate: ${interestRate}%
Loan Term: ${loanTerm} years
Monthly Payment: ${monthlyPayment}
Total Payment: ${totalPayment}
Total Interest: ${totalInterest}
-----------------------
Calculated by FinanceEase Loan Calculator
www.financeease.com
        `;
        
        // Create a blob and download
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loan-calculation-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Comparison chart
    let comparisonChart;
    function updateComparisonChart() {
        const ctx = document.getElementById('comparison-chart').getContext('2d');
        const compareType = document.querySelector('.compare-btn.active').getAttribute('data-compare');
        
        let labels = [];
        let principalData = [];
        let interestData = [];
        let monthlyPayments = [];
        
        const principal = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(interestRateInput.value) / 100 / 12;
        const term = parseFloat(loanTermInput.value) * 12;
        
        // Generate comparison data based on the selected comparison type
        switch (compareType) {
            case 'term':
                // Compare different loan terms (5, 10, 15, 20, 25, 30 years)
                [5, 10, 15, 20, 25, 30].forEach(years => {
                    const months = years * 12;
                    const x = Math.pow(1 + interestRate, months);
                    const monthlyPayment = (principal * x * interestRate) / (x - 1);
                    const totalPayment = monthlyPayment * months;
                    const totalInterest = totalPayment - principal;
                    
                    labels.push(`${years} years`);
                    principalData.push(principal);
                    interestData.push(totalInterest);
                    monthlyPayments.push(monthlyPayment);
                });
                break;
                
            case 'rate':
                // Compare different interest rates (6%, 8%, 10%, 12%, 14%, 16%)
                [6, 8, 10, 12, 14, 16].forEach(rate => {
                    const monthlyRate = rate / 100 / 12;
                    const x = Math.pow(1 + monthlyRate, term);
                    const monthlyPayment = (principal * x * monthlyRate) / (x - 1);
                    const totalPayment = monthlyPayment * term;
                    const totalInterest = totalPayment - principal;
                    
                    labels.push(`${rate}%`);
                    principalData.push(principal);
                    interestData.push(totalInterest);
                    monthlyPayments.push(monthlyPayment);
                });
                break;
                
            case 'amount':
                // Compare different loan amounts
                [500000, 1000000, 2000000, 3000000, 4000000, 5000000].forEach(amount => {
                    const x = Math.pow(1 + interestRate, term);
                    const monthlyPayment = (amount * x * interestRate) / (x - 1);
                    const totalPayment = monthlyPayment * term;
                    const totalInterest = totalPayment - amount;
                    
                    labels.push(`₹${formatIndianCurrency(amount)}`);
                    principalData.push(amount);
                    interestData.push(totalInterest);
                    monthlyPayments.push(monthlyPayment);
                });
                break;
        }
        
        if (comparisonChart) {
            comparisonChart.destroy();
        }
        
        comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Principal',
                        data: principalData,
                        backgroundColor: '#3a86ff',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Interest',
                        data: interestData,
                        backgroundColor: '#8338ec',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Monthly Payment',
                        data: monthlyPayments,
                        type: 'line',
                        borderColor: '#ff006e',
                        backgroundColor: 'rgba(255, 0, 110, 0.1)',
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: getComparisonLabel(compareType)
                        }
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Total Amount (₹)'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return '₹' + (value / 1000000).toFixed(1) + ' Cr';
                                } else if (value >= 1000) {
                                    return '₹' + (value / 1000).toFixed(0) + ' K';
                                } else {
                                    return '₹' + value;
                                }
                            }
                        }
                    },
                    y1: {
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Monthly Payment (₹)'
                        },
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: function(value) {
                                return '₹' + formatIndianCurrency(value);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                let value = context.raw;
                                if (label) {
                                    label += ': ';
                                }
                                if (label.includes('Monthly')) {
                                    return label + '₹' + formatIndianCurrency(value);
                                } else {
                                    return label + '₹' + formatIndianCurrency(value);
                                }
                            }
                        }
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
    
    function getComparisonLabel(compareType) {
        switch (compareType) {
            case 'term':
                return 'Loan Term';
            case 'rate':
                return 'Interest Rate';
            case 'amount':
                return 'Loan Amount';
            default:
                return '';
        }
    }
    
    // Comparison type buttons
    const compareButtons = document.querySelectorAll('.compare-btn');
    
    compareButtons.forEach(button => {
        button.addEventListener('click', () => {
            compareButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateComparisonChart();
        });
    });
    
    // FAQ toggle functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = question.querySelector('.faq-toggle i');
            
            // Toggle current FAQ item
            faqItem.classList.toggle('active');
            
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.replace('fa-plus', 'fa-minus');
            } else {
                answer.style.maxHeight = '0px';
                icon.classList.replace('fa-minus', 'fa-plus');
            }
            
            // Close other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherFaqItem = otherQuestion.parentElement;
                    const otherAnswer = otherFaqItem.querySelector('.faq-answer');
                    const otherIcon = otherQuestion.querySelector('.faq-toggle i');
                    
                    otherFaqItem.classList.remove('active');
                    otherAnswer.style.maxHeight = '0px';
                    otherIcon.classList.replace('fa-minus', 'fa-plus');
                }
            });
        });
    });
    
    // Initialize calculator and charts
    document.addEventListener('DOMContentLoaded', function() {
        calculateLoan();
        updateComparisonChart();
        
        // Add styles for FAQ sections
        const style = document.createElement('style');
        style.textContent = `
            .faq-item {
                margin-bottom: 15px;
                border: 1px solid var(--gray-light);
                border-radius: var(--border-radius);
                overflow: hidden;
            }
            
            .faq-question {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background-color: white;
                cursor: pointer;
            }
            
            .faq-question h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .faq-toggle {
                color: var(--primary);
                font-size: 18px;
            }
            
            .faq-answer {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
                background-color: var(--light);
                padding: 0 20px;
            }
            
            .faq-item.active .faq-answer {
                padding: 20px;
            }
            
            .formula {
                font-family: monospace;
                background-color: white;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                margin: 10px 0;
            }
            
            .comparison-container {
                display: flex;
                flex-wrap: wrap;
                gap: 30px;
                margin-bottom: 40px;
            }
            
            .comparison-chart-container {
                flex: 2;
                min-width: 300px;
                height: 400px;
            }
            
            .comparison-controls {
                flex: 1;
                min-width: 250px;
            }
            
            .comparison-control {
                margin-bottom: 20px;
            }
            
            .comparison-control label {
                display: block;
                font-weight: 600;
                margin-bottom: 10px;
            }
            
            .button-group {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .compare-btn {
                padding: 8px 15px;
                background-color: var(--gray-light);
                border: none;
                border-radius: 20px;
                font-size: 14px;
                cursor: pointer;
                transition: var(--transition);
            }
            
            .compare-btn.active {
                background-color: var(--primary);
                color: white;
            }
            
            .comparison-info {
                background-color: var(--light);
                padding: 15px;
                border-radius: var(--border-radius);
                margin-top: 20px;
            }
            
            .comparison-info p {
                margin-bottom: 10px;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    });
    
    // Initialize calculator
    calculateLoan();
});
