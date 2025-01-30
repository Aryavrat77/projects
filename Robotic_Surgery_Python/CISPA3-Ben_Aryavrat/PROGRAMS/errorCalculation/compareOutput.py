# Author(s): Aryavrat Gupta

import os

def read_distance_values(filepath):
    """Reads the last column values from the specified file."""
    last_column_values = []

    # Check if the file exists
    if not os.path.exists(filepath):
        print(f"File '{filepath}' not found.")
        return None

    # Open and read the file
    with open(filepath, 'r') as file:
        # Skip the first line (header line)
        next(file)
        
        for line in file:
            # Split the line into columns by whitespace
            columns = line.strip().split()
            # Convert the last column to float and add to the list
            last_column_values.append(float(columns[-1]))

    return last_column_values

def calculate_mean_squared_error(assignment_number, file_letter, search_type):
    # Define the file paths for the two files
    result_file = f"PA{assignment_number}-{file_letter}-OurOutput-{search_type}.txt"
    expected_file = f"PA{assignment_number}-{file_letter}-Debug-Output.txt"

    filepath1 = os.path.join("OUTPUT", result_file)
    filepath2 = os.path.join("PROGRAMS", "data", expected_file)

    # Read the last column values from both files
    values1 = read_distance_values(filepath1)
    values2 = read_distance_values(filepath2)

    # Ensure both files were read successfully and have the same number of values
    if values1 is None or values2 is None:
        return None
    if len(values1) != len(values2):
        print("The files have different numbers of rows.")
        return None

    # Calculate the Mean Squared Error
    squared_errors = [(v1 - v2) ** 2 for v1, v2 in zip(values1, values2)]
    mse = sum(squared_errors) / len(squared_errors)

    print(f"Mean Squared Error between '{result_file}' and '{expected_file}': {mse:.6f}")
    return mse

# # Example usage
# assignment_number = 3      # e.g., Assignment number 3
# file_letter = 'A'          # e.g., File letter A
# search_type = 'KDTree'    # e.g., First search type (e.g., KDTree)

search_types = ["Linear", "KDTree", "Octree"]
debug_file_letters = ['A', 'B', 'C', 'D', 'E', 'F']

for search_type in search_types:
    for debug_file_letter in debug_file_letters: 
        calculate_mean_squared_error(3, debug_file_letter, search_type)


# calculate_mean_squared_error(assignment_number, file_letter, search_type, isKnown=True)  # Known data
