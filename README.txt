# Deployment Instructions for Hostinger

## Upload Structure:
- Place all HTML and CSS files in the `public_html` directory.
- Upload the `php/` and `admin/` folders into `public_html`.

## Database Setup:
1. Create a database named `intelliflicks` in Hostinger.
2. Use phpMyAdmin to run the following SQL:

```
CREATE TABLE newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    dob DATE,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    loan_type VARCHAR(50),
    loan_amount DECIMAL(12,2),
    loan_purpose VARCHAR(100),
    loan_term INT,
    employment_status VARCHAR(50),
    annual_income DECIMAL(12,2),
    message TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Notes:
- Change DB credentials (`username`, `password`) in all PHP files to match your Hostinger DB.
- Access Admin Dashboard via `/admin/login.php` with:
  - Username: `admin`
  - Password: `admin123`

## Security:
- Update login credentials after first login.
