# Author(s): Aryavrat Gupta

from pivotEMCalibration import em_pivot_calibration
from pivotOptCalibration import opt_pivot_calibration
from computeExpectedValues import compute_expected_values
import os
import argparse


def generate_output(filename):
    """
    Generates an output file containing expected and estimated positions based on calibration data.

    Args:
        filename : str
            Prefix of the input file.

    Returns:
        None.
    """

    output_folder = os.path.join(os.path.dirname(__file__), "..", "OUTPUT")

    # compute expected values for C
    N_C, N_frames, C_exp = compute_expected_values(filename)

    # compute estimated values for post position of EM probe
    em_est_pos = em_pivot_calibration(filename)[0]

    # Compute estimated values for post position of Optical probe
    opt_est_pos = opt_pivot_calibration(filename)[0]

    # prepare output filename
    output_filename = os.path.relpath(os.path.join(output_folder, f"{filename}our-output.txt"), start=os.getcwd())

    # write output file in specified format
    with open(output_filename, "w") as f:
        # header line with N_C, N_frames, and filename
        f.write(f"{N_C}, {N_frames}, {output_filename}\n")

        # EM estimated positions
        f.write(f"  {em_est_pos[0]:.2f},   {em_est_pos[1]:.2f},   {em_est_pos[2]:.2f}\n")

        # optical estimated positions
        f.write(f"  {opt_est_pos[0]:.2f},   {opt_est_pos[1]:.2f},   {opt_est_pos[2]:.2f}\n")

        # expected values for C
        for i in range(N_frames):
            for j in range(N_C):
                f.write(f"  {C_exp[i][j][0]:.2f},   {C_exp[i][j][1]:.2f},   {C_exp[i][j][2]:.2f}\n")

    print(f"Output written to {output_filename}")

generate_output("pa1-debug-a-")
generate_output("pa1-debug-b-")
generate_output("pa1-debug-c-")
generate_output("pa1-debug-d-")
generate_output("pa1-debug-e-")
generate_output("pa1-debug-f-")
generate_output("pa1-debug-g-")
generate_output("pa1-unknown-h-")
generate_output("pa1-unknown-i-")
generate_output("pa1-unknown-j-")
generate_output("pa1-unknown-k-")