#include <cmath>
#include <Util/exceptions.h>
#include "scene.h"
#include "torus.h"

using namespace Ray;
using namespace Util;

///////////
// Torus //
///////////

void Torus::init( const LocalSceneData &data )
{
	// Set the material pointer
	if( _materialIndex<0 ) THROW( "negative material index: " , _materialIndex );
	else if( _materialIndex>=data.materials.size() ) THROW( "material index out of bounds: " , _materialIndex , " <= " , data.materials.size() );
	else _material = &data.materials[ _materialIndex ];
	_primitiveNum = 1;

	///////////////////////////////////
	// Do any additional set-up here //
	///////////////////////////////////
	WARN_ONCE( "method undefined" );
}
void Torus::updateBoundingBox( void )
{
	///////////////////////////////
	// Set the _bBox object here //
	///////////////////////////////
	Point3D p( iRadius+oRadius , oRadius , iRadius+oRadius );
	_bBox = BoundingBox3D( center-p , center+p );
}
void Torus::initOpenGL( void )
{
	///////////////////////////
	// Do OpenGL set-up here //
	///////////////////////////
	WARN_ONCE( "method undefined" );

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}

bool Torus::processFirstIntersection( const Ray3D &ray , const BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	/////////////////////////////////////////////////////////////
	// Compute the intersection of the shape with the ray here //
	/////////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return false;
}

int Torus::processAllIntersections( const Ray3D &ray , const BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	/////////////////////////////////////////////////////////////
	// Compute the intersection of the shape with the ray here //
	/////////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return 0;
}

bool Torus::isInside( Point3D p ) const
{
	////////////////////////////////////////////////////////
	// Determine if the point is inside the cylinder here //
	////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return false;
}

void Torus::drawOpenGL( GLSLProgram * glslProgram ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////
	
	const int tessellation = OpenGLTessellationComplexity;

    glBegin(GL_TRIANGLES);

    for (int i = 0; i < tessellation; ++i)
    {
        for (int j = 0; j < tessellation; ++j)
        {
            float theta1 = i * 2.0 * M_PI / tessellation;
            float theta2 = (i + 1) * 2.0 * M_PI / tessellation;
            float phi1 = j * 2.0 * M_PI / tessellation;
            float phi2 = (j + 1) * 2.0 * M_PI / tessellation;

            Util::Point3D v1(center[0] + (oRadius + iRadius * cos(phi1)) * cos(theta1),
                            center[1] + iRadius * sin(phi1),
                            center[2] + (oRadius + iRadius * cos(phi1)) * sin(theta1));

            Util::Point3D v2(center[0] + (oRadius + iRadius * cos(phi2)) * cos(theta1),
                            center[1] + iRadius * sin(phi2),
                            center[2] + (oRadius + iRadius * cos(phi2)) * sin(theta1));

            Util::Point3D v3(center[0] + (oRadius + iRadius * cos(phi1)) * cos(theta2),
                            center[1] + iRadius * sin(phi1),
                            center[2] + (oRadius + iRadius * cos(phi1)) * sin(theta2));

            Util::Point3D v4(center[0] + (oRadius + iRadius * cos(phi2)) * cos(theta2),
                            center[1] + iRadius * sin(phi2),
                            center[2] + (oRadius + iRadius * cos(phi2)) * sin(theta2));

            // Calculate normals
            Util::Point3D normal1 = (v1 - center) / sqrt((v1 - center).dot(v1 - center));
            Util::Point3D normal2 = (v2 - center) / sqrt((v2 - center).dot(v2 - center));
            Util::Point3D normal3 = (v3 - center) / sqrt((v3 - center).dot(v3 - center));
            Util::Point3D normal4 = (v4 - center) / sqrt((v4 - center).dot(v4 - center));

            // Set the normals and vertices
            glNormal3f(normal1[0], normal1[1], normal1[2]);
            glVertex3f(v1[0], v1[1], v1[2]);
            glNormal3f(normal3[0], normal3[1], normal3[2]);
            glVertex3f(v3[0], v3[1], v3[2]);
            glNormal3f(normal2[0], normal2[1], normal2[2]);
            glVertex3f(v2[0], v2[1], v2[2]);

            glNormal3f(normal2[0], normal2[1], normal2[2]);
            glVertex3f(v2[0], v2[1], v2[2]);
            glNormal3f(normal3[0], normal3[1], normal3[2]);
            glVertex3f(v3[0], v3[1], v3[2]);
            glNormal3f(normal4[0], normal4[1], normal4[2]);
            glVertex3f(v4[0], v4[1], v4[2]);
        }
    }

    glEnd();

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}
