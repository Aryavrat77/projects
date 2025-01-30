# Author(s): Aryavrat Gupta

import numpy as np
from scipy.spatial import KDTree

def build_kd_tree(vertices, triangles):
    """
    Builds a KD-tree from the centroids of the triangles in a mesh and stores the associated triangle data.

    Args:
        vertices (list of Vertex): A list of Vertex objects, where each vertex contains 3D coordinates (x, y, z).
        triangles (list of Triangle): A list of Triangle objects, each storing indices that refer to the vertices of the triangle.

    Returns:
        tuple:
            - KDTree: A KDTree built from the centroids of the triangles. Each centroid represents the average position of a triangle's vertices.
            - list of tuple: A list where each entry is a tuple containing three Vertex objects, corresponding to the vertices of each triangle.

    Example:
        Given a set of vertices and triangles:
        ```python
        vertices = [Vertex(0, 0, 0), Vertex(1, 0, 0), Vertex(0, 1, 0)]
        triangles = [Triangle(0, 1, 2)]
        kd_tree, triangle_data = build_kd_tree(vertices, triangles)
        ```

    Notes:
        - The centroids are computed by averaging the coordinates of the three vertices of each triangle.
        - The KDTree allows for efficient nearest-neighbor searches based on these centroids.
    """
    # Precompute triangle centroids and store triangle info
    triangle_centroids = []
    triangle_data = []  # To store triangle vertices for each centroid
    for triangle in triangles:
        v1, v2, v3 = vertices[triangle.vertices[0]], vertices[triangle.vertices[1]], vertices[triangle.vertices[2]]
        centroid = (np.array([v1.x, v1.y, v1.z]) + np.array([v2.x, v2.y, v2.z]) + np.array([v3.x, v3.y, v3.z])) / 3
        triangle_centroids.append(centroid)
        triangle_data.append((v1, v2, v3))

    # Build KD-tree
    centroid_tree = KDTree(triangle_centroids)

    return centroid_tree, triangle_data
