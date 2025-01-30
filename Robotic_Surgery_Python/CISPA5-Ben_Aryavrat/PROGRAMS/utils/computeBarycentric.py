import numpy as np

def compute_barycentric_coordinates(c, triangle, vertices):
    """
    Compute barycentric coordinates for point c with respect to a triangle.

    Args:
        c : np.ndarray
            The closest point (3,).
        triangle : Triangle
            A Triangle object containing vertex indices (3,).
        vertices : list of Vertex objects
            The vertex coordinates as Vertex objects.

    Returns:
        bary_coords : np.ndarray
            Barycentric coordinates [zeta, xi, psi].
    """
    # Get vertex indices from the triangle
    v0_idx, v1_idx, v2_idx = triangle.vertices
    # Convert Vertex objects to NumPy arrays
    v0, v1, v2 = vertices[v0_idx].to_array(), vertices[v1_idx].to_array(), vertices[v2_idx].to_array()

    # Compute vectors
    v0v1 = v1 - v0
    v0v2 = v2 - v0
    v0c = c - v0

    # Compute dot products
    d00 = np.dot(v0v1, v0v1)
    d01 = np.dot(v0v1, v0v2)
    d11 = np.dot(v0v2, v0v2)
    d20 = np.dot(v0c, v0v1)
    d21 = np.dot(v0c, v0v2)

    # Compute barycentric coordinates
    denom = d00 * d11 - d01 * d01
    if np.isclose(denom, 0, atol=1e-8):
        raise ValueError("Degenerate triangle detected.")
    xi = (d11 * d20 - d01 * d21) / denom
    psi = (d00 * d21 - d01 * d20) / denom
    zeta = 1 - xi - psi

    return np.array([zeta, xi, psi])
