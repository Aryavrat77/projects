# Author(s): Aryavrat Gupta


import numpy as np
from readData import read_optpivot
from readData import read_calbody
from pivotCalibration import pivot_calibration
from pointSetRegistration import point_set_registration

def opt_pivot_calibration(filename):
    """
    Performs pivot calibration of optical probe.

    Args:
        filename : str
            Prefix of file containing motion data and calibration data for optical probe.

    Returns:
        t_g : numpy.ndarray
            1D array of length 3 with translation vector of EM frame.

        p_dimple : numpy.ndarray
            1D array of length 3 with position of dimple in EM frame.
    """

    # parse input file
    frames_data, N_H, N_D, N_frames = read_optpivot(filename)
    N_D, N_A, N_C, d_coords, a_coords, c_coords = read_calbody(filename)

    R_list = []
    p_list = []
    F_D = []

    # center reference frame h_0
    h = np.zeros((N_H, 3))
    average_H = np.mean(frames_data[0]["H"], axis=0)
    h = frames_data[0]["H"] - average_H
    
    for i in range(N_frames):

        # extract data
        data = frames_data[i]
        frame_data_D = data["D"]
    
        # compute FD transformation
        R, p = point_set_registration(d_coords, frame_data_D)

        # compute transformed H coordinates
        H = frames_data[i]["H"]
        transformed_H = np.dot(np.linalg.inv(R), (H - p).T).T

        # compute R and p
        R, p = point_set_registration(transformed_H, h)

        # store R and p in respective lists
        R_list.append(R)
        p_list.append(p)
        
    t_g, p_dimple = pivot_calibration(R_list, p_list)

    return t_g, p_dimple