#include <cmath>
#include <Util/exceptions.h>
#include "scene.h"
#include "sphere.h"

using namespace Ray;
using namespace Util;

////////////
// Sphere //
////////////

void Sphere::init( const LocalSceneData &data )
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
void Sphere::updateBoundingBox( void )
{
	///////////////////////////////
	// Set the _bBox object here //
	///////////////////////////////
	Point3D p( radius , radius , radius );
	_bBox = BoundingBox3D( center-p , center+p );
}
void Sphere::initOpenGL( void )
{
	///////////////////////////
	// Do OpenGL set-up here //
	///////////////////////////
	
	// Shape::initOpenGL(); // Call the base class initialization

    // // Generate and bind the vertex buffer
    // glGenBuffers(1, &_vertexBufferID);
    // glBindBuffer(GL_ARRAY_BUFFER, _vertexBufferID);

    // // Generate and populate vertex data
    // std::vector<GLfloat> vertexData;
    // //generateVertices(vertexData); // populate vertexData

    // glBufferData(GL_ARRAY_BUFFER, vertexData.size() * sizeof(GLfloat), vertexData.data(), GL_STATIC_DRAW);
    // glBindBuffer(GL_ARRAY_BUFFER, 0);

    // // Generate and bind the element buffer
    // GLuint _elementBufferID; // Add this member variable to your Sphere class if necessary
    // glGenBuffers(1, &_elementBufferID);
    // glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _elementBufferID);

    // // Sanity check to make sure that OpenGL state is good
    // ASSERT_OPEN_GL_STATE();
}

bool Sphere::processFirstIntersection( const Ray3D &ray , const BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	//////////////////////////////////////////////////////////////
	// Compute the intersection of the sphere with the ray here //
	//////////////////////////////////////////////////////////////

	Util::Polynomial3D<2> poly2D;

	poly2D.coefficient(2u, 0u, 0u) = 1;
	poly2D.coefficient(0u, 2u, 0u) = 1;
	poly2D.coefficient(0u, 0u, 2u) = 1;
	poly2D.coefficient(1u, 0u, 0u) = -2 * center[0];
	poly2D.coefficient(0u, 1u, 0u) = -2 * center[1];
	poly2D.coefficient(0u, 0u, 1u) = -2 * center[2];
	poly2D.coefficient(0u, 0u, 0u) = center.dot(center) - radius * radius;


	Util::Polynomial1D<2> poly1D = poly2D(ray);

	double roots[2];
	int numRoots = poly1D.roots(roots);

	double root1 = roots[0];
	double root2 = roots[1];
	double t = (root1 < root2) ? root1 : root2;

	RayShapeIntersectionInfo rsiInfo; 
	

	if ((t >= range[0][0] && t <= range[1][0] && rFilter)) {
		rsiInfo.t = t;
		Point3D position = ray.position + t * ray.direction;
		Point3D normal = position - center;
		normal = normal / sqrt(normal.dot(normal));
		rsiInfo.position = position;
		rsiInfo.normal = normal;
		rKernel(spInfo, rsiInfo);
		return true;
	} 
	return false;
	
}

int Sphere::processAllIntersections( const Ray3D &ray , const BoundingBox1D &range , const RayIntersectionFilter &rFilter , const RayIntersectionKernel &rKernel , ShapeProcessingInfo spInfo , unsigned int tIdx ) const
{
	RayTracingStats::IncrementRayPrimitiveIntersectionNum();
	spInfo.material = _material;

	//////////////////////////////////////////////////////////////
	// Compute the intersection of the sphere with the ray here //
	//////////////////////////////////////////////////////////////

	Util::Polynomial3D<2> poly2D;

	poly2D.coefficient(2u, 0u, 0u) = 1;
	poly2D.coefficient(0u, 2u, 0u) = 1;
	poly2D.coefficient(0u, 0u, 2u) = 1;
	poly2D.coefficient(1u, 0u, 0u) = -2 * center[0];
	poly2D.coefficient(0u, 1u, 0u) = -2 * center[1];
	poly2D.coefficient(0u, 0u, 1u) = -2 * center[2];
	poly2D.coefficient(0u, 0u, 0u) = center.dot(center) - radius * radius;


	Util::Polynomial1D<2> poly1D = poly2D(ray);

	double roots[2];
	int numRoots = poly1D.roots(roots);

	double root1 = roots[0];
	double root2 = roots[1];
	double t = (root1 < root2) ? root1 : root2;

	if (root1 >= 0 && root2 >= 0 && root1 >= range[0][0] && root1 <= range[1][0] && root2 >= range[0][0] && root2 <= range[1][0] && rFilter) {
		
		return 2;
	} else if ((root1 >= 0 && root1 >= range[0][0] && root1 <= range[1][0] || root2 >= 0 && root2 >= range[0][0] && root2 <= range[1][0]) && rFilter) {
		return 1;
	} else {
		return 0;
	}
	
}

bool Sphere::isInside( Point3D p ) const
{
	//////////////////////////////////////////////////////
	// Determine if the point is inside the sphere here //
	//////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
	return false;
}

void Sphere::drawOpenGL( GLSLProgram * glslProgram ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////

	_material->drawOpenGL( glslProgram );
	glPushMatrix();
	glTranslatef( center[0] , center[1] , center[2] );
	GLUquadric *q = gluNewQuadric();
	gluSphere( q , radius , 2*Shape::OpenGLTessellationComplexity , Shape::OpenGLTessellationComplexity );
	gluDeleteQuadric( q );
	glPopMatrix();

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();

}
