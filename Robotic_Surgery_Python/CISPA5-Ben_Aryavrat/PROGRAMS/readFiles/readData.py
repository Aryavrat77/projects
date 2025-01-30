# Author(s): Benjamin Miller

import numpy as np

def read_body(filename):
    """
    Reads body marker LED data from the specified file.

    Args:
        filename (str): Prefix of calibration body file.

    Returns:
        tuple:
            - N_markers (int): Number of marker LEDs.
            - marker_coords (list of list of float): Coordinates of marker LEDs.
            - tip_coords (list of float): Coordinates of the tip.
    """

    # define variables
    N_markers = 0
    marker_coords = []
    tip_coords = []

    with open(f"./PROGRAMS/data/{filename}.txt", "r") as file:
        # read first line containing filename and marker count
        first_line = file.readline().strip()
        # extract filename and marker count (N_markers)
        data = first_line.split()
        N_markers = int(data[0].strip())  # Number of markers

        # read the next N_markers records (coordinates of markers)
        for _ in range(N_markers):
            marker_coords.append([float(x) for x in file.readline().strip().split()])

        # read the tip coordinates
        tip_coords = [float(x) for x in file.readline().strip().split()]

    return N_markers, marker_coords, tip_coords

def read_sample(filename):
    """
    Reads sample readings from a specified file based on the described format.

    Args:
        filename (str): Filename prefix for the sample readings file.

    Returns:
        tuple:
            - NA (int): Number of A body LED markers.
            - NB (int): Number of B body LED markers.
            - ND (int): Number of dummy/unneeded LED markers.
            - Nsamps (int): Number of sample frames.
            - readings (list of dict): A list of sample frame data where each
                                       frame contains:
                                       - 'A' (np.ndarray): Coordinates of A markers.
                                       - 'B' (np.ndarray): Coordinates of B markers.
                                       - 'D' (np.ndarray): Coordinates of Dummy markers.
    """
    NA, NB, ND, Nsamps = 0, 0, 0, 0
    readings = []

    with open(f"./PROGRAMS/data/{filename}.txt", "r") as file:
        # Read the first line to extract Ns, Nsamps, and the file name
        first_line = file.readline().strip().split(",")
        Ns = int(first_line[0])  # Total number of LEDs
        Nsamps = int(first_line[1])  # Number of sample frames
        file_name = first_line[2].strip()  # File name (not really used further)
    
        # NA, NB, and ND should be defined based on inputs from external body functions
        # Assuming read_body() functions for A and B provide their respective counts
        NA = read_body(f'Problem{file_name[2]}-BodyA')[0]  # External function to get NA (e.g., 16)
        NB = read_body(f'Problem{file_name[2]}-BodyB')[0]  # External function to get NB (e.g., 15)
        ND = Ns - NA - NB  # Calculate ND based on total LEDs

        # Now, loop through the sample frames and read the marker coordinates
        for _ in range(Nsamps):
            frame_data = {
                "A": np.zeros((NA, 3)),  # A body markers
                "B": np.zeros((NB, 3)),  # B body markers
                "D": np.zeros((ND, 3)),  # Dummy markers
            }

            # Read NA coordinates (A body markers)
            for i in range(NA):
                frame_data["A"][i] = np.array([float(x) for x in file.readline().strip().split(",")])

            # Read NB coordinates (B body markers)
            for i in range(NB):
                frame_data["B"][i] = np.array([float(x) for x in file.readline().strip().split(",")])

            # Read ND coordinates (Dummy markers)
            for i in range(ND):
                frame_data["D"][i] = np.array([float(x) for x in file.readline().strip().split(",")])

            # Append the frame data to the readings list
            readings.append(frame_data)

    return NA, NB, ND, Nsamps, readings

# print(read_body("Problem3-BodyA"))
# print(read_sample("PA3-A-Debug-SampleReadingsTest"))