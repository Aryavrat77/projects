# Author(s): Aryavrat Gupta

import time
from PROGRAMS.findPointOnMesh import closest_point_on_mesh 
from PROGRAMS.findPointOnMeshKDTree import closest_point_on_mesh_kd
from PROGRAMS.buildTree.buildKDTree import build_kd_tree
from PROGRAMS.readFiles.parseMesh import parse_mesh_file
from PROGRAMS.findPointOnMeshOctree import closest_point_on_mesh_octree
from PROGRAMS.buildTree.buildOctree import build_octree
from PROGRAMS.utils.geometry import Vertex, Triangle


vertices, triangles = parse_mesh_file(f'PROGRAMS/data/Problem3MeshFile.sur')


# # Create vertices
# vertices = [
#     Vertex(0, 0, 0),
#     Vertex(1, 0, 0),
#     Vertex(0, 1, 0),
#     Vertex(0, 0, 1),
#     Vertex(1, 1, 0),
#     Vertex(1, 0, 1),
#     Vertex(0, 1, 1),
#     Vertex(1, 1, 1)
# ]

# # Create triangles using indices of vertices
# triangles = [
#     Triangle(0, 1, 2, -1, -1, -1),  # No neighbors in this simple test case
#     Triangle(1, 2, 4, -1, -1, -1),
#     Triangle(0, 1, 3, -1, -1, -1),
#     Triangle(4, 5, 6, -1, -1, -1)
# ]

# Sample data for testing
point = (1.5, 9.5, 0.5)

# Build KD-tree
kd_tree, triangle_data = build_kd_tree(vertices, triangles)

# Linear search
start_time = time.time()
linear_closest = closest_point_on_mesh(point, vertices, triangles)
print("Linear search closest point:", linear_closest)
print("Linear search time:", time.time() - start_time)

# KD-tree search
start_time = time.time()
kd_closest = closest_point_on_mesh_kd(point, kd_tree, triangle_data)
print("KD-tree closest point:", kd_closest)
print("KD-tree search time:", time.time() - start_time)

# Build octree
root = build_octree(vertices, triangles)

# Octree search
start_time = time.time()
octree_closest = closest_point_on_mesh_octree(point, root, vertices)
print("Octree closest point:", octree_closest)
print("Octree search time:", time.time() - start_time)