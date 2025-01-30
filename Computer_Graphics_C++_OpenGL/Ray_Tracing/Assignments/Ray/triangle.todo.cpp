#include <cmath>
#include <Util/exceptions.h>
#include "triangle.h"

using namespace Ray;
using namespace Util;

//////////////
// Triangle //
//////////////

void Triangle::init( const LocalSceneData &data )
{
	_primitiveNum = 1;
	// Set the vertex pointers
	for( int i=0 ; i<3 ; i++ )
	{
		if( _vIndices[i]==-1 ) THROW( "negative vertex index:" , _vIndices[i] );
		else if( _vIndices[i]>=data.vertices.size() ) THROW( "vertex index out of bounds: " , _vIndices[i] , " <= " , data.vertices.size() );
		else _v[i] = &data.vertices[ _vIndices[i] ];
	}

	///////////////////////////////////
	// Do any additional set-up here //
	///////////////////////////////////
	WARN_ONCE( "method undefined" );
}

void Triangle::updateBoundingBox( void )
{
	Util::Point3D minPoint = Util::Point3D(
        std::min(_v[0]->position[0], std::min(_v[1]->position[0], _v[2]->position[0])),
        std::min(_v[0]->position[1], std::min(_v[1]->position[1], _v[2]->position[1])),
        std::min(_v[0]->position[2], std::min(_v[1]->position[2], _v[2]->position[2]))
    );

    Util::Point3D maxPoint = Util::Point3D(
        std::max(_v[0]->position[0], std::max(_v[1]->position[0], _v[2]->position[0])),
        std::max(_v[0]->position[1], std::max(_v[1]->position[1], _v[2]->position[1])),
        std::max(_v[0]->position[2], std::max(_v[1]->position[2], _v[2]->position[2]))
    );

    _bBox = Util::BoundingBox3D(minPoint, maxPoint);
}

void Triangle::initOpenGL( void )
{
	///////////////////////////
	// Do OpenGL set-up here //
	///////////////////////////
	WARN_ONCE( "method undefined" );

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}

bool Triangle::processFirstIntersection( const Util::Ray3D &ray , const Util::BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();

	/////////////////////////////////////////////////////////////
	// Compute the intersection of the shape with the ray here //
	/////////////////////////////////////////////////////////////
	Point3D v1 = _v[0]->position;
	Point3D v2 = _v[1]->position;
	Point3D v3 = _v[2]->position;

	// Create a plane that is spanned by the triangle
	Plane3D plane(v1, v2, v3); 
	double t = -1 * (ray.position.dot(plane.normal) - plane.distance) / (ray.direction.dot(plane.normal));

	Point3D p = ray.position + t * ray.direction;

	if (t < range[0][0] || t > range[1][0]) {
		return false;
	}

	// Check if point p is in the triangle

	double alpha = computeParameters(v1, v2, v3, p);
	double beta = computeParameters(v2, v1, v3, p);
	double gamma = computeParameters(v3, v1, v2, p);

	RayShapeIntersectionInfo rsiInfo; 

	if (alpha >= 0 && beta >= 0 && gamma >= 0 && (abs(alpha + beta + gamma - 1) < Epsilon)) { // p is in the triangle
		rsiInfo.t = t;
		Point3D position = ray.position + t * ray.direction;
		Point3D w1 = v1 - position;
		Point3D w2 = v2 - position;
		Point3D normal = Point<3>::CrossProduct(w1, w2);
		normal = normal / sqrt(normal.dot(normal));
		
		rsiInfo.position = position;
		rsiInfo.normal = normal;
		Point2D textureCoordinates = _v[0]->texCoordinate * alpha + _v[1]->texCoordinate * beta + _v[2]->texCoordinate * gamma;
		rsiInfo.texture = textureCoordinates;
		rKernel(spInfo, rsiInfo);
		return true;
	}

	return false;
}

void Triangle::drawOpenGL( GLSLProgram * glslProgram ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////
	WARN_ONCE( "method undefined" );

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}


double Triangle::computeParameters(Point3D v1, Point3D v2, Point3D v3, Point3D p) {

	// Point3D w1 = v2 - v1;
	// Point3D w2 = v3 - v1;

	// Point3D cross = Point<3>::CrossProduct(w1, w2);
	// Point3D normal = cross / sqrt(cross.dot(cross));

	// Point3D w3 = v2 - p;
	// Point3D w4 = v3 - p;

	// double param = ((Point<3>::CrossProduct(w3, w4)).dot(normal) / 2) / (cross.dot(normal) / 2);
	
	// return param;

	Point3D w1 = v2 - v1;
    Point3D w2 = v3 - v1;

    Point3D cross = Point<3>::CrossProduct(w1, w2);
    double triangleArea = sqrt(cross.dot(cross)) * 0.5;

    Point3D crossParam = Point<3>::CrossProduct(p - v2, p - v3);
    double areaParam = sqrt(crossParam.dot(crossParam)) * 0.5;

    return areaParam / triangleArea;
}