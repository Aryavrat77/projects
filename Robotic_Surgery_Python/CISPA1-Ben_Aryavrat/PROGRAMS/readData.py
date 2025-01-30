# Author(s): Aryavrat Gupta

import numpy as np

def read_calbody(filename):
    """
    Reads calibration body data from specified file.

    Args:
        filename (str): Prefix of calibration body file.

    Returns:
        tuple:
            - N_D (int): Number of D points.
            - N_A (int): Number of A points.
            - N_C (int): Number of C points.
            - d_coords (list of list of float): Coordinates of D points.
            - a_coords (list of list of float): Coordinates of A points.
            - c_coords (list of list of float): Coordinates of C points.
    """

    # define variables
    N_D, N_A, N_C = 0, 0, 0
    d_coords = []
    a_coords = []
    c_coords = []

    # read file
    with open(f"PROGRAMS/data/{filename}calbody.txt", "r") as file:
        # read first line
        first_line = file.readline().strip()

        # extract N_D, N_A, N_C, and filename
        data = first_line.split(',')
        N_D = int(data[0].strip())
        N_A = int(data[1].strip())
        N_C = int(data[2].strip())
        filename = data[3].strip()

        # read next N_D records (coordinates of d_i)
        for _ in range(N_D):
            d_coords.append([float(x) for x in file.readline().strip().split(',')])

        # read next N_A records (coordinates of a_i)
        for _ in range(N_A):
            a_coords.append([float(x) for x in file.readline().strip().split(',')])

        # read next N_C records (coordinates of c_i)
        for _ in range(N_C):
            c_coords.append([float(x) for x in file.readline().strip().split(',')])

    return N_D, N_A, N_C, d_coords, a_coords, c_coords

def read_calreadings(filename):
    """
    Reads calibration readings from specified file.

    Args:
        filename (str): Prefix of calibration readings file.

    Returns:
        tuple: A tuple containing:
            - N_frames (int): Number of frames in the readings.
            - frames_data (list of dict):
                - "D" (np.ndarray): Array of D coordinates.
                - "A" (np.ndarray): Array of A coordinates.
                - "C" (np.ndarray): Array of C coordinates.
    """
    
    # define variables
    N_D, N_A, N_C, N_frames= 0, 0, 0, 0
    frames_data = []

    # read file
    with open(f"PROGRAMS/data/{filename}calreadings.txt", "r") as file:
        # read first line
        first_line = file.readline().strip()

        # extract N_D, N_A, N_C, N_frames and filename
        data = first_line.split(',')

        N_D = int(data[0].strip())
        N_A = int(data[1].strip())
        N_C = int(data[2].strip())
        N_frames = int(data[3].strip())
        filename = data[4].strip()

        # loop through frames
        for frame in range(N_frames):
            frame_data = {
                "D": np.zeros((N_D, 3)),
                "A": np.zeros((N_A, 3)),
                "C": np.zeros((N_C, 3))
            }

            # read next N_D records (D_i coordinates)
            for i in range(N_D):
                frame_data["D"][i] = np.array([float(x) for x in file.readline().strip().split(',')])

            # read next N_A records (A_i coordinates)
            for i in range(N_A):
                frame_data["A"][i] = np.array([float(x) for x in file.readline().strip().split(',')])

            # read next N_C records (C_i coordinates)
            for i in range(N_C):
                frame_data["C"][i] = np.array([float(x) for x in file.readline().strip().split(',')])

            # append to frames_data
            frames_data.append(frame_data)

    return N_frames, frames_data

def read_empivot(filename):
    """
    Reads EM pivot data from specified file.

    Args:
        filename (str): Prefix of electromagnetic pivot file.

    Returns:
        tuple:
            - frames_data (list of np.ndarray): List of arrays containing G coordinates for each frame.
            - N_G (int): Number of G points.
            - N_frames (int): Number of frames in the data.
    """
    # define variables
    N_G, N_frames= 0, 0
    frames_data = []

    # read file
    with open(f"PROGRAMS/data/{filename}empivot.txt", "r") as file:
        # read first line
        first_line = file.readline().strip()

        # extract N_G, N_frames and filename
        data = first_line.split(',')

        N_G = int(data[0].strip())
        N_frames = int(data[1].strip())
        filename = data[2].strip()

        # loop through frames
        for frame in range(N_frames):
            frame_data = []

            # read next N_G records (G_i coordinates)
            for _ in range(N_G):
                frame_data.append([float(x) for x in file.readline().strip().split(',')])

            # append to frames_data
            frames_data.append(np.array(frame_data))

    return frames_data, N_G, N_frames


def read_optpivot(filename):
    """
    Reads optical pivot data from specified file.

    Args:
        filename (str): Prefix of optical pivot file.

    Returns:
        tuple:
            - frames_data (list of dict):
                - "D" (np.ndarray): Array of D coordinates.
                - "H" (np.ndarray): Array of H coordinates.
            - N_H (int): Number of H points.
            - N_D (int): Number of D points.
            - N_frames (int): Number of frames.
    """

    # define variables
    N_D, N_H, N_frames= 0, 0, 0
    frames_data = []

    # read file
    with open(f"PROGRAMS/data/{filename}optpivot.txt", "r") as file:
        # read first line
        first_line = file.readline().strip()

        # extract N_D, N_A, N_C, N_frames and filename
        data = first_line.split(',')

        N_D = int(data[0].strip())
        N_H = int(data[1].strip())
        N_frames = int(data[2].strip())
        filename = data[3].strip()

        # loop through frames
        for frame in range(N_frames):
            frame_data = {
                "D": np.zeros((N_D, 3)),
                "H": np.zeros((N_H, 3)),
            }

            # read next N_D records (D_i coordinates)
            for i in range(N_D):
                frame_data["D"][i] = np.array([float(x) for x in file.readline().strip().split(',')])

            # read next N_H records (H_i coordinates)
            for i in range(N_H):
                frame_data["H"][i] = np.array([float(x) for x in file.readline().strip().split(',')])

            # append to frames_data
            frames_data.append(frame_data)
    
    return frames_data, N_H, N_D, N_frames
