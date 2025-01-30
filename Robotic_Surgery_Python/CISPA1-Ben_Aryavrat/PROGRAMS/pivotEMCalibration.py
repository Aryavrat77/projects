# Author(s): Benjamin Miller

import numpy as np
from readData import read_empivot
from pivotCalibration import pivot_calibration
from pointSetRegistration import point_set_registration

def em_pivot_calibration(filename):
    """
    Performs pivot calibration of EM probe.

    Args:
        filename : str
            Prefix of file containing motion data for EM probe.

    Returns:
        t_g : numpy.ndarray
            1D array of length 3 with translation vector of EM frame.

        p_dimple : numpy.ndarray
            1D array of length 3 with position of dimple in EM frame.
    """

    # parse input file
    frames_data, N_G, N_frames = read_empivot(filename)

    R_list = []
    p_list = []
    
    # center reference frame g_0
    g = np.zeros((N_G, 3))
    average_G = np.mean(frames_data[0], axis=0)
    g = frames_data[0] - average_G
    
    for i in range(N_frames):
            
        # compute R and p
        R, p = point_set_registration(frames_data[i], g)

        # store R and p in respective lists
        R_list.append(R)
        p_list.append(p)

    t_g, p_dimple = pivot_calibration(R_list, p_list)

    return t_g, p_dimple