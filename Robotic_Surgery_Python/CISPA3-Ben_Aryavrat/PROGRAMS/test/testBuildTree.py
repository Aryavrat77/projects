# Author(s): Aryavrat Gupta

import numpy as np
from scipy.spatial import KDTree
from PROGRAMS.build.buildKDTree import build_kd_tree
from PROGRAMS.utils.geometry import Vertex, Triangle

def test_build_kd_tree():
    # Create mock vertices
    vertices = [
        Vertex(0, 0, 0),
        Vertex(1, 0, 0),
        Vertex(0, 1, 0),
        Vertex(0, 0, 1),
        Vertex(1, 1, 0),
        Vertex(1, 0, 1),
    ]

    # Create mock triangles using indices of the vertices
    triangles = [
        Triangle(0, 1, 2, -1, -1 , -1),
        Triangle(3, 4, 5, -1, -1 , -1),
    ]

    # Call the function to build KD-tree
    centroid_tree, triangle_data = build_kd_tree(vertices, triangles)

    # Test the KDTree structure
    assert isinstance(centroid_tree, KDTree), "centroid_tree is not a KDTree instance"
    assert len(triangle_data) == len(triangles), "triangle_data length does not match triangles input length"

    # Print results for verification
    print("KD-Tree centroids:", centroid_tree.data)
    print("Triangle data:")
    for triangle in triangle_data:
        triangle_coords = [(v.x, v.y, v.z) for v in triangle]
        print(triangle_coords)


test_build_kd_tree()
