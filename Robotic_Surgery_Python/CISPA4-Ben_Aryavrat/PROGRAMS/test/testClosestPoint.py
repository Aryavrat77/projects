# Author(s): Aryavrat Gupta

import numpy as np
from PROGRAMS.findClosestPoint import closest_point_on_triangle 

def test_closest_point_on_triangle():
    # Test case 1: Point inside the triangle
    a = (0.5, 0.5, 0)
    p = (0, 0, 0)
    q = (1, 0, 0)
    r = (0, 1, 0)
    expected = np.array([0.5, 0.5, 0])
    result = closest_point_on_triangle(a, p, q, r)
    assert np.allclose(result, expected), f"Test case 1 failed: {result} != {expected}"

    # Test case 2: Point outside the triangle, closest to edge pq
    a = (0.5, -0.2, 0)
    expected = np.array([0.5, 0, 0])
    result = closest_point_on_triangle(a, p, q, r)
    assert np.allclose(result, expected), f"Test case 2 failed: {result} != {expected}"

    # Test case 3: Point outside the triangle, closest to edge pr
    a = (-0.2, 0.5, 0)
    expected = np.array([0, 0.5, 0])
    result = closest_point_on_triangle(a, p, q, r)
    assert np.allclose(result, expected), f"Test case 3 failed: {result} != {expected}"

    # Test case 4: Point outside the triangle, closest to vertex q
    a = (1.5, 0.5, 0)
    expected = np.array([1, 0, 0])
    result = closest_point_on_triangle(a, p, q, r)
    assert np.allclose(result, expected), f"Test case 4 failed: {result} != {expected}"

    # Test case 5: Point outside the triangle, closest to edge qr
    a = (0.5, 0.8, 0)
    expected = np.array([0.35, 0.65, 0])
    result = closest_point_on_triangle(a, p, q, r)
    assert np.allclose(result, expected), f"Test case 5 failed: {result} != {expected}"

    print("All test cases passed.")


test_closest_point_on_triangle()
