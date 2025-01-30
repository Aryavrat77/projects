# Author(s): Aryavrat Gupta

import numpy as np
from PROGRAMS.findPointOnMesh import closest_point_on_mesh
from pointSetRegistration import point_set_registration

def iterative_registration(d_points, vertices, triangles, max_iterations=100, tol=1e-5):
    # Initialize F_reg as identity
    F_reg = np.eye(4)
    
    for iteration in range(max_iterations):
        # Apply the current F_reg to d_points
        # d_points is shape (N,3), convert to homogeneous coordinates and apply transform
        ones = np.ones((d_points.shape[0], 1))
        d_homo = np.hstack((d_points, ones))  # (N,4)
        s_homo = (F_reg @ d_homo.T).T         # (N,4)
        s_points = s_homo[:, :3]              # Extract back (N,3)
        
        # Find correspondences: for each s_point, find closest point c on mesh
        c_points = closest_point_on_mesh(s_points, vertices, triangles)
        
        # Register d_points to c_points using your point_set_registration
        R, p = point_set_registration(d_points, c_points)
        
        # Build a 4x4 matrix for the new F_reg_candidate
        F_reg_candidate = np.eye(4)
        F_reg_candidate[:3,:3] = R
        F_reg_candidate[:3, 3] = p
        
        # Check convergence
        diff = np.linalg.norm(F_reg_candidate - F_reg, ord='fro')
        
        # Update F_reg
        F_reg = F_reg_candidate
        
        # If change is small enough, break
        if diff < tol:
            break
    
    return F_reg
