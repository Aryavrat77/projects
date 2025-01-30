1) readData.py - Reads and parses data from the given files (calbody, calreadings, empivot, optpivot).
2) pointSetRegistration.py - Computes the registration R, p using source and target points.
3) computeExpectedValues.py - Computes the expected values for C_i.
4) testPointSetRegistration.py - Tests the point_set_registration function using simple corresponding points.
5) pivotCalibration.py - Computes the solution to Ax = b for pivot calibration using the least squares method by taking a list of stacked R[k] and p[k] matrices for all frames k.
6) pivotEMCalibration.py - Performs pivot calibration for the EM probe.
7) testEMPivotCalibration.py - Tests the em_pivot_calibration function using made-up data.
8) pivotOptCalibration.py - Performs pivot calibration for the optical tracking probe.
9) testPivotCalibration.py - Tests a former naive implementation of the pivot_calibration function using made-up data.
10) generateOutput.py (executable program) - Generates the output files in the specified format in the ./OUTPUT/ directory for known (debugging) and unknown files.
11) compareOutputs.py - Calculates mean error between the results in the given outputs and our generated outputs. 

To run the executable program, use the following command from the root of the project:

python generateOutput.py  # for python
python3 generateOutput.py  # for python3

By default, this command generates the necessary output files for the asignment. However, if the code needs to be tested with other files (other than the ones provided) then uncomment the main function on line 61 of generateOutput.py and run the following command: 

python generateOutput.py file_prefix  # for python
python3 generateOutput.py file_prefix  # for python3


An example for file_prefix is "pa1-debug-a-"

Setup:
Create a virtual environment (.venv) for python in the root and run the command:
pip install numpy 

Now, the executable should work by navigating to /PROGRAMS and running the code provided above. 