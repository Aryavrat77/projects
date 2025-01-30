#include <cmath>
#include <Util/exceptions.h>
#include <Util/polynomial.h>
#include "scene.h"
#include "cone.h"

using namespace Ray;
using namespace Util;

//////////
// Cone //
//////////

void Cone::init( const LocalSceneData &data )
{
	// Set the material pointer
	if( _materialIndex<0 ) THROW( "negative material index: " , _materialIndex );
	else if( _materialIndex>=data.materials.size() ) THROW( "material index out of bounds: " , _materialIndex , " <= " , data.materials.size() );
	else _material = &data.materials[ _materialIndex ];
	_primitiveNum = 1;

	//////////////////////////////////
	// Do any necessary set-up here //
	//////////////////////////////////
	WARN_ONCE( "method undefined" );
}

void Cone::updateBoundingBox( void )
{
	///////////////////////////////
	// Set the _bBox object here //
	///////////////////////////////
	Point3D p( radius , height/2 , radius );
	_bBox = BoundingBox3D( center-p , center+p );
}

void Cone::initOpenGL( void )
{
	/////////////////////////////////////////
	// Do any necessary OpenGL set-up here //
	/////////////////////////////////////////
	WARN_ONCE( "method undefined" );

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}

bool Cone::processFirstIntersection( const Ray3D &ray , const BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	/////////////////////////////////////////////////////////////
	// Compute the intersection of the shape with the ray here //
	/////////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return false;
}

int Cone::processAllIntersections( const Ray3D &ray , const BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	/////////////////////////////////////////////////////////////
	// Compute the intersection of the shape with the ray here //
	/////////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return 0;
}
bool Cone::isInside( Point3D p ) const
{
	///////////////////////////////////////////////////
	// Determine if the point is inside the box here //
	///////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return false;
}

void Cone::drawOpenGL( GLSLProgram * glslProgram ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////
	
	const int tessellation = OpenGLTessellationComplexity;

    // Draw the cone's body
    glBegin(GL_TRIANGLES);

    for (int i = 0; i < tessellation; ++i)
    {
        float theta1 = i * 2.0 * M_PI / tessellation;
        float theta2 = (i + 1) * 2.0 * M_PI / tessellation;

        Util::Point3D v1(center[0] + radius * cos(theta1), center[1], center[2] + radius * sin(theta1));
        Util::Point3D v2(center[0] + radius * cos(theta2), center[1], center[2] + radius * sin(theta2));
        Util::Point3D v3(center[0], center[1] + height, center[2]);

        // Calculate normals
        Util::Point3D normal1 = Point<3>::CrossProduct(v1 - center, v2 - center);
        Util::Point3D normal2 = Point<3>::CrossProduct(v2 - center, v3 - center);
        Util::Point3D normal3 = Point<3>::CrossProduct(v3 - center, v1 - center);

		normal1 = normal1 / sqrt(normal1.dot(normal1));
		normal2 = normal2 / sqrt(normal2.dot(normal2));
		normal3 = normal3 / sqrt(normal3.dot(normal3));

        // Set the normals and vertices
        glNormal3f(normal1[0], normal1[1], normal1[2]);
        glVertex3f(v1[0], v1[1], v1[2]);
        glNormal3f(normal2[0], normal2[1], normal2[2]);
        glVertex3f(v2[0], v2[1], v2[2]);
        glNormal3f(normal3[0], normal3[1], normal3[2]);
        glVertex3f(v3[0], v3[1], v3[2]);
    }

    glEnd();

    // Draw the cone's base
    glBegin(GL_TRIANGLE_FAN);

    // Apex of the cone
    Util::Point3D apex(center[0], center[1] + height, center[2]);
    glNormal3f(0.0, 1.0, 0.0);
    glVertex3f(apex[0], apex[1], apex[2]);

    for (int i = 0; i <= tessellation; ++i)
    {
        float theta = i * 2.0 * M_PI / tessellation;
        Util::Point3D point(center[0] + radius * cos(theta), center[1], center[2] + radius * sin(theta));
        glNormal3f(0.0, 1.0, 0.0);
        glVertex3f(point[0], point[1], point[2]);
    }

    glEnd();

    // Sanity check to make sure that OpenGL state is good
    ASSERT_OPEN_GL_STATE();
}
