# Author(s): Aryavrat Gupta

import numpy as np
import time
import os
from PROGRAMS.findPointOnMesh import closest_point_on_mesh
from PROGRAMS.findPointOnMeshKDTree import closest_point_on_mesh_kd
from PROGRAMS.findPointOnMeshOctree import closest_point_on_mesh_octree
from PROGRAMS.buildTree.buildKDTree import build_kd_tree
from PROGRAMS.buildTree.buildOctree import build_octree

def generate_output(output_dir, filename, search_type, frames, Atip, vertices, triangles):
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Define the full path for the output file
    output_path = os.path.join(output_dir, filename)

    # Variables to accumulate total times for averaging
    total_build_time = 0
    total_search_time = 0
    search_count = len(frames)  # Number of searches equal to the number of frames
    
    # Open the output file for writing
    with open(output_path, 'w') as file:
        # Write the first line with the number of frames and filename
        Nsamps = len(frames)
        file.write(f"{Nsamps} \"{filename}\"\n")
        
        # Build the search structure once, outside the loop for KDTree and Octree
        if search_type == "KDTree":
            start_time = time.time()
            kd_tree, triangle_data = build_kd_tree(vertices, triangles)
            total_build_time = time.time() - start_time
        elif search_type == "Octree":
            start_time = time.time()
            root = build_octree(vertices, triangles)
            total_build_time = time.time() - start_time

        # Loop through each frame and calculate d, c, and the magnitude of the difference
        for frame in frames:
            A = frame[0]
            B = frame[1]

            # Calculate d as the transformed tip position
            d = np.linalg.inv(B) @ A @ np.append(Atip, 1)
            d_coords = d[:3]  # Extract x, y, z coordinates

            # Find the closest point c on the mesh
            if search_type == "Linear":
                start_time = time.time()
                c_coords = closest_point_on_mesh(d_coords, vertices, triangles)
                total_search_time += time.time() - start_time
            elif search_type == "KDTree":
                start_time = time.time()
                c_coords = closest_point_on_mesh_kd(d_coords, kd_tree, triangle_data)
                total_search_time += time.time() - start_time
            elif search_type == "Octree":
                start_time = time.time()
                c_coords = closest_point_on_mesh_octree(d_coords, root, vertices)
                total_search_time += time.time() - start_time
            else:
                raise ValueError(f"Invalid search type: {search_type}")
            
            # Calculate the magnitude of the difference |d_k - c_k|
            difference_magnitude = np.linalg.norm(d_coords - c_coords)

            # Write the data in the specified format
            file.write(f"{d_coords[0]:8.2f} {d_coords[1]:8.2f} {d_coords[2]:8.2f}    "
                       f"{c_coords[0]:8.2f} {c_coords[1]:8.2f} {c_coords[2]:8.2f}    "
                       f"{difference_magnitude:8.3f}\n")

    # Calculate average times
    avg_build_time = total_build_time if search_type in ["KDTree", "Octree"] else 0  # No build time for Linear
    avg_search_time = total_search_time / search_count

    # Print average build and search times
    if search_type != "Linear":
        print(f"Average build time for {search_type}: {avg_build_time:.6f} seconds")
    print(f"Average search time for {search_type}: {avg_search_time:.6f} seconds")

# Example usage:
# generate_output("OUTPUT", "PA3-A-OurOutput.txt", "KDTree", frames, Atip, vertices, triangles)
