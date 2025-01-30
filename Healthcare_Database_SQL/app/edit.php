<?php
include 'db.php';

$patient_id = $_GET['id'];

// Fetch the patient record
$sql = "SELECT * FROM Patients WHERE patient_id = $patient_id";
$result = $conn->query($sql);
$patient = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Patient</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Edit Patient</h1>
    <form action="save.php" method="POST">
        <input type="hidden" name="patient_id" value="<?php echo $patient['patient_id']; ?>">
        
        <label for="first_name">First Name:</label>
        <input type="text" id="first_name" name="first_name" value="<?php echo $patient['first_name']; ?>" required><br>
        
        <label for="last_name">Last Name:</label>
        <input type="text" id="last_name" name="last_name" value="<?php echo $patient['last_name']; ?>" required><br>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="<?php echo $patient['email']; ?>" required><br>
        
        <button type="submit">Save Changes</button>
    </form>
</body>
</html>
