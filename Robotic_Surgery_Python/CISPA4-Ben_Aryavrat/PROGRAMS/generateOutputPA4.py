# Author(s): Aryavrat Gupta

import numpy as np
import time
import os
from PROGRAMS.findPointOnMesh import closest_point_on_mesh
from PROGRAMS.findPointOnMeshKDTree import closest_point_on_mesh_kd
from PROGRAMS.findPointOnMeshOctree import closest_point_on_mesh_octree
from PROGRAMS.buildTree.buildKDTree import build_kd_tree
from PROGRAMS.buildTree.buildOctree import build_octree
from PROGRAMS.utils.pointSetRegistration import point_set_registration

def generate_output_PA4(output_dir, filename, search_type, frames, Atip, vertices, triangles, max_iterations=10, tol=1e-5):

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Define the full path for the output file
    output_path = os.path.join(output_dir, filename)

    # Prepare data structures
    Nsamps = len(frames)
    d_points = np.zeros((Nsamps, 3))
    
    # F_reg initialization
    # Start with identity: 4x4 homogeneous transform
    F_reg = np.eye(4)

    # Extract initial d_k points (with F_reg = I) from frames
    for i, frame in enumerate(frames):
        A = frame[0]
        B = frame[1]
        # Compute d_k = F_B,k^-1 * F_A,k * A_tip
        d_homo = np.linalg.inv(B) @ A @ np.append(Atip, 1)
        d_points[i, :] = d_homo[:3]
    
    # Build search structure if using KDTree or Octree
    total_build_time = 0
    if search_type == "KDTree":
        start_time = time.time()
        kd_tree, triangle_data = build_kd_tree(vertices, triangles)
        total_build_time = time.time() - start_time
    elif search_type == "Octree":
        start_time = time.time()
        root = build_octree(vertices, triangles)
        total_build_time = time.time() - start_time

    # ITERATIVE PROCEDURE TO FIND F_reg
    # We will iterate until F_reg converges
    for iteration in range(max_iterations):
        # Apply current F_reg to d_points to get s_points
        ones = np.ones((d_points.shape[0], 1))
        d_homo = np.hstack((d_points, ones))
        s_homo = (F_reg @ d_homo.T).T
        s_points = s_homo[:, :3]
        # print("Iteration: ", iteration)
        
        # Find closest points c_k on the mesh for each s_k
        c_points = np.zeros_like(s_points)
        
        # Depending on the search type
        if search_type == "Linear":
            for i in range(s_points.shape[0]):
                c_points[i] = closest_point_on_mesh(s_points[i], vertices, triangles)
        elif search_type == "KDTree":
            for i in range(s_points.shape[0]):
                c_points[i] = closest_point_on_mesh_kd(s_points[i], kd_tree, triangle_data)
        elif search_type == "Octree":
            for i in range(s_points.shape[0]):
                c_points[i] = closest_point_on_mesh_octree(s_points[i], root, vertices)
        else:
            raise ValueError(f"Invalid search type: {search_type}")

        # Compute a new F_reg using point_set_registration
        R, p = point_set_registration(d_points, c_points)

        # Construct candidate F_reg
        F_reg_candidate = np.eye(4)
        F_reg_candidate[:3, :3] = R
        F_reg_candidate[:3, 3] = p

        # Check for convergence (compare with previous F_reg)
        diff = np.linalg.norm(F_reg_candidate - F_reg, ord='fro')
        F_reg = F_reg_candidate

        if diff < tol:
            # Converged
            break

    # After convergence, use final F_reg to compute and output results
    # We will output s_k, c_k, and |s_k - c_k|
    total_search_time = 0
    search_count = Nsamps

    with open(output_path, 'w') as file:
        file.write(f"{Nsamps} \"{filename}\"\n")

        # Recompute s_points and c_points using final F_reg
        d_homo = np.hstack((d_points, np.ones((d_points.shape[0], 1))))
        s_homo = (F_reg @ d_homo.T).T
        s_points = s_homo[:, :3]

        c_points = np.zeros_like(s_points)
        if search_type == "Linear":
            for i in range(s_points.shape[0]):
                start_time = time.time()
                c_points[i] = closest_point_on_mesh(s_points[i], vertices, triangles)
                total_search_time += time.time() - start_time
        elif search_type == "KDTree":
            for i in range(s_points.shape[0]):
                start_time = time.time()
                c_points[i] = closest_point_on_mesh_kd(s_points[i], kd_tree, triangle_data)
                total_search_time += time.time() - start_time
        elif search_type == "Octree":
            for i in range(s_points.shape[0]):
                start_time = time.time()
                c_points[i] = closest_point_on_mesh_octree(s_points[i], root, vertices)
                total_search_time += time.time() - start_time

        # Write out the final data
        for i in range(Nsamps):
            d_coords = s_points[i]
            c_coords = c_points[i]
            difference_magnitude = np.linalg.norm(d_coords - c_coords)
            file.write(f"{d_coords[0]:8.2f} {d_coords[1]:8.2f} {d_coords[2]:8.2f}    "
                       f"{c_coords[0]:8.2f} {c_coords[1]:8.2f} {c_coords[2]:8.2f}    "
                       f"{difference_magnitude:8.3f}\n")

    avg_build_time = total_build_time if search_type in ["KDTree", "Octree"] else 0
    avg_search_time = total_search_time / search_count
    if search_type != "Linear":
        print(f"Average build time for {search_type}: {avg_build_time:.6f} seconds")
    print(f"Average search time for {search_type}: {avg_search_time:.6f} seconds")
