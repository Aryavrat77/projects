# Author(s): Aryavrat Gupta

import numpy as np
from PROGRAMS.findClosestPoint import closest_point_on_triangle

def closest_point_on_mesh_octree(point, root, vertices):
    """
    Finds the closest point on the mesh within the octree.
    
    Args:
        point (tuple): The query point (x, y, z) for which the closest point on the mesh is sought.
        root (OctreeNode): The root of the octree containing mesh triangles.
        vertices (list): List of Vertex objects where each vertex's coordinates can be accessed.

    Returns:
        tuple: Closest point on the mesh to the given point.
    """
    closest_point = None
    min_dist = float('inf')
    nodes_to_check = [root]

    while nodes_to_check:
        node = nodes_to_check.pop()
        
        if node.is_leaf():
            for triangle in node.triangles:
                # Retrieve the actual vertices using indices from the triangle
                v1 = vertices[triangle.vertices[0]]
                v2 = vertices[triangle.vertices[1]]
                v3 = vertices[triangle.vertices[2]]
                
                # Find closest point on the current triangle
                tri_point = closest_point_on_triangle(
                    point, 
                    (v1.x, v1.y, v1.z), 
                    (v2.x, v2.y, v2.z), 
                    (v3.x, v3.y, v3.z)
                )
                dist = np.linalg.norm(np.array(point) - tri_point)
                
                # Update closest point if found closer
                if dist < min_dist:
                    min_dist = dist
                    closest_point = tri_point
        else:
            nodes_to_check.extend(node.children)

    return closest_point
