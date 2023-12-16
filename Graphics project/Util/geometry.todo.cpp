/*
Copyright (c) 2019, Michael Kazhdan
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of
conditions and the following disclaimer. Redistributions in binary form must reproduce
the above copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the distribution. 

Neither the name of the Johns Hopkins University nor the names of its contributors
may be used to endorse or promote products derived from this software without specific
prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES 
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
DAMAGE.
*/
#include <cmath>
#include <SVD/SVDFit.h>
#include <SVD/MatrixMNTC.h>
#include <Util/exceptions.h>
#include "geometry.h"

namespace Util
{
	////////////////////////////
	// EulerRotationParameter //
	////////////////////////////
	Matrix3D EulerRotationParameter::operator() ( void ) const
	{
		///////////////////////////////////////////////
		// Transform Euler angles to a rotation here //
		///////////////////////////////////////////////
		WARN_ONCE( "method undefined" );
		
		this->parameter; // set of angles in the euler rotation
		double theta = parameter[0];
		double phi = parameter[1];
		double psi = parameter[2];

        double cosX = std::cos(theta);
        double sinX = std::sin(theta);
        double cosY = std::cos(phi);
        double sinY = std::sin(phi);
        double cosZ = std::cos(psi);
        double sinZ = std::sin(psi);

        // Create matrices for individual rotations
        Matrix3D rotationX;
        Matrix3D rotationY;
        Matrix3D rotationZ;

        // Rotation about the x-axis
        rotationX(0, 0) = 1.0;
        rotationX(1, 1) = cosX;
        rotationX(1, 2) = -sinX;
        rotationX(2, 1) = sinX;
        rotationX(2, 2) = cosX;

        // Rotation about the y-axis
        rotationY(0, 0) = cosY;
        rotationY(0, 2) = sinY;
        rotationY(1, 1) = 1.0;
        rotationY(2, 0) = -sinY;
        rotationY(2, 2) = cosY;

        // Rotation about the z-axis
        rotationZ(0, 0) = cosZ;
        rotationZ(0, 1) = -sinZ;
        rotationZ(1, 0) = sinZ;
        rotationZ(1, 1) = cosZ;
        rotationZ(2, 2) = 1.0;

		return rotationZ * rotationY * rotationX;

	}

	/////////////////////////////////
	// QuaternionRotationParameter //
	/////////////////////////////////
	Matrix3D QuaternionRotationParameter::operator()( void ) const
	{
		///////////////////////////////////////////////
		// Transform a quaternion to a rotation here //
		///////////////////////////////////////////////
		 
		Matrix3D rotationMatrix = Matrix3D();
		double norm = sqrt(pow(parameter.real, 2) + pow(parameter.imag.length(), 2));

		// Make sure it's a unit quaternion 
		double a = parameter.real;
		a /= norm;
		double b = parameter.imag[0];
		b /= norm;
		double c = parameter.imag[1];
		c /= norm;
		double d = parameter.imag[2];
		d /= norm;

		// Calculate the elements of the rotation matrix
		double a2 = a * a;
		double b2 = b * b;
		double c2 = c * c;
		double d2 = d * d;
		
		rotationMatrix(0, 0) = a2 + b2 - c2 - d2;
		rotationMatrix(0, 1) = 2 * b * c - 2 * a * d;
		rotationMatrix(0, 2) = 2 * b * d + 2 * a * c;

		rotationMatrix(1, 0) = 2 * b * c + 2 * a * d;
		rotationMatrix(1, 1) = a2 - b2 + c2 - d2;
		rotationMatrix(1, 2) = 2 * c * d - 2 * a * b;

		rotationMatrix(2, 0) = 2 * b * d - 2 * a * c;
		rotationMatrix(2, 1) = 2 * c * d + 2 * a * b;
		rotationMatrix(2, 2) = a2 - b2 - c2 + d2;

    	return rotationMatrix;


		WARN_ONCE( "method undefined" );
		return Matrix3D();
	}
}
