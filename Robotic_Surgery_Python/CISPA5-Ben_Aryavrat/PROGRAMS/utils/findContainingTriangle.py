import numpy as np

def find_containing_triangle(c, triangles, vertices):
    """
    Find the triangle that contains the closest point c.

    Args:
        c : np.ndarray
            The closest point (3,).
        triangles : list of Triangle objects
            A list of Triangle objects, where each Triangle contains vertex indices.
        vertices : list of Vertex objects
            The vertex coordinates as Vertex objects.

    Returns:
        triangle : Triangle
            The Triangle object containing c.
    """
    for triangle in triangles:
        # Access vertex indices from the Triangle object
        v0_idx, v1_idx, v2_idx = triangle.vertices
        v0, v1, v2 = vertices[v0_idx], vertices[v1_idx], vertices[v2_idx]

        # Compute the normal of the triangle
        normal = np.cross(v1 - v0, v2 - v0)
        normal /= np.linalg.norm(normal)

        # Check if c lies on or near the plane of the triangle
        if np.isclose(np.dot(normal, c - v0.to_array()), 0, atol=1e-6):
            return triangle

    raise ValueError("No containing triangle found. Check your closest point computation.")
