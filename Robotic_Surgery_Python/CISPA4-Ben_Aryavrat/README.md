# CISPA4
Note: All code must be ran from the project root i.e. cd into CISPA4-Ben_Aryavrat
Use "python" or "python3" depending on operating system. 
All instructions are given for MacOS and use "python3"

Set up virtual environment:
i) From the root of the project run "python -m venv .venv"
ii) Kill the current terminal session and open a new terminal (this will activate the virtual environment) OR run "source .venv/bin/activate"

Install dependencies (run the following):
pip install numpy
pip install scipy

OUTPUT files:
Output files have the following format:
PA{problem_number}-{letter}-OurOutput-{search_type}.txt

For example, problem_number = 3, letter = {A ... J / I}, search_type = {KDTree, Linear, Octree}

PROGRAMS files: 
Note: The __init__.py files in the subfolders and the root of PROGRAMS are for importing directories as modules using absolute paths. 

1) PROGRAMS/buildTree:
    - buildKDTree - builds KDTree using vertices and triangles, returns KDTree and triangle data
    - buildOctree - builds Octree data structure using OctreeNode, returns root of the tree

2) PROGRAMS/errorCalculation:
    - compareMean.py - computes mean value of magnitude for our output files
    Run: python3 PROGRAMS/errorCalculation/computeMean.py
    (Change search_type on line 36 in the file as needed)
    - compareOutput.py - computes MSE of distance for our output files and the given debug files 
    Run: python3 PROGRAMS/errorCalculation/compareOutput.py 

3) PROGRAMS/readFiles:
    - parseMesh.py - gets and stores triangle and vertex data as arrays from Mesh file
    - readData.py - reads body and sample data and returns necessary data

4) PROGRAMS/test:
    - testBuildTree.py - KDTree build test file
    Run: python3 PROGRAMS/test/testBuildTree.py
    - testClosestPoint.py - tests closest point on triangle
    Run: python3 PROGRAMS/test/testClosestPoint.py
    - testOptimization.py - tests if all search types work and compares time information
    Run: python3 PROGRAMS/test/testOptimization.py
    - testPointSetRegistration.py - improves upon tests for point set registration from PA1
    Run: python3 PROGRAMS/test/testPointSetRegistration.py

5) PROGRAMS/utils: 
    - geometry.py - contains Vertex and Triangle classes
    - calculateTransformation.py - Calculates frame transformations given body data
    - pointSetRegistration.py - finds the registration transformation between two point clouds
    - iterativeRegistration.py - dummy function that lays the foundation for the determining F_reg iteratively(NOT USED - only for us to figure out logic)

6) PROGRAMS/.:
    - findClosestPoint.py - outputs closest point on triangle given a point
    - findPointOnMesh.py - outputs closest point on mesh given a point (linear)
    - findPointOnMeshKDTree.py - outputs closest point via KD-Tree search
    - findPointOnMeshOctree.py - outputs closest point via Octree search
    - generateOutput.py - helper function to generate output file and search time data
    - generateOutputP4.py - helper function to generate output file and search time data for PA4 (computes F_reg iteratively)
    - main.py - generates the output files

To run the executable program, use the following command from the root of the project:

export PYTHONPATH=$(pwd)

python3 PROGRAMS/main.py

set PYTHONPATH=%cd% (for Windows)

Note: If Windows users are having difficulty, try setting the PYTHONPATH explicitly.
$env:PYTHONPATH = "C:\Users\xxxxx\CISPA3"

Note: The main file runs with different parameters: problem_number (3, 4 or 5), debug_file_letter (letter set above), isKnown (output known or not), search_types (Linear, KDTree, Octree). The current code loops over all possible parameters and generates all permutations of files. If individual files need to be generated, use the commented funtion call code from line 48 to 76 in main.py (change problem number as needed)
