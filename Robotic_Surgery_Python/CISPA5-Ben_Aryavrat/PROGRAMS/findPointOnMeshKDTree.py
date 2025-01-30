# Author(s): Aryavrat Gupta

import numpy as np
from PROGRAMS.findClosestPoint import closest_point_on_triangle

def closest_point_on_mesh_kd(point, centroid_tree, triangle_data):
    # Find the closest centroids and their corresponding triangles
    _, idxs = centroid_tree.query(point, k=20)  # Adjust k for number of neighbors to check

    min_dist = float('inf')
    closest_point = None

    # Loop through the closest triangles
    for idx in idxs:
        v1, v2, v3 = triangle_data[idx]
        tri_point = closest_point_on_triangle(point, np.array([v1.x, v1.y, v1.z]),
                                              np.array([v2.x, v2.y, v2.z]),
                                              np.array([v3.x, v3.y, v3.z]))
        dist = np.linalg.norm(tri_point - point)

        # Update if we find a closer point
        if dist < min_dist:
            min_dist = dist
            closest_point = tri_point
        
    return closest_point
