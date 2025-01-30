# Author(s): Aryavrat Gupta

import numpy as np
from PROGRAMS.readFiles.readData import read_body, read_sample  
from PROGRAMS.utils.pointSetRegistration import point_set_registration

def calculate_frame_transformations(body_filename_a, body_filename_b, sample_filename):
    """
    Calculate transformations F_A,k and F_B,k for each frame using point set registration.

    Args:
        body_filename_a (str): Filename prefix for body A LED data.
        body_filename_b (str): Filename prefix for body B LED data.
        sample_filename (str): Filename prefix for sample data.

    Returns:
        list: List of tuples containing (F_A_k, F_B_k) for each frame.
    """
    # Read marker coordinates for bodies A and B
    _, markers_A, _ = read_body(body_filename_a)
    _, markers_B, _ = read_body(body_filename_b)

    # Convert to numpy arrays
    markers_A = np.array(markers_A)
    markers_B = np.array(markers_B)

    # Read sample data
    NA, NB, ND, Nsamps, readings = read_sample(sample_filename)

    transformations = []

    # Loop through each frame to calculate F_A,k and F_B,k
    for frame_data in readings:
        # Extract marker coordinates for A and B in the frame
        frame_A = frame_data["A"]
        frame_B = frame_data["B"]

        # Calculate F_A,k
        R_A, p_A = point_set_registration(markers_A, frame_A)
        F_A_k = create_homogeneous_matrix(R_A, p_A)  # Store as a 4x4 homogeneous matrix

        # Calculate F_B,k
        R_B, p_B = point_set_registration(markers_B, frame_B)
        F_B_k = create_homogeneous_matrix(R_B, p_B)  # Store as a 4x4 homogeneous matrix

        # Append the transformations for this frame
        transformations.append((F_A_k, F_B_k))

    return transformations



def create_homogeneous_matrix(R, p):
    """
    Creates a 4x4 homogeneous transformation matrix from rotation matrix R and translation vector p.
    
    Args:
        R (numpy.ndarray): 3x3 rotation matrix.
        p (numpy.ndarray): 3x1 translation vector.

    Returns:
        numpy.ndarray: 4x4 homogeneous transformation matrix.
    """
    homogeneous_matrix = np.eye(4)
    homogeneous_matrix[:3, :3] = R
    homogeneous_matrix[:3, 3] = p
    return homogeneous_matrix

# Test the function
#print(calculate_frame_transformations("Problem3-BodyA", "Problem3-BodyB", "PA3-A-Debug-SampleReadingsTest")[0])