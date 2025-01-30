-- Complex SQL Queries

-- 1. Top 5 Patients by Total Visits
SELECT subquery.patient_id, subquery.first_name, subquery.last_name, subquery.total_visits
FROM (
    SELECT Patients.patient_id, Patients.first_name, Patients.last_name, COUNT(Appointments.appointment_id) AS total_visits
    FROM Patients
    JOIN Appointments ON Patients.patient_id = Appointments.patient_id
    GROUP BY Patients.patient_id, Patients.first_name, Patients.last_name
) subquery
ORDER BY subquery.total_visits DESC
LIMIT 5;

-- 2. Revenue by Department
SELECT subquery.department_id, subquery.total_revenue
FROM (
    SELECT Medical_Staff.department_id, SUM(Billing.amount) AS total_revenue
    FROM Billing
    JOIN Appointments ON Billing.appointment_id = Appointments.appointment_id
    JOIN Medical_Staff ON Appointments.staff_id = Medical_Staff.staff_id
    GROUP BY Medical_Staff.department_id
) subquery;

-- 3. Doctors With the Most Appointments
SELECT subquery.staff_id, subquery.total_appointments
FROM (
    SELECT Medical_Staff.staff_id, COUNT(Appointments.appointment_id) AS total_appointments
    FROM Medical_Staff
    JOIN Appointments ON Medical_Staff.staff_id = Appointments.staff_id
    GROUP BY Medical_Staff.staff_id
) subquery
ORDER BY subquery.total_appointments DESC;

-- 4. Average Cost of Procedures by Department
SELECT Procedures.department_id, AVG(Procedures.base_cost) AS avg_cost
FROM Procedures
GROUP BY Procedures.department_id;

-- 5. Find Overdue Bills
SELECT Billing.bill_id, Billing.patient_id, Billing.amount, Billing.due_date, Billing.status
FROM Billing
WHERE Billing.due_date < CURDATE() AND Billing.status != 'Paid';

-- 6. Patient History With Outstanding Balance
SELECT Patients.patient_id, Patients.first_name, Patients.last_name, SUM(Billing.amount) AS outstanding_balance
FROM Patients
JOIN Billing ON Patients.patient_id = Billing.patient_id
WHERE Billing.status != 'Paid'
GROUP BY Patients.patient_id, Patients.first_name, Patients.last_name;

-- 7. Most Common Diagnoses
SELECT Medical_Records.diagnosis, COUNT(*) AS occurrence
FROM Medical_Records
GROUP BY Medical_Records.diagnosis
ORDER BY occurrence DESC
LIMIT 10;

-- 8. Find Patients With Multiple Insurance Providers
SELECT Patients.patient_id, COUNT(DISTINCT Patients.insurance_provider_id) AS insurance_count
FROM Patients
GROUP BY Patients.patient_id
HAVING insurance_count > 1;

-- 9. Monthly Revenue
SELECT MONTH(Billing.bill_date) AS month, SUM(Billing.amount) AS total_revenue
FROM Billing
GROUP BY MONTH(Billing.bill_date);

-- 10. Appointments With Procedures
SELECT Appointments.appointment_id, GROUP_CONCAT(Procedures.name) AS procedures
FROM Appointment_Procedures
JOIN Procedures ON Appointment_Procedures.procedure_id = Procedures.procedure_id
JOIN Appointments ON Appointment_Procedures.appointment_id = Appointments.appointment_id
GROUP BY Appointments.appointment_id;

-- 11. Longest Gap Between Appointments
SELECT patient_id, MAX(DATEDIFF(next_appointment, appointment_date)) AS max_gap
FROM (
    SELECT patient_id, appointment_date,
           LEAD(appointment_date) OVER (PARTITION BY patient_id ORDER BY appointment_date) AS next_appointment
    FROM Appointments
) gap_subquery
GROUP BY patient_id;

-- 12. Find Doctors With No Patients
SELECT Medical_Staff.staff_id, Medical_Staff.first_name, Medical_Staff.last_name
FROM Medical_Staff
WHERE Medical_Staff.staff_id NOT IN (
    SELECT DISTINCT Appointments.staff_id FROM Appointments
);

-- 13. Top Revenue-Generating Procedures
SELECT Procedures.procedure_id, Procedures.name, SUM(Appointment_Procedures.procedure_id) AS revenue_generated
FROM Procedures
JOIN Appointment_Procedures ON Procedures.procedure_id = Appointment_Procedures.procedure_id
GROUP BY Procedures.procedure_id
ORDER BY revenue_generated DESC
LIMIT 5;

-- 14. Patients Without Appointments
SELECT Patients.patient_id, Patients.first_name, Patients.last_name
FROM Patients
WHERE Patients.patient_id NOT IN (
    SELECT DISTINCT Appointments.patient_id FROM Appointments
);

-- 15. Diagnoses by Gender
SELECT Patients.gender, Medical_Records.diagnosis, COUNT(*) AS occurrence
FROM Medical_Records
JOIN Patients ON Medical_Records.patient_id = Patients.patient_id
GROUP BY Patients.gender, Medical_Records.diagnosis;

-- 16. Revenue From Insurance
SELECT Insurance_Providers.provider_id, Insurance_Providers.name, SUM(Billing.amount) AS revenue
FROM Billing
JOIN Patients ON Billing.patient_id = Patients.patient_id
JOIN Insurance_Providers ON Patients.insurance_provider_id = Insurance_Providers.provider_id
GROUP BY Insurance_Providers.provider_id, Insurance_Providers.name;

-- 17. Staff With Most Diagnoses
SELECT Medical_Staff.staff_id, Medical_Staff.first_name, Medical_Staff.last_name, COUNT(Medical_Records.record_id) AS diagnoses_recorded
FROM Medical_Staff
JOIN Medical_Records ON Medical_Staff.staff_id = Medical_Records.staff_id
GROUP BY Medical_Staff.staff_id
ORDER BY diagnoses_recorded DESC;

-- 18. Average Age of Patients by Diagnosis
SELECT Medical_Records.diagnosis, AVG(YEAR(CURDATE()) - YEAR(Patients.date_of_birth)) AS avg_age
FROM Medical_Records
JOIN Patients ON Medical_Records.patient_id = Patients.patient_id
GROUP BY Medical_Records.diagnosis;

-- 19. Staff Workload Distribution
SELECT Medical_Staff.staff_id, Medical_Staff.first_name, Medical_Staff.last_name, COUNT(Appointments.appointment_id) AS appointments_handled
FROM Medical_Staff
JOIN Appointments ON Medical_Staff.staff_id = Appointments.staff_id
GROUP BY Medical_Staff.staff_id;

-- 20. Inactive Patients
SELECT Patients.patient_id, Patients.first_name, Patients.last_name
FROM Patients
LEFT JOIN Appointments ON Patients.patient_id = Appointments.patient_id
GROUP BY Patients.patient_id, Patients.first_name, Patients.last_name
HAVING MAX(Appointments.appointment_date) < CURDATE() - INTERVAL 1 YEAR;
