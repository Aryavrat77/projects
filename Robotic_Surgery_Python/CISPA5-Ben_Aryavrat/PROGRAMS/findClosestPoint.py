# Author(s): Aryavrat Gupta

import numpy as np

def closest_point_on_triangle(a, p, q, r):

    # Convert tuples to numpy arrays for vector calculations
    a = np.array(a)
    p = np.array(p)
    q = np.array(q)
    r = np.array(r)

    # Vectors from point a to vertices p, q, r
    ab = q - p
    ac = r - p
    ap = a - p

    # Compute dot products
    d1 = np.dot(ab, ap)
    d2 = np.dot(ac, ap)
    d3 = np.dot(ab, ab)
    d4 = np.dot(ac, ac)
    d5 = np.dot(ab, ac)

    # Compute denominator for the barycentric coordinates
    denom = d3 * d4 - d5 * d5
    v = (d4 * d1 - d5 * d2) / denom
    w = (d3 * d2 - d5 * d1) / denom
    u = 1 - v - w

    # Check if point is inside the triangle (u, v, w >= 0)
    if u >= 0 and v >= 0 and w >= 0:
        # Point is inside the triangle
        return u * p + v * q + w * r

    # Closest point on triangle edges
    def closest_point_on_segment(seg_start, seg_end, point):
        # Project point onto the segment
        seg_vec = seg_end - seg_start
        t = np.dot(point - seg_start, seg_vec) / np.dot(seg_vec, seg_vec)
        t = np.clip(t, 0, 1)
        return seg_start + t * seg_vec

    # Check the closest point on each triangle edge
    closest_pq = closest_point_on_segment(p, q, a)
    closest_pr = closest_point_on_segment(p, r, a)
    closest_qr = closest_point_on_segment(q, r, a)

    # Compare distances
    dist_pq = np.linalg.norm(a - closest_pq)
    dist_pr = np.linalg.norm(a - closest_pr)
    dist_qr = np.linalg.norm(a - closest_qr)

    # Return the closest point among the edge projections
    if dist_pq < dist_pr and dist_pq < dist_qr:
        return closest_pq
    elif dist_pr < dist_qr:
        return closest_pr
    else:
        return closest_qr


# p = (.5, 0.8, 0.5)  # Example point
# triangle = ((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), (0.0, 1.0, 0.0))  # Example triangle vertices

# closest_point = closest_point_on_triangle(p, *triangle)
# if closest_point is not None:
#     print("Closest point on triangle:", closest_point)
# else:
#     print("Point is outside the bounding box of the triangle.")
