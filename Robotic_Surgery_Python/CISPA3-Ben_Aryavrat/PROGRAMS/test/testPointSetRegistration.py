# Author(s): Aryavrat Gupta and Benjamin Miller

import numpy as np
from PROGRAMS.utils.pointSetRegistration import point_set_registration

def test_point_set_registration():
    # Test 1: Pure translation
    source = np.array([(0, 0, 0), (0, 0, 1), (0, 1, 0), (1, 0, 0)])
    target = source + np.array([1, 2, 3])  # Translated by (1, 2, 3)
    
    R, p = point_set_registration(source, target)
    assert np.allclose(R, np.eye(3), atol=1e-6), f"Expected identity matrix for rotation, got {R}"
    assert np.allclose(p, [1, 2, 3], atol=1e-6), f"Expected translation vector [1, 2, 3], got {p}"
    print("Test 1 (Pure translation) passed.")

    # Test 2: Rotation by 45 degrees around each axis
    source = np.array([(1, 2, 3), (4, 5, 6), (7, 8, 9), (2, 4, 6)])
    target = np.array([(2.19, 0.93, 3.14), (5.89, 3.89, 6.18), (9.58, 6.85, 9.22), (3.18, 1.87, 6.26)])
    
    R, p = point_set_registration(source, target)
    assert np.allclose(np.dot(R, R.T), np.eye(3), atol=1e-6), "Rotation matrix R is not orthogonal"
    assert np.isclose(np.linalg.det(R), 1.0, atol=1e-6), "Rotation matrix determinant should be 1"
    print("Test 2 (Rotation by 45 degrees around each axis) passed.")

    # Test 3: Combined rotation and translation
    source = np.array([(1, 0, 0), (0, 1, 0), (0, 0, 1)])
    angle = np.radians(90)  # 90 degrees in radians
    R_90_z = np.array([[np.cos(angle), -np.sin(angle), 0],
                       [np.sin(angle), np.cos(angle), 0],
                       [0, 0, 1]])
    target = np.dot(source, R_90_z.T) + np.array([1, 1, 1])  # Rotate by 90 around Z-axis and translate by (1, 1, 1)
    
    R, p = point_set_registration(source, target)
    assert np.allclose(R, R_90_z, atol=1e-6), f"Expected 90-degree rotation matrix, got {R}"
    assert np.allclose(p, [1, 1, 1], atol=1e-6), f"Expected translation vector [1, 1, 1], got {p}"
    print("Test 3 (Combined rotation and translation) passed.")


test_point_set_registration()

