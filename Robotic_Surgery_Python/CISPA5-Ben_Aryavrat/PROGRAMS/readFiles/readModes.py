import numpy as np

def read_modes(filename):

    with open(filename, 'r') as file:
        
        lines = file.readlines()
    
    # Parse the first line for Nvertices and Nmodes
    header = lines[0].strip()
    if "Nvertices" in header and "Nmodes" in header:
        n_vertices = int(header.split("Nvertices=")[1].split()[0])
        n_modes = int(header.split("Nmodes=")[1])
        # print(f"Number of vertices: {n_vertices}")
        # print(f"Number of modes: {n_modes}")
    else:
        raise ValueError("Invalid file header format")


    # Initialize a list to store data by mode
    mode_data = [None] * (n_modes + 1)  # Create a list with n_modes entries

    current_mode = None
    current_data = []

    # Iterate through the file line by line
    for line in lines[1:]:
        line = line.strip()
        
        # Check if the line is a mode header
        if line.startswith("Mode"):
            # If there's already collected data for a mode, save it
            if current_mode is not None:
                mode_data[current_mode] = np.array(current_data, dtype=float)

            # Reset for the next mode
            current_mode = int(line.split(":")[0].split("Mode")[1].strip())
            current_data = []  # Reset the data collection for the new mode
            

        elif line:  # If the line contains data
            current_data.append([float(x) for x in line.split(",")])

    # Save the last mode's data
    if current_mode is not None:
        mode_data[current_mode] = np.array(current_data, dtype=float)
    return mode_data


modes = read_modes('PROGRAMS/data/Problem5Modes.txt')

