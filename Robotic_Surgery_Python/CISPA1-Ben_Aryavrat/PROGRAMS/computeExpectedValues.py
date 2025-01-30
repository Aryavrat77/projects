# Author(s): Aryavrat Gupta

from readData import read_calbody, read_calreadings
from pointSetRegistration import point_set_registration
import numpy as np

def compute_expected_values(filename):
    """
    Computes expected calibration values based on calibration body and readings data.

    Args:
        filename : str
            Prefix of files with calibration body and calibration readings data.

    Returns:
        N_C : int
            Number of calibration points.
    
        N_frames : int
            Number of frames.
    
        C_arr : list of numpy.ndarray
            List containing expected calibration values for each frame. Each value is an (n, 3) array.
    """
    
    # read calbody file
    N_D, N_A, N_C, d_coords, a_coords, c_coords = read_calbody(filename)
    
    # read calreadings file
    N_frames, frames_data = read_calreadings(filename)
    
    # declare F_D, F_A lists
    F_D = []
    F_A = []
    C_arr = []

    # compute registration frames
    for frame in range(N_frames):
        
        # extract data
        data = frames_data[frame]
        frame_data_D = data["D"]
        frame_data_A = data["A"]

        # initialize F_D list
        R, p = point_set_registration(d_coords, frame_data_D)
        T = np.eye(4)
        T[:3, :3] = R
        T[:3, 3] = p
        F_D.append(T)

        # initialize F_A list
        R, p = point_set_registration(a_coords, frame_data_A)
        T = np.eye(4)
        T[:3, :3] = R
        T[:3, 3] = p
        F_A.append(T)
    
    # compute expected values for C
    for frame in range(N_frames):
        # extract data
        data = frames_data[frame]
        T_D = F_D[frame]
        T_A = F_A[frame]
        
        # initialize C_exp
        C_exp = np.zeros((len(c_coords), 3)) 
        ones_column = np.ones((len(c_coords), 1))
        c_coords_with_ones = np.hstack((c_coords, ones_column))

        # compute expected values of C
        for i in range(len(c_coords)):
            C_exp_i = np.dot(np.linalg.pinv(T_D), np.dot(T_A, c_coords_with_ones[i]))
            C_exp[i] = C_exp_i[:3]

        # append to C array
        C_arr.append(C_exp)

    return N_C, N_frames, C_arr