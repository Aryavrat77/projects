
import numpy as np
from PROGRAMS.utils.computeBarycentric import compute_barycentric_coordinates
from PROGRAMS.utils.geometry import Vertex, Triangle

def test_compute_barycentric_coordinates():
    # Define vertices of a triangle
    v0 = np.array([0.0, 0.0, 0.0])
    v1 = np.array([1.0, 0.0, 0.0])
    v2 = np.array([0.0, 1.0, 0.0])

    # Test point inside the triangle
    p = np.array([0.25, 0.25, 0.0])
    bary_coords = compute_barycentric_coordinates(p, Triangle(0, 1, 2, -1, -1, -1), [Vertex(*v0), Vertex(*v1), Vertex(*v2)])
    expected = np.array([0.5, 0.25, 0.25])
    assert np.allclose(bary_coords, expected, atol=1e-6), f"Failed for point inside triangle: {bary_coords}"

    # Test point on a vertex
    p = np.array([0.0, 0.0, 0.0])
    bary_coords = compute_barycentric_coordinates(p, Triangle(0, 1, 2, -1, -1, -1), [Vertex(*v0), Vertex(*v1), Vertex(*v2)])
    expected = np.array([1.0, 0.0, 0.0])
    assert np.allclose(bary_coords, expected, atol=1e-6), f"Failed for vertex point: {bary_coords}"

    # Test point on an edge
    p = np.array([0.5, 0.5, 0.0])
    bary_coords = compute_barycentric_coordinates(p, Triangle(0, 1, 2, -1, -1, -1), [Vertex(*v0), Vertex(*v1), Vertex(*v2)])
    expected = np.array([0.0, 0.5, 0.5])
    assert np.allclose(bary_coords, expected, atol=1e-6), f"Failed for edge point: {bary_coords}"

    # Test point outside the triangle
    p = np.array([-0.5, -0.5, 0.0])
    bary_coords = compute_barycentric_coordinates(p, Triangle(0, 1, 2, -1, -1, -1), [Vertex(*v0), Vertex(*v1), Vertex(*v2)])
    assert np.any(bary_coords < 0), "Failed for point outside triangle"

test_compute_barycentric_coordinates()
print("All tests passed for compute_barycentric_coordinates!")
