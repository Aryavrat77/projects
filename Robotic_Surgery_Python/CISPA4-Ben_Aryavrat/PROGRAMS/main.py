# Author(s): Aryavrat Gupta

import os
from PROGRAMS.utils.calculateTransformation import calculate_frame_transformations
from PROGRAMS.readFiles.readData import read_body
from PROGRAMS.readFiles.parseMesh import parse_mesh_file
from PROGRAMS.generateOutput import generate_output  
from PROGRAMS.generateOutputPA4 import generate_output_PA4 

def main(problem_number, debug_file_letter, isKnown=True, search_type="Linear"):

    if (isKnown):
        file_type = "Debug"
    else:
        file_type = "Unknown"

    # Calculate transformations
    frames = calculate_frame_transformations(f"Problem{problem_number}-BodyA", f"Problem{problem_number}-BodyB", f"PA{problem_number}-{debug_file_letter}-{file_type}-SampleReadingsTest")

    # Get the tip coordinates from body data
    _, _, Atip = read_body(f"Problem{problem_number}-BodyA")

    # Parse mesh data
    vertices, triangles = parse_mesh_file(f'PROGRAMS/data/Problem{problem_number}MeshFile.sur')

    # Define the output directory and filename
    output_dir = "./OUTPUT"  # Relative path from PROGRAMS directory to OUTPUT in the root

    # Generate output file with the results
    
    output_filename = f"PA{problem_number}-{debug_file_letter}-OurOutput-{search_type}.txt"  # Update 'A' as needed for different test cases
    
    if (problem_number == 3):
        generate_output(output_dir, output_filename, search_type, frames, Atip, vertices, triangles)

    if (problem_number == 4):
        max_iterations = 3
        tol = 1e-5
        print(f"Generating output for PA4 with search type {search_type}")
        generate_output_PA4(output_dir, output_filename, search_type, frames, Atip, vertices, triangles, max_iterations, tol)

    print(f"Output written to {os.path.join(output_dir, output_filename)}")

if __name__ == "__main__":
   
    search_types = ["Linear", "KDTree", "Octree"]
    debug_file_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J']
    known_status = [True, True, True, True, True, True, False, False, False]

    for search_type in search_types:
        for debug_file_letter, is_known in zip(debug_file_letters, known_status):
            main(4, debug_file_letter, is_known, search_type) # change problem number as needed 

    # main(3, 'A', True, "Linear")
    # main(3, 'B', True, "Linear")
    # main(3, 'C', True, "Linear")
    # main(3, 'D', True, "Linear")
    # main(3, 'E', True, "Linear")
    # main(3, 'F', True, "Linear")
    # main(3, 'G', False, "Linear")
    # main(3, 'H', False, "Linear")
    # main(3, 'J', False, "Linear")

    # main(3, 'A', True, "KDTree")
    # main(3, 'B', True, "KDTree")
    # main(3, 'C', True, "KDTree")
    # main(3, 'D', True, "KDTree")
    # main(3, 'E', True, "KDTree")
    # main(3, 'F', True, "KDTree")
    # main(3, 'G', False, "KDTree")
    # main(3, 'H', False, "KDTree")
    # main(3, 'J', False, "KDTree")

    # main(3, 'A', True, "Octree")
    # main(3, 'B', True, "Octree")
    # main(3, 'C', True, "Octree")
    # main(3, 'D', True, "Octree")
    # main(3, 'E', True, "Octree")
    # main(3, 'F', True, "Octree")
    # main(3, 'G', False, "Octree")
    # main(3, 'H', False, "Octree")
    # main(3, 'J', False, "Octree")