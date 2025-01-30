#include <cmath>
#include <random>
#include <Util/exceptions.h>
#include "scene.h"
#include "sphereLight.h"

using namespace Ray;
using namespace Util;

/////////////////
// SphereLight //
/////////////////
Point3D SphereLight::transparency( const RayShapeIntersectionInfo &iInfo , const Shape &shape , Point3D cLimit , unsigned int samples , unsigned int tIdx ) const
{
	//////////////////////////////////////////////////////////
	// Compute the transparency along the path to the light //
	//////////////////////////////////////////////////////////
	Point3D totalTransparency = Point3D(0.0, 0.0, 0.0); // Initialize the total transparency


	for (unsigned int i = 0; i < samples; i++) {
        // Generate a random direction on the surface of the sphere
        double theta = 2 * M_PI * (double)rand() / RAND_MAX;
        double phi = acos(1 - 2 * (double)rand() / RAND_MAX);
        Point3D direction(sin(phi) * cos(theta), sin(phi) * sin(theta), cos(phi));

        // Create a ray from the intersection point towards the random direction
        Ray3D shadow = Ray3D(iInfo.position, direction);

        // Define the range and filters
        const BoundingBox1D range = BoundingBox1D(Epsilon, Infinity);
        const AffineShape::RayIntersectionFilter dummyFilter = [](double) { return true; };

        // Define the intersection kernel to compute the transparency
        const AffineShape::RayIntersectionKernel dummyKernel = [&](const AffineShape::ShapeProcessingInfo &spInfo, const RayShapeIntersectionInfo &_iInfo) {
            totalTransparency += spInfo.material->transparent;
            return true;
        };

        // Process all intersections along the ray and accumulate transparency
        AffineShape::ShapeProcessingInfo spInfo = AffineShape::ShapeProcessingInfo();
        Shape *shapeType = (Shape *)&shape;
        int numIntersections = shapeType->processAllIntersections(shadow, range, dummyFilter, dummyKernel, spInfo, tIdx);
    }

    // Compute the average transparency over the different rays
    totalTransparency /= samples;
    return totalTransparency;
	
}