import os
import random
from faker import Faker

# Initialize Faker
fake = Faker()

# Utility functions
def escape_sql(value):
    """Escape single quotes for SQL."""
    return value.replace("'", "''")

def truncate(value, length):
    """Truncate strings to a maximum length."""
    return value[:length]

def truncate_phone(phone):
    """Truncate phone numbers to 15 characters."""
    return phone[:15]

def random_gender():
    return random.choice(["M", "F"])

def random_status():
    return random.choice(["Scheduled", "Completed", "Canceled", "No-Show"])

# Data generation
num_insurance_providers = 100
num_patients = 100
num_departments = 10
num_medical_staff = 100
num_appointments = 100
num_medical_records = 100
num_procedures = 100
num_billing = 100
num_appointment_procedures = 100

# Generate data for each table
data = {
    "Insurance_Providers": [
        f"({i}, '{escape_sql(fake.company())}', '{escape_sql(fake.name())}', '{truncate_phone(fake.phone_number())}', '{escape_sql(fake.email())}', DEFAULT)"
        for i in range(1, num_insurance_providers + 1)
    ],
    "Patients": [
        f"({i}, '{escape_sql(fake.first_name())}', '{escape_sql(fake.last_name())}', '{fake.date_of_birth()}', '{random_gender()}', '{escape_sql(fake.address())}', '{truncate_phone(fake.phone_number())}', '{escape_sql(fake.email())}', {random.randint(1, num_insurance_providers)}, DEFAULT)"
        for i in range(1, num_patients + 1)
    ],
    "Departments": [
        f"({i}, '{escape_sql(fake.job())}', '{escape_sql(fake.city())}', NULL, DEFAULT)"
        for i in range(1, num_departments + 1)
    ],
    "Medical_Staff": [
        f"({i}, '{escape_sql(fake.first_name())}', '{escape_sql(fake.last_name())}', '{escape_sql(fake.job())}', {random.randint(1, num_departments)}, '{truncate_phone(fake.phone_number())}', '{escape_sql(fake.email())}', DEFAULT)"
        for i in range(1, num_medical_staff + 1)
    ],
    "Appointments": [
        f"({i}, {random.randint(1, num_patients)}, {random.randint(1, num_medical_staff)}, '{fake.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S')}', '{random_status()}', '{escape_sql(fake.sentence())}', DEFAULT)"
        for i in range(1, num_appointments + 1)
    ],
    "Medical_Records": [
        f"({i}, {random.randint(1, num_patients)}, {random.randint(1, num_medical_staff)}, '{escape_sql(fake.text(max_nb_chars=50))}', '{escape_sql(fake.text(max_nb_chars=200))}', '{escape_sql(fake.text(max_nb_chars=100))}', '{escape_sql(fake.text(max_nb_chars=100))}', '{fake.date_this_year()}', DEFAULT)"
        for i in range(1, num_medical_records + 1)
    ],
    "Procedures": [
        f"({i}, '{escape_sql(fake.text(max_nb_chars=50))}', '{escape_sql(fake.text(max_nb_chars=200))}', {random.uniform(100, 1000):.2f}, {random.randint(1, num_departments)}, DEFAULT)"
        for i in range(1, num_procedures + 1)
    ],
    "Billing": [
        f"({i}, {random.randint(1, num_patients)}, {random.randint(1, num_appointments)}, {random.uniform(100, 1000):.2f}, '{escape_sql(fake.uuid4())}', '{random.choice(['Pending', 'Paid', 'Overdue', 'Insurance-Processing'])}', '{fake.date_this_year()}', '{fake.date_this_year()}', DEFAULT)"
        for i in range(1, num_billing + 1)
    ],
    "Appointment_Procedures": [
        f"({random.randint(1, num_appointments)}, {random.randint(1, num_procedures)}, '{escape_sql(fake.text(max_nb_chars=100))}', DEFAULT)"
        for _ in range(1, num_appointment_procedures + 1)
    ]
}

# Get the current directory of the script
current_dir = os.path.dirname(os.path.abspath(__file__))
output_file = os.path.join(current_dir, "load_data.sql")

# Write to file
with open(output_file, "w") as f:
    for table, rows in data.items():
        f.write(f"-- {table}\n")
        f.write(f"INSERT INTO {table} VALUES\n")
        f.write(",\n".join(rows) + ";\n\n")

print(f"Data generation completed. SQL file saved as {output_file}.")
