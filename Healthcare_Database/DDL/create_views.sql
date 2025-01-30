CREATE OR REPLACE VIEW Patient_History AS
SELECT 
    p.patient_id,
    p.first_name,
    p.last_name,
    COUNT(DISTINCT a.appointment_id) as total_visits,
    GROUP_CONCAT(DISTINCT mr.diagnosis) as all_diagnoses,
    SUM(b.amount) as total_bills,
    SUM(CASE WHEN b.status = 'Paid' THEN b.amount ELSE 0 END) as total_paid,
    MAX(a.appointment_date) as last_visit,
    COUNT(DISTINCT ms.staff_id) as different_doctors_seen
FROM Patients p
LEFT JOIN Appointments a ON p.patient_id = a.patient_id
LEFT JOIN Medical_Records mr ON p.patient_id = mr.patient_id
LEFT JOIN Billing b ON p.patient_id = b.patient_id
LEFT JOIN Medical_Staff ms ON a.staff_id = ms.staff_id
GROUP BY p.patient_id;
