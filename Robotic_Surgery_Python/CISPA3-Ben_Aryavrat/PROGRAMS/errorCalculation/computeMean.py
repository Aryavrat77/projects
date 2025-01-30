# Author(s): Aryavrat Gupta

import os

def calculate_mean_distance(assignment_number, file_letter, search_type):
    # Define the file path based on inputs
    filename = f"PA{assignment_number}-{file_letter}-OurOutput-{search_type}.txt"
    filepath = os.path.join("OUTPUT", filename)

    # Check if the file exists
    if not os.path.exists(filepath):
        print(f"File '{filename}' not found in the OUTPUT directory.")
        return None

    last_column_values = []

    # Open and read the file
    with open(filepath, 'r') as file:
        # Skip the first line (header line)
        next(file)
        
        for line in file:
            # Split the line into columns by whitespace
            columns = line.strip().split()
            # Convert the last column to float and add to the list
            last_column_values.append(float(columns[-1]))

    # Calculate the mean of the last column
    if last_column_values:
        mean_value = sum(last_column_values) / len(last_column_values)
        print(f"Mean of the last column in '{filename}': {mean_value:.4f}")
        return mean_value
    else:
        print(f"No data found in '{filename}'")
        return None

for letter in 'ABCDEFGHJ':
    calculate_mean_distance(3, letter, 'Octree') # Change search_type as needed
