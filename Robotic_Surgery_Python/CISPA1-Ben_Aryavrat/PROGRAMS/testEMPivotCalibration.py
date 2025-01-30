# Author(s): Benjamin Miller

import numpy as np
from pivotCalibration import pivot_calibration

# generate synthetic data
def generate_data(pivot_point, num_frames=5, num_markers=4):
    frames_data = []
    np.random.seed(0)
    
    # create reference frame
    reference_frame = np.random.rand(num_markers, 3) + pivot_point

    for _ in range(num_frames):
        # random rotation matrix
        angle = np.random.uniform(0, np.pi / 6)
        R = np.array([[np.cos(angle), -np.sin(angle), 0],
                      [np.sin(angle), np.cos(angle), 0],
                      [0, 0, 1]])

        # translation vector
        translation = np.random.uniform(-0.1, 0.1, size=3)

        rotated_points = np.dot(reference_frame - pivot_point, R.T) + pivot_point + translation
        frames_data.append(rotated_points)

    return frames_data, reference_frame

# known pivot point
known_pivot_point = np.array([1.0, 2.0, 3.0])
frames_data, reference_frame = generate_data(known_pivot_point)

# run pivot calibration
calculated_pivot_point = pivot_calibration(frames_data, reference_frame)

print(f"Known Pivot Point: {known_pivot_point}")
print(f"Calculated Pivot Point: {calculated_pivot_point}")


