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

#include <math.h>
#include <Util/exceptions.h>

namespace Util
{
	///////////////////
	// Interpolation //
	///////////////////
	template< typename SampleType >
	SampleType Interpolation::Sample( const std::vector< SampleType > &samples , double t , int interpolationType )
	{
		switch( interpolationType )
		{
		case NEAREST:
		{
			t *= samples.size();
			int it1 = (int)floor(t);
			int it2 = ( it1 + 1 ) % samples.size();
			t -= it1;
			if( t<0.5 ) return samples[it1];
			else        return samples[it2];
			break;
		}
		case LINEAR:
			///////////////////////////////////////
			// Perform linear interpolation here //
			///////////////////////////////////////
		{
			t *= samples.size();
			int index1 = (int)floor(t);
			int index2 = (index1 + 1) % samples.size();
			t -= index1;

			// Perform linear interpolation
			SampleType value1 = samples[index1];
			SampleType value2 = samples[index2];
			SampleType result = value1 * (1 - t) + value2 * t;
    
    		return result;
			break;
		}
		case CATMULL_ROM:
			////////////////////////////////////////////
			// Perform Catmull-Rom interpolation here //
			////////////////////////////////////////////
		{
			t *= samples.size();
            int index = (int) (floor(t));
            t -= index;

            // Catmull-Rom interpolation
            SampleType catmull_p0 = samples[(index - 1 + samples.size()) % samples.size()];
            SampleType catmull_p1 = samples[index];
            SampleType catmull_p2 = samples[(index + 1) % samples.size()];
            SampleType catmull_p3 = samples[(index + 2) % samples.size()];

            SampleType catmull_result = 0.5 * (
                (-catmull_p0 + 3.0 * catmull_p1 - 3.0 * catmull_p2 + catmull_p3) * (t * t * t)
                + (2.0 * catmull_p0 - 5.0 * catmull_p1 + 4.0 * catmull_p2 - catmull_p3) * (t * t)
                + (-catmull_p0 + catmull_p2) * t
                + 2.0 * catmull_p1
            );

            return catmull_result;

			break;
		}
		case UNIFORM_CUBIC_B_SPLINE:
			///////////////////////////////////////////////////////
			// Perform uniform cubic b-spline interpolation here //
			///////////////////////////////////////////////////////
		{
			t *= samples.size() - 1;
			int spline_index = static_cast<int>(floor(t));
			t -= spline_index;

			// Uniform cubic B-spline interpolation
			SampleType spline_p0 = samples[spline_index];
			SampleType spline_p1 = samples[(spline_index + 1) % samples.size()];
			SampleType spline_p2 = samples[(spline_index + 2) % samples.size()];
			SampleType spline_p3 = samples[(spline_index + 3) % samples.size()];

			SampleType spline_result = (1.0 / 6.0) * (
				-spline_p0 + 3.0 * spline_p1 - 3.0 * spline_p2 + spline_p3
				+ t * (2.0 * spline_p0 - 5.0 * spline_p1 + 4.0 * spline_p2 - spline_p3)
				+ t * t * (-spline_p0 + spline_p2)
				+ t * t * t * (spline_p0 + 4.0 * spline_p1 + spline_p2)
			);

			return spline_result;

			break;
		}
		default:
			ERROR_OUT( "unrecognized interpolation type" );
			return samples[0];
		}
	}
}