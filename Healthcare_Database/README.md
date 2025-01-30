Start by setting the working directory to the project root. 

To create synthetic data:

Set up a python virtual environment: python3 -m venv .venv
Activate the environment: source .venv/bin/activate
Install dependencies: pip install faker
Generate data: python3 DML/generate_data.py

To set up the database:

mysql.server start (On MacOS or Start the MySQL server using GUI in settings)
mysql -u root -p (Log in to MySQL)
CREATE DATABASE healthcare_db;
USE healthcare_db;
SOURCE path/to/create_tables.sql (SOURCE DDL/create_tables.sql)
SOURCE path/to/load_data.sql (SOURCE DML/load_data.sql)


To run Queries: 

SOURCE path/to/simple_queries.sql (SOURCE Queries/simple_queries.sql)
SOURCE path/to/complex_queries.sql (SOURCE Queries/complex_queries.sql)

To use the web server:

php -v (verify PHP installation)
cd app
Make sure MySQL is running
Locate app/db.php and change configuration ($user = "root"; $password = "";) as needed
php -S localhost:8000
http://localhost:8000


Debugging:

If the files don't have read permissions:
chmod +r path/to/file
