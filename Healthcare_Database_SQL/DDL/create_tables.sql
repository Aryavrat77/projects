-- Disable foreign key checks for clean setup
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist
DROP TABLE IF EXISTS Appointment_Procedures;
DROP TABLE IF EXISTS Procedures;
DROP TABLE IF EXISTS Billing;
DROP TABLE IF EXISTS Medical_Records;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Medical_Staff;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Insurance_Providers;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insurance Providers
CREATE TABLE Insurance_Providers (
    provider_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients
CREATE TABLE Patients (
    patient_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender CHAR(1),
    address VARCHAR(200),
    phone VARCHAR(15),
    email VARCHAR(100),
    insurance_provider_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (insurance_provider_id) REFERENCES Insurance_Providers(provider_id) ON DELETE SET NULL
);

-- Departments
CREATE TABLE Departments (
    department_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    head_staff_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Staff
CREATE TABLE Medical_Staff (
    staff_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    department_id INT,
    phone VARCHAR(15),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE SET NULL
);

-- Appointments
CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY,
    patient_id INT NOT NULL,
    staff_id INT,
    appointment_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL, -- Scheduled, Completed, Canceled, No-Show
    reason VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES Medical_Staff(staff_id) ON DELETE SET NULL
);

-- Medical Records
CREATE TABLE Medical_Records (
    record_id INT PRIMARY KEY,
    patient_id INT NOT NULL,
    staff_id INT,
    diagnosis VARCHAR(200),
    treatment_plan TEXT,
    prescription TEXT,
    notes TEXT,
    visit_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES Medical_Staff(staff_id) ON DELETE SET NULL
);

-- Billing
CREATE TABLE Billing (
    bill_id INT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT,
    amount DECIMAL(10,2) NOT NULL,
    insurance_claim_id VARCHAR(100),
    status VARCHAR(20) NOT NULL, -- Pending, Paid, Overdue, Insurance-Processing
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE SET NULL
);

-- Procedures
CREATE TABLE Procedures (
    procedure_id INT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    base_cost DECIMAL(10,2) NOT NULL,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE SET NULL
);

-- Appointment_Procedures (Junction Table)
CREATE TABLE Appointment_Procedures (
    appointment_id INT,
    procedure_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (appointment_id, procedure_id),
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (procedure_id) REFERENCES Procedures(procedure_id) ON DELETE CASCADE
);

