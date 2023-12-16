#include <cmath>
#include  <Util/exceptions.h>
#include "scene.h"
#include "box.h"

using namespace Ray;
using namespace Util;

/////////
// Box //
/////////

void Box::init( const LocalSceneData& data )
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

void Box::updateBoundingBox( void )
{
	///////////////////////////////
	// Set the _bBox object here //
	///////////////////////////////
	_bBox = BoundingBox3D( center-(length/2) , center+(length/2) );
}

void Box::initOpenGL( void )
{
	/////////////////////////////////////////
	// Do any necessary OpenGL set-up here //
	/////////////////////////////////////////
	WARN_ONCE( "method undefined" );

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}

bool Box::processFirstIntersection( const Util::Ray3D &ray , const Util::BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	/////////////////////////////////////////////////////////////
	// Compute the intersection of the shape with the ray here //
	/////////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return false;
}

int Box::processAllIntersections( const Util::Ray3D &ray , const Util::BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	/////////////////////////////////////////////////////////////
	// Compute the intersection of the shape with the ray here //
	/////////////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return 0;
}
bool Box::isInside( Point3D p ) const
{
	///////////////////////////////////////////////////
	// Determine if the point is inside the box here //
	///////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return false;
}

void Box::drawOpenGL( GLSLProgram * glslProgram ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////

	// Calculate half-lengths for convenience
    float halfLengthX = length[0] / 2.0f;
    float halfLengthY = length[1] / 2.0f;
    float halfLengthZ = length[2] / 2.0f;

    // Vertices of the box
    GLfloat vertices[] = {
    (GLfloat)(center[0] - halfLengthX), (GLfloat)(center[1] - halfLengthY), (GLfloat)(center[2] - halfLengthZ), // 0
    (GLfloat)(center[0] + halfLengthX), (GLfloat)(center[1] - halfLengthY), (GLfloat)(center[2] - halfLengthZ), // 1
    (GLfloat)(center[0] + halfLengthX), (GLfloat)(center[1] + halfLengthY), (GLfloat)(center[2] - halfLengthZ), // 2
    (GLfloat)(center[0] - halfLengthX), (GLfloat)(center[1] + halfLengthY), (GLfloat)(center[2] - halfLengthZ), // 3
    (GLfloat)(center[0] - halfLengthX), (GLfloat)(center[1] - halfLengthY), (GLfloat)(center[2] + halfLengthZ), // 4
    (GLfloat)(center[0] + halfLengthX), (GLfloat)(center[1] - halfLengthY), (GLfloat)(center[2] + halfLengthZ), // 5
    (GLfloat)(center[0] + halfLengthX), (GLfloat)(center[1] + halfLengthY), (GLfloat)(center[2] + halfLengthZ), // 6
    (GLfloat)(center[0] - halfLengthX), (GLfloat)(center[1] + halfLengthY), (GLfloat)(center[2] + halfLengthZ)  // 7
    };

	// Normals of the box
    GLfloat normals[] = {
        0.0f, 0.0f, -1.0f, // Front face normal
        0.0f, 0.0f, 1.0f,  // Back face normal
        -1.0f, 0.0f, 0.0f, // Left face normal
        1.0f, 0.0f, 0.0f,  // Right face normal
        0.0f, -1.0f, 0.0f, // Bottom face normal
        0.0f, 1.0f, 0.0f   // Top face normal
    };

    // Indices for drawing the box using triangles
    GLuint indices[] = {
        0, 1, 2, // Front face (first triangle)
        0, 2, 3, // Front face (second triangle)
        4, 5, 6, // Back face (first triangle)
        4, 6, 7, // Back face (second triangle)
        0, 1, 5, // Left face (first triangle)
        0, 5, 4, // Left face (second triangle)
        2, 3, 7, // Right face (first triangle)
        2, 7, 6, // Right face (second triangle)
        0, 3, 7, // Bottom face (first triangle)
        0, 7, 4, // Bottom face (second triangle)
        1, 2, 6, // Top face (first triangle)
        1, 6, 5  // Top face (second triangle)
    };

    glBegin(GL_TRIANGLES);

    for (int i = 0; i < sizeof(indices) / sizeof(indices[0]); ++i) {
		glNormal3f(normals[3 * (i / 3)], normals[3 * (i / 3) + 1], normals[3 * (i / 3) + 2]);
        glVertex3f(vertices[3 * indices[i]], vertices[3 * indices[i] + 1], vertices[3 * indices[i] + 2]);
    }

    glEnd();

    // Sanity check to make sure that OpenGL state is good
    ASSERT_OPEN_GL_STATE();
}
