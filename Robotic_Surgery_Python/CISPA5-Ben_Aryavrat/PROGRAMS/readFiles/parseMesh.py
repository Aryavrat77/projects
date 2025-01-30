# Author(s): Aryavrat Gupta

from PROGRAMS.utils.geometry import Vertex, Triangle

def parse_mesh_file(filename):
    vertices = [] # List of Vertex objects
    triangles = [] # List of Triangle objects

    with open(filename, 'r') as file:
        # Parse number of vertices
        n_vertices = int(file.readline().strip())
        # Parse each vertex
        for _ in range(n_vertices):
            x, y, z = map(float, file.readline().strip().split())
            vertices.append(Vertex(x, y, z))
        
        # Parse number of triangles
        n_triangles = int(file.readline().strip())
                
        # Parse each triangle
        for _ in range(n_triangles):
            data = list(map(int, file.readline().strip().split()))
            v1, v2, v3, n1, n2, n3 = data[0], data[1], data[2], data[3], data[4], data[5]
            triangles.append(Triangle(v1, v2, v3, n1, n2, n3))
    
    return vertices, triangles

# vertices, triangles = parse_mesh_file('PROGRAMS/data/Problem3MeshFile.sur')

# print(f"Vertices: {vertices[0].x}, {vertices[0].y}, {vertices[0].z}")
# print(f"Triangles: {triangles[0].vertices}")