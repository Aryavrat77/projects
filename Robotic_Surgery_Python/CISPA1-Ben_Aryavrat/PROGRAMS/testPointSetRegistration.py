# Author(s): Aryavrat Gupta and Benjamin Miller

from pointSetRegistration import point_set_registration

# translation
#point_set_registration((0,0,0), (0,0,1), (0,1,0), (1,0,0))

# rotation by 45 across each axis
point_set_registration([(1, 2, 3), (4, 5, 6), (7, 8, 9), (2, 4, 6)], [(2.19, 0.93, 3.14), (5.89, 3.89, 6.18), (9.58, 6.85, 9.22), (3.18, 1.87, 6.26)])

# rotation by 180 degrees
# point_set_registration([(1, 1, 1), (2, 2, 2), (3, 3, 3)], [(-1, -1, -1), (-2, -2, -2), (-3, -3, -3)])