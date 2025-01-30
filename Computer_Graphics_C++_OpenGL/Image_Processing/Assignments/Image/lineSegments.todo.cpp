#include "lineSegments.h"
#include <math.h>
#include <Util/exceptions.h>

using namespace Util;
using namespace Image;

////////////////////////////
// Image processing stuff //
////////////////////////////
double OrientedLineSegment::length( void ) const
{
	////////////////////////////
	// Return the length here //
	////////////////////////////
	double dx = endPoints[1][0] - endPoints[0][0];
    double dy = endPoints[1][1] - endPoints[0][1];

    return sqrt(dx * dx + dy * dy);
}

double OrientedLineSegment::distance( Point2D p ) const
{
	//////////////////////////////
	// Return the distance here //
	//////////////////////////////

	// Vector from the first endpoint of the line segment to the point p
    Util::Point2D v1 = p - endPoints[0];

    // Vector representing the direction of the line segment
    Util::Point2D v2 = endPoints[1] - endPoints[0];

    double segmentLength = length();

    // Calculate the projection of v1 onto v2
    double t = v1.dot(v2) / (segmentLength * segmentLength);

    if (t <= 0.0) {
        return v1.length(); // Distance to the first endpoint
    }

    if (t >= 1.0) {
        Util::Point2D v3 = p - endPoints[1];
        return v3.length(); // Distance to the second endpoint
    }

    // The closest point is along the line segment
    Util::Point2D closestPoint = endPoints[0] + v2 * t;
    return (p - closestPoint).length(); // Distance to the closest point on the line segment
}

Point2D OrientedLineSegment::perpendicular( void ) const
{
	////////////////////////////////
	// Set the perpendicular here //
	////////////////////////////////

	// Calculate the direction vector of the line segment (from endpoint 0 to endpoint 1)
    Util::Point2D directionVector = endPoints[1] - endPoints[0];

    // Calculate the perpendicular vector (rotated 90 degrees counterclockwise)
    Util::Point2D perpendicularVector(-directionVector[1], directionVector[0]);


    return perpendicularVector;
}

Point2D OrientedLineSegment::GetSourcePosition( const OrientedLineSegment& source , const OrientedLineSegment& destination , Point2D target )
{
	//////////////////////////////////
	// Set the source position here //
	//////////////////////////////////

	 // Calculate the length of the destination line segment
    double destLength = destination.length();

    // Calculate the distance from the target to the destination line segment
    double destDist = destination.distance(target);

    // Calculate the weight using the provided formula with constants a, b, and c
    double a = 0.1;  // Small constant 'a'
    double b = 1.0;  // 'b' in the range [0.5, 2.0]
    double c = 0.5;  // 'c' in the range [0.0, 1.0]
    
    double weight = pow((pow(destLength, B) / (A + destDist)), P);

    // Interpolate between the source and destination positions based on the calculated weight
    Util::Point2D sourcePos = (1 - weight) * source.endPoints[0] + weight * destination.endPoints[0];

    return sourcePos;
}