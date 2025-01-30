# Author(s): Benjamin Miller

import numpy as np

def calculate_mean_error(actual_file, expected_file):
    """
    Calculates mean error between actual and expected pivot points for EM and optical trackers, 
    as well as expected calibration points.

    Args:
        actual_file : str
            Path to file containing actual calibration data.
    
        expected_file : str
            Path to the file containing expected calibration data.

    Returns:
        tuple:
            Mean error for EM points, mean error for optical points, and mean error for expected calibration points.
    """

    # read file and parse coordinates
    def parse_file(filename):
        em_points = []
        optical_points = []
        calibration_points = []

        with open(filename, 'r') as file:
            lines = file.readlines()
            for i, line in enumerate(lines):
                if i == 0:
                    continue
                elif i == 1:  # EM positions
                    em_values = list(map(float, line.strip().split(',')))
                    em_points.append(em_values)
                elif i == 2:  # optical positions
                    optical_values = list(map(float, line.strip().split(',')))
                    optical_points.append(optical_values)
                else:  # expected values for C
                    values = list(map(float, line.strip().split(',')))
                    calibration_points.append(values)

        return np.array(em_points), np.array(optical_points), np.array(calibration_points)

    # read files
    actual_em, actual_optical, actual_calibration = parse_file(actual_file)
    expected_em, expected_optical, expected_calibration = parse_file(expected_file)

    # compute mean error for EM points
    em_error = np.linalg.norm(actual_em - expected_em, axis=1)
    mean_em_error = np.mean(em_error)

    # compute mean error for Optical points
    optical_error = np.linalg.norm(actual_optical - expected_optical, axis=1)
    mean_optical_error = np.mean(optical_error)

    # compute mean error for Expected Calibration points
    calibration_error = np.linalg.norm(actual_calibration - expected_calibration, axis=1)
    mean_calibration_error = np.mean(calibration_error)

    print(f"Mean Error for EM Tracker Pivot Points: {mean_em_error:.4f}")
    print(f"Mean Error for Optical Tracker Pivot Points: {mean_optical_error:.4f}")
    print(f"Mean Error for Expected Calibration Points: {mean_calibration_error:.4f}")

    return mean_em_error, mean_optical_error, mean_calibration_error

# files
a1file = 'PROGRAMS/data/pa1-debug-a-output1.txt'
e1file = 'OUTPUT/pa1-debug-a-our-output.txt'
a2file = 'PROGRAMS/data/pa1-debug-b-output1.txt'
e2file = 'OUTPUT/pa1-debug-b-our-output.txt'
a3file = 'PROGRAMS/data/pa1-debug-c-output1.txt'
e3file = 'OUTPUT/pa1-debug-c-our-output.txt'
a4file = 'PROGRAMS/data/pa1-debug-d-output1.txt'
e4file = 'OUTPUT/pa1-debug-d-our-output.txt'
a5file = 'PROGRAMS/data/pa1-debug-e-output1.txt'
e5file = 'OUTPUT/pa1-debug-e-our-output.txt'
a6file = 'PROGRAMS/data/pa1-debug-f-output1.txt'
e6file = 'OUTPUT/pa1-debug-f-our-output.txt'
a7file = 'PROGRAMS/data/pa1-debug-g-output1.txt'
e7file = 'OUTPUT/pa1-debug-g-our-output.txt'

# calls
calculate_mean_error(e1file, a1file)
calculate_mean_error(e2file, a2file)
calculate_mean_error(e3file, a3file)
calculate_mean_error(e4file, a4file)
calculate_mean_error(e5file, a5file)
calculate_mean_error(e6file, a6file)
calculate_mean_error(e7file, a7file)
