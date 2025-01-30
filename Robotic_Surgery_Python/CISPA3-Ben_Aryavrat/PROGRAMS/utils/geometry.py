# Author(s): Aryavrat Gupta


class Vertex:
    """
    Represents a 3D point with x, y, and z coordinates.
    """

    def __init__(self, x, y, z):
        """
        Initializes the vertex with x, y, z coordinates.
        """
        self.x = x
        self.y = y
        self.z = z


class Triangle:
    """
    Represents a triangle in a 3D mesh with vertices and neighbor indices.
    """

    def __init__(self, v1, v2, v3, n1, n2, n3):
        """
        Initializes the triangle with vertex indices (v1, v2, v3) and neighbor indices (n1, n2, n3).
        """
        self.vertices = (v1, v2, v3)
        self.neighbors = (n1, n2, n3)
