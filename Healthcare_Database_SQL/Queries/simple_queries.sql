-- Easy SQL Queries

-- 1. Retrieve All Patients
SELECT * FROM Patients;

-- 2. Count Total Appointments
SELECT COUNT(*) AS total_appointments FROM Appointments;

-- 3. Find Male Patients
SELECT first_name, last_name FROM Patients WHERE gender = 'M';

-- 4. List All Departments
SELECT name FROM Departments;

-- 5. Appointments in the Last Month
SELECT * FROM Appointments 
WHERE appointment_date >= CURDATE() - INTERVAL 30 DAY;

-- 6. Patients With Insurance
SELECT first_name, last_name 
FROM Patients 
WHERE insurance_provider_id IS NOT NULL;

-- 7. Find Total Revenue
SELECT SUM(amount) AS total_revenue FROM Billing;

-- 8. Doctors by Department
SELECT ms.first_name, ms.last_name, d.name AS department
FROM Medical_Staff ms
JOIN Departments d ON ms.department_id = d.department_id;

-- 9. Upcoming Appointments
SELECT * FROM Appointments 
WHERE appointment_date > NOW();

-- 10. Billing Status Breakdown
SELECT status, COUNT(*) AS count FROM Billing GROUP BY status;