# test_findContainingTriangle.py

import numpy as np
from PROGRAMS.utils.findContainingTriangle import find_containing_triangle
from PROGRAMS.utils.geometry import Vertex, Triangle

def test_find_containing_triangle():
    # Define vertices
    vertices = [
        Vertex(0.0, 0.0, 0.0),
        Vertex(1.0, 0.0, 0.0),
        Vertex(0.0, 1.0, 0.0),
        Vertex(1.0, 1.0, 0.0),
    ]

    # Define triangles
    triangles = [
        Triangle(0, 1, 2, -1, -1, -1),
        Triangle(1, 3, 2, -1, -1, -1),
    ]

    # Test point inside triangle 0
    p = np.array([0.25, 0.25, 0.0])
    triangle = find_containing_triangle(p, triangles, vertices)
    assert triangle == triangles[0], f"Failed for point inside triangle 0: {triangle}"

    # Test point inside triangle 1
    p = np.array([0.75, 0.75, 0.0])
    triangle = find_containing_triangle(p, triangles, vertices)
    assert triangle == triangles[1], f"Failed for point inside triangle 1: {triangle}"

    # Test point on shared edge
    p = np.array([0.5, 0.5, 0.0])
    triangle = find_containing_triangle(p, triangles, vertices)
    assert triangle in triangles, f"Failed for point on shared edge: {triangle}"

    # Test point outside all triangles
    p = np.array([1.5, 1.5, 0.0])
    try:
        triangle = find_containing_triangle(p, triangles, vertices)
        assert False, "Failed to raise exception for point outside all triangles"
    except ValueError as e:
        assert str(e) == "No containing triangle found. Check your closest point computation."


test_find_containing_triangle()
print("All tests passed for find_containing_triangle!")
