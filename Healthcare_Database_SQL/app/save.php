<?php
include 'db.php';

// Get updated values from the form
$patient_id = $_POST['patient_id'];
$first_name = $_POST['first_name'];
$last_name = $_POST['last_name'];
$email = $_POST['email'];

// Update the patient record
$sql = "UPDATE Patients 
        SET first_name = '$first_name', last_name = '$last_name', email = '$email' 
        WHERE patient_id = $patient_id";

if ($conn->query($sql) === TRUE) {
    header("Location: index.php"); // Redirect back to the main page
    exit;
} else {
    echo "Error updating record: " . $conn->error;
}
?>
