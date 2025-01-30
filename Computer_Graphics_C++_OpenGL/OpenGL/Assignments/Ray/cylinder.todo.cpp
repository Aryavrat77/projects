#include <cmath>
#include <Util/exceptions.h>
#include "scene.h"
#include "cylinder.h"

using namespace Ray;
using namespace Util;

//////////////
// Cylinder //
//////////////

void Cylinder::init( const LocalSceneData &data )
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

void Cylinder::updateBoundingBox( void )
{
	///////////////////////////////
	// Set the _bBox object here //
	///////////////////////////////
	Point3D p( radius , height/2 , radius );
	_bBox = BoundingBox3D( center-p , center+p );
}

void Cylinder::initOpenGL( void )
{
	/////////////////////////////////////////
	// Do any necessary OpenGL set-up here //
	/////////////////////////////////////////
	WARN_ONCE( "method undefined" );

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}

bool Cylinder::processFirstIntersection( const Ray3D &ray , const BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	/////////////////////////////////////////////////////////////
	// Compute the intersection of the shape with the ray here //
	/////////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return false;
}

int Cylinder::processAllIntersections( const Ray3D &ray , const BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	/////////////////////////////////////////////////////////////
	// Compute the intersection of the shape with the ray here //
	/////////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return 0;
}
bool Cylinder::isInside( Point3D p ) const
{
	////////////////////////////////////////////////////////
	// Determine if the point is inside the cylinder here //
	////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return false;
}

void Cylinder::drawOpenGL( GLSLProgram *glslProgram ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////
	
	 const int tessellation = OpenGLTessellationComplexity;

    glBegin(GL_TRIANGLES);

    // Side faces
    for (int i = 0; i < tessellation; ++i)
    {
        float theta1 = i * 2.0 * M_PI / tessellation;
        float theta2 = (i + 1) * 2.0 * M_PI / tessellation;

        Util::Point3D v1(center[0] + radius * cos(theta1), center[1] - height / 2.0, center[2] + radius * sin(theta1));
        Util::Point3D v2(center[0] + radius * cos(theta2), center[1] - height / 2.0, center[2] + radius * sin(theta2));
        Util::Point3D v3(center[0] + radius * cos(theta1), center[1] + height / 2.0, center[2] + radius * sin(theta1));
        Util::Point3D v4(center[0] + radius * cos(theta2), center[1] + height / 2.0, center[2] + radius * sin(theta2));

        // Calculate normals
        Util::Point3D normal1 = Util::Point3D(cos(theta1), 0, sin(theta1));
        Util::Point3D normal2 = Util::Point3D(cos(theta2), 0, sin(theta2));

        // Set the normals and vertices for the side faces
        glNormal3f(normal1[0], normal1[1], normal1[2]);
        glVertex3f(v1[0], v1[1], v1[2]);
        glNormal3f(normal2[0], normal2[1], normal2[2]);
        glVertex3f(v2[0], v2[1], v2[2]);
        glNormal3f(normal1[0], normal1[1], normal1[2]);
        glVertex3f(v3[0], v3[1], v3[2]);

        glNormal3f(normal1[0], normal1[1], normal1[2]);
        glVertex3f(v3[0], v3[1], v3[2]);
        glNormal3f(normal2[0], normal2[1], normal2[2]);
        glVertex3f(v2[0], v2[1], v2[2]);
        glNormal3f(normal2[0], normal2[1], normal2[2]);
        glVertex3f(v4[0], v4[1], v4[2]);
    }

    glEnd();

    // Top face
    glBegin(GL_TRIANGLE_FAN);

    // Central point of the top face
    Util::Point3D topCenter(center[0], center[1] + height / 2.0, center[2]);

    // Set the normal for the top face
    glNormal3f(0.0f, 1.0f, 0.0f);

    // Vertex at the center of the top face
    glVertex3f(topCenter[0], topCenter[1], topCenter[2]);

    // Vertices for the top face
    for (int i = 0; i <= tessellation; ++i)
    {
        float theta = i * 2.0 * M_PI / tessellation;
        Util::Point3D vertex(topCenter[0] + radius * cos(theta), topCenter[1], topCenter[2] + radius * sin(theta));
        glVertex3f(vertex[0], vertex[1], vertex[2]);
    }

    glEnd();

    // Bottom face
    glBegin(GL_TRIANGLE_FAN);

    // Central point of the bottom face
    Util::Point3D bottomCenter(center[0], center[1] - height / 2.0, center[2]);

    // Set the normal for the bottom face
    glNormal3f(0.0f, -1.0f, 0.0f);

    // Vertex at the center of the bottom face
    glVertex3f(bottomCenter[0], bottomCenter[1], bottomCenter[2]);

    // Vertices for the bottom face
    for (int i = 0; i <= tessellation; ++i)
    {
        float theta = i * 2.0 * M_PI / tessellation;
        Util::Point3D vertex(bottomCenter[0] + radius * cos(theta), bottomCenter[1], bottomCenter[2] + radius * sin(theta));
        glVertex3f(vertex[0], vertex[1], vertex[2]);
    }

    glEnd();

    // Sanity check to make sure that OpenGL state is good
    ASSERT_OPEN_GL_STATE();
}
