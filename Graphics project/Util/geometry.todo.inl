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

namespace Util
{
	////////////
	// Matrix //
	////////////
	template< unsigned int Dim >
	Matrix< Dim , Dim > Matrix< Dim , Dim >::Exp( const Matrix &m , int terms )
	{
		//////////////////////////////////////
		// Compute the matrix exponent here //
		//////////////////////////////////////

		// Initialize the result matrix as an identity matrix
        Matrix<Dim, Dim> result = Matrix<Dim, Dim>::Identity();

        // Initialize the term matrix as the identity matrix
        Matrix<Dim, Dim> term = Matrix<Dim, Dim>::Identity();
		
        // Compute the matrix exponent using the Taylor series
        for (int k = 1; k <= terms; ++k)
        {
            term = term * m;
            result = result + term / (double) k;
        }

        return result;
	}

	template< unsigned int Dim >
	Matrix< Dim , Dim > Matrix< Dim , Dim >::closestRotation( void ) const
	{
		///////////////////////////////////////
		// Compute the closest rotation here //
		///////////////////////////////////////
		WARN_ONCE( "method undefined" );
		
		Matrix<Dim, Dim> O1;
		Matrix<Dim, Dim> O2;
		Matrix<Dim, Dim> middle;
		this->SVD(O1, middle, O2);

		Matrix<Dim, Dim> id = Matrix<Dim, Dim>::Identity();
		id(Dim, Dim) = (O1 * O2).determinant();

		return O1 * id * O2;


	}

	/////////////////
	// BoundingBox //
	/////////////////
	template< unsigned int Dim >
	BoundingBox< 1 > BoundingBox< Dim >::intersect( const Ray< Dim > &ray ) const
	{
		///////////////////////////////////////////////////////////////
		// Compute the intersection of a BoundingBox with a Ray here //
		///////////////////////////////////////////////////////////////
		WARN_ONCE( "method undefined" );
		return BoundingBox<1>();
	}

	/////////////
	// Quadric //
	/////////////
	template< unsigned int Dim >
	Quadric< 1 > Quadric< Dim >::intersect( const Ray< Dim > &ray ) const
	{
		WARN_ONCE( "method undefined" );
		return Quadric<1>();
	}
}