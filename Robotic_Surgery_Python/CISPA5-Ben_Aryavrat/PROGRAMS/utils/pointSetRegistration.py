# Author(s): Benjamin Miller

import numpy as np

def point_set_registration(source, target):
    """
    Performs point set registration using Arun's method.

    Args:
        source : numpy.ndarray
            (N, 3) array of source point set.
        target : numpy.ndarray
            (N, 3) array of target point set.

    Returns:
        R : numpy.ndarray
            (3, 3) array representing optimal rotation matrix.
    
        p : numpy.ndarray
            A (3,) array representing optimal translation vector.
    """

    # compute average of both point sets and center
    average_source = np.mean(source, axis=0)
    average_target = np.mean(target, axis=0)

    source_centered = source - average_source
    target_centered = target - average_target

    # compute covariance matrix
    H = np.dot(source_centered.T, target_centered)

    # compute SVD on covariance matrix
    U, S, V = np.linalg.svd(H)

    # Check for zero or near-zero singular values
    if np.any(np.isclose(S, 0)):
        raise ValueError("Degenerate case encountered: one or more singular values are zero.")
    # print("Warning: Zero singular values detected. The point sets may be degenerate.")

    
    # calculate optimal rotation matrix
    R = np.dot(V.T, U.T)

    # check success
    if np.linalg.det(R) < 0:
        V[-1, :] *= -1
        R = np.dot(V.T, U.T)

    # compute optimal translation
    p = average_target - np.dot(R, average_source)

    # compute transformed points
    transformed_points = np.dot(source, R.T) + p

    # compute RMSE
    rmse = np.sqrt(np.mean(np.sum((target - transformed_points)**2, axis=1)))

    return R, p

