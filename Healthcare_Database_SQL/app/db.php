<?php
$host = "localhost";
$user = "root";
$password = "your_password"; // Change this to your MySQL password
$database = "healthcare_db";

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
