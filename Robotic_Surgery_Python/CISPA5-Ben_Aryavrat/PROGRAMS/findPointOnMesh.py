# Author(s): Aryavrat Gupta

import numpy as np
from PROGRAMS.findClosestPoint import closest_point_on_triangle

def closest_point_on_mesh(point, vertices, triangles):
    """
    Finds the closest point on a triangular mesh to a given point.

    Args:
        point (array-like): The query point as (x, y, z).
        vertices (list of Vertex): List of vertices in the mesh.
        triangles (list of Triangle): List of triangles, each with vertex indices.

    Returns:
        np.ndarray: The closest point on the mesh.
    """
    min_dist = float('inf')
    closest_point = None

    for triangle in triangles:
        # Get actual vertex coordinates of the triangle
        v1, v2, v3 = (vertices[triangle.vertices[0]], 
                      vertices[triangle.vertices[1]], 
                      vertices[triangle.vertices[2]])
        
        # Calculate closest point on this triangle
        tri_point = closest_point_on_triangle(
            point, 
            np.array([v1.x, v1.y, v1.z]), 
            np.array([v2.x, v2.y, v2.z]), 
            np.array([v3.x, v3.y, v3.z])
        )
        
        # Calculate distance to the query point
        dist = np.linalg.norm(tri_point - point)
        
        # Update if this is the closest point so far
        if dist < min_dist:
            min_dist = dist
            closest_point = tri_point

    return closest_point
