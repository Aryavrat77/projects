# Author(s): Benjamin Miller

from pivotCalibration import pivot_calibration
import numpy as np

# generated data
R = np.array([[0.866, -0.5, 0],
              [0.5, 0.866, 0],
              [0, 0, 1]])

p = np.array([1, 2, 3])

t_g, p_dimple = pivot_calibration(R, p)

