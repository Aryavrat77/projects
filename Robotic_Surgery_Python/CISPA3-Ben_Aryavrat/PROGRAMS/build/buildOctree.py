# Author(s): Aryavrat Gupta

import numpy as np
from PROGRAMS.utils.geometry import Vertex, Triangle

class OctreeNode:
    """
    A class representing a node in an octree, which is used to partition 3D space for efficient spatial queries.

    Attributes:
        center (np.array): The center point of the octree node's cube.
        size (float): The length of the side of the cube represented by this node.
        children (list): A list of child OctreeNodes, representing the subdivided space.
        triangles (list): A list of Triangle objects or references contained within this node.

    Methods:
        is_leaf(): Returns True if the node has no children.
        subdivide(): Divides the node into 8 smaller sub-nodes, each representing an octant of the original cube.
        insert(triangle, vertices): Inserts a triangle into the node, subdividing if necessary.
        contains_triangle(triangle, vertices): Checks if a triangle is fully contained within this node.
    """

    def __init__(self, center, size):
        self.center = center
        self.size = size
        self.children = []
        self.triangles = []

    def is_leaf(self):
        """Check if the node is a leaf node (has no children)."""
        return len(self.children) == 0

    def subdivide(self):
        """
        Subdivides the node into 8 smaller nodes, representing the octants around the center.
        Each child node will have half the size of the current node.
        """
        half_size = self.size / 2
        quarter_size = self.size / 4

        # Create 8 sub-cubes (octants) around the center
        for dx in (-quarter_size, quarter_size):
            for dy in (-quarter_size, quarter_size):
                for dz in (-quarter_size, quarter_size):
                    new_center = self.center + np.array([dx, dy, dz])
                    child = OctreeNode(new_center, half_size)
                    self.children.append(child)

    def insert(self, triangle, vertices):
        """
        Inserts a triangle into the octree node. If the node has too many triangles,
        it subdivides itself and distributes the triangles among its children.

        Args:
            triangle (Triangle): The triangle to be inserted.
            vertices (list of Vertex): The list of vertices in the mesh.
        """
        if self.is_leaf():
            if len(self.triangles) < 5:
                self.triangles.append(triangle)
            else:
                self.subdivide()
                for tri in self.triangles:
                    self._insert_in_children(tri, vertices)
                self.triangles.clear()
                self._insert_in_children(triangle, vertices)
        else:
            self._insert_in_children(triangle, vertices)

    def _insert_in_children(self, triangle, vertices):
        """
        Attempts to insert the triangle into one of the child nodes.

        Args:
            triangle (Triangle): The triangle to be inserted.
            vertices (list of Vertex): The list of vertices in the mesh.
        """
        for child in self.children:
            if child.contains_triangle(triangle, vertices):
                child.insert(triangle, vertices)
                break

    def contains_triangle(self, triangle, vertices):
        """
        Checks if a triangle is fully contained within this node.

        Args:
            triangle (Triangle): The triangle to check.
            vertices (list of Vertex): The list of vertices in the mesh.

        Returns:
            bool: True if the triangle is within the node's bounds, False otherwise.
        """
        for vertex_index in triangle.vertices:
            vertex = vertices[vertex_index]
            vertex_coords = np.array([vertex.x, vertex.y, vertex.z])
            if not ((self.center - self.size / 2 <= vertex_coords).all() and 
                    (vertex_coords <= self.center + self.size / 2).all()):
                return False
        return True

def find_octree_root_center_and_size(vertices):
    """
    Calculates the center and size for the root of the octree based on the given vertices.

    Args:
        vertices (list of Vertex): The list of vertices in the mesh.

    Returns:
        tuple: A tuple containing the center (np.array) and the size (float) of the root node.
    """
    vertices_array = np.array([[v.x, v.y, v.z] for v in vertices])
    min_coords = vertices_array.min(axis=0)
    max_coords = vertices_array.max(axis=0)
    center = (min_coords + max_coords) / 2
    size = np.max(max_coords - min_coords)
    return center, size

def build_octree(vertices, triangles):
    """
    Builds an octree from the given vertices and triangles of a 3D mesh.

    Args:
        vertices (list of Vertex): A list of vertices representing points in 3D space.
        triangles (list of Triangle): A list of triangles defined by indices referring to vertices.

    Returns:
        OctreeNode: The root node of the constructed octree.
    """
    center, size = find_octree_root_center_and_size(vertices)
    root = OctreeNode(center, size)
    for triangle in triangles:
        root.insert(triangle, vertices)
    return root
