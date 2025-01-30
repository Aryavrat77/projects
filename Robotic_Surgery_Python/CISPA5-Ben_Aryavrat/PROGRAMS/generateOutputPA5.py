import numpy as np
import os
import time 
from PROGRAMS.findPointOnMesh import closest_point_on_mesh
from PROGRAMS.findPointOnMeshKDTree import closest_point_on_mesh_kd
from PROGRAMS.buildTree.buildKDTree import build_kd_tree
from PROGRAMS.utils.pointSetRegistration import point_set_registration
from PROGRAMS.utils.computeBarycentric import compute_barycentric_coordinates
from PROGRAMS.utils.computeQ_k import compute_q_k
from PROGRAMS.utils.findContainingTriangle import find_containing_triangle
from PROGRAMS.utils.geometry import Vertex


def generate_output_PA5(output_dir, filename, frames, Atip, vertices, triangles, modes, max_iterations=10, tol=1e-5):
    """
    Perform deformable registration with iterative updates to rigid transformation and mode weights.

    Args:
        output_dir: Directory to save output.
        filename: Output file name.
        frames: Frames containing rigid body transformations.
        Atip: Pointer tip coordinates.
        vertices: Mean shape (Mode 0 vertices).
        triangles: Mesh triangles.
        modes: Array of shape (Nmodes, Nvertices, 3) containing mode displacements.
        max_iterations: Maximum number of iterations.
        tol: Convergence tolerance.

    Returns:
        None. Writes results to output file.
    """
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, filename)

    Nvertices = len(vertices)
    Nmodes = len(modes) - 1 # Exclude the mean shape (Mode 0)
    Nsamps = len(frames)

    # Initialize F_reg (rigid transformation) and mode weights (Lambda)
    F_reg = np.eye(4)  # Identity matrix
    Lambda = np.zeros(Nmodes)  # Initial mode weights
    deformed_vertices = vertices.copy()  # Start with the mean shape (Mode 0)

    # Compute initial d_k points (pointer tip in CT coordinates)
    d_points = np.zeros((Nsamps, 3))
    for i, frame in enumerate(frames):
        A, B = frame
        d_homo = np.linalg.inv(B) @ A @ np.append(Atip, 1)
        d_points[i, :] = d_homo[:3]

    mode_data = modes  # Mean shape (Mode 0) + other modes
    
    start_time = time.time()

    # Iterative refinement
    for iter in range(max_iterations):
        # Transform d_points using the current rigid transformation
        d_homo = np.hstack((d_points, np.ones((Nsamps, 1))))
        s_homo = (F_reg @ d_homo.T).T
        s_points = s_homo[:, :3]  # Transformed points in CT coordinates

        # Find closest points on the deformed mesh
        c_points = np.zeros_like(s_points)
        bary_coords = []
        triangles_for_points = []

        # Linear search 
        for i in range(Nsamps):
            c_points[i] = closest_point_on_mesh(s_points[i], deformed_vertices, triangles)
        
        # Compute barycentric coordinates for each closest point
        for i, c in enumerate(c_points):
            triangle = find_containing_triangle(c, triangles, deformed_vertices)  # Find the triangle for c
            triangles_for_points.append(triangle)
            bary_coords.append(compute_barycentric_coordinates(c, triangle, deformed_vertices))

        # Solve for Lambda using least squares
        q_k = np.zeros((Nsamps, Nmodes + 1, 3))  # Include mean shape as Mode 0
        for i, triangle in enumerate(triangles_for_points):
            for m in range(Nmodes + 1):
                q_k[i, m] = compute_q_k(bary_coords[i], triangle, mode_data, m)

        q0_k = q_k[:, 0]  # Mean shape projections
        qm_k = q_k[:, 1:]  # Mode projections

        A = qm_k.transpose(0, 2, 1).reshape(Nsamps * 3, Nmodes)  # (Nsamps * 3, Nmodes)
        b = (s_points - q0_k).flatten()  # (Nsamps * 3,)

        # Use pseudoinverse for comparison
        A_pinv = np.linalg.pinv(A)
        Lambda_check = A_pinv @ b
        # print("Lambda from pseudoinverse:", Lambda_check)

        Lambda, _, _, _ = np.linalg.lstsq(A, b.flatten(), rcond=None)
        
        vertices_array = np.array([[v.x, v.y, v.z] for v in vertices])

        # Update the deformed vertices as Vertex objects
        displacements = np.sum([Lambda[m] * modes[m + 1] for m in range(Nmodes)], axis=0)
        deformed_vertices_array = vertices_array + displacements

        # Convert the deformed vertices array back into a list of Vertex objects
        deformed_vertices = [Vertex(*coords) for coords in deformed_vertices_array]

        # Update rigid transformation F_reg
        R, p = point_set_registration(d_points, c_points)
        F_reg_candidate = np.eye(4)
        F_reg_candidate[:3, :3] = R
        F_reg_candidate[:3, 3] = p

        # Check for convergence
        diff = np.linalg.norm(F_reg_candidate - F_reg, ord='fro')
        F_reg = F_reg_candidate
        if diff < tol:
            break
    
    
    total_time = time.time() - start_time

    # Write results to output file
    with open(output_path, 'w') as file:
        # Write header: number of samples, filename, number of modes
        file.write(f"{Nsamps} {filename} {Nmodes}\n")
        
        # Write Lambda values
        lambda_values = "   ".join([f"{lam:.6f}" for lam in Lambda])
        file.write(f"{lambda_values}\n")
        for i in range(Nsamps):
            s_coords = s_points[i]
            c_coords = c_points[i]
            difference_magnitude = np.linalg.norm(s_coords - c_coords)
            file.write(f"{s_coords[0]:8.2f} {s_coords[1]:8.2f} {s_coords[2]:8.2f}    "
                       f"{c_coords[0]:8.2f} {c_coords[1]:8.2f} {c_coords[2]:8.2f}    "
                       f"{difference_magnitude:8.3f}\n")
    
    print(f"Total time for {max_iterations} Iterations: {total_time:.6f} seconds")
