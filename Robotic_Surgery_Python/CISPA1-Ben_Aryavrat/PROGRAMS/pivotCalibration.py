# Author(s): Aryavrat Gupta and Benjamin Miller

import numpy as np


def pivot_calibration(R_matrices, p_vectors):
    """
    Performs pivot calibration using rotation matrices and translation vectors.

    Args:
        R_matrices : list of numpy.ndarray containing (N_frames) rotation matrices, each of shape (3, 3).
        p_vectors  : list of numpy.ndarray containing (N_frames) translation vectors, each of shape (3,).

    Returns:
        t_g      : (3,) numpy.ndarray representing estimated translation vector
        p_dimple : (3,) numpy.ndarray representing estimated EM position of dimple
    """
    
    N_frames = len(R_matrices)
    
    # check R_matrices and p_vectors have same number of frames
    assert N_frames == len(p_vectors), "Number of rotation matrices and translation vectors must be the same."

    # initialize A and b vector for least squares problem
    A = []
    b = []

    # loop through each frame
    for k in range(N_frames):
        # extract rotation matrix R[k] and translation vector p[k]
        R_k = R_matrices[k]
        p_k = p_vectors[k]

        # construct 3x6 augmented matrix [R[k] | -I]
        A_k = np.hstack((R_k, -np.eye(3)))

        # append A_k to A
        A.append(A_k)

        # right-hand side of the equation is -p[k]
        b_k = -p_k

        # append b_k to b (3N_frames x 1)
        b.append(b_k)

    # stack all matrices A_k vertically to form a (3N_frames x 6) matrix
    A = np.vstack(A)

    # stack all b_k vectors vertically to form a (3N_frames,1) vector
    b = np.hstack(b)

    # compute x using pseudoinverse of A
    x = np.linalg.pinv(A) @ b

    # extract t_g and p_dimple from x
    t_g = x[:3]          # first three elements are t_g
    p_dimple = x[3:]     # last three elements are p_dimple
    residuals = np.dot(A, x) - b # compute residuals

    return t_g, p_dimple

