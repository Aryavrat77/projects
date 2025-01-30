def compute_q_k(bary_coords, triangle, mode_data, mode_index):
    """
    Compute the projection of a point onto either the mean shape (Mode 0) or a mode displacement.

    Args:
        bary_coords : np.ndarray
            Barycentric coordinates [zeta, xi, psi].
        triangle : Triangle
            A Triangle object containing vertex indices (3,).
        mode_data : list of np.ndarray
            List of modes, including the mean shape as mode 0 (Nvertices, 3 for each mode).
        mode_index : int
            Index of the mode to project onto (0 for mean shape, 1+ for displacements).

    Returns:
        q_k : np.ndarray
            The projection onto the specified mode (3,).
    """
    # Access barycentric coordinates
    zeta, xi, psi = bary_coords

    # Access vertex indices from the Triangle object
    v0_idx, v1_idx, v2_idx = triangle.vertices

    # Retrieve mode vertex data
    v0, v1, v2 = mode_data[mode_index][v0_idx], mode_data[mode_index][v1_idx], mode_data[mode_index][v2_idx]

    # Compute projection
    return zeta * v0 + xi * v1 + psi * v2
