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

	// Got ideas for this function here: https://stackoverflow.com/questions/7687148/drawing-sphere-in-opengl-without-using-glusphere

	glBegin(GL_TRIANGLES);

    const int tessellation = OpenGLTessellationComplexity;

    for (int i = 0; i < tessellation; ++i) {
        for (int j = 0; j < tessellation; ++j) {
            float theta1 = i * 2.0 * M_PI / tessellation;
            float theta2 = (i + 1) * 2.0 * M_PI / tessellation;
            float phi1 = j * M_PI / tessellation;
            float phi2 = (j + 1) * M_PI / tessellation;

            Util::Point3D v1(center[0] + radius * sin(phi1) * cos(theta1),
                            center[1] + radius * sin(phi1) * sin(theta1),
                            center[2] + radius * cos(phi1));

            Util::Point3D v2(center[0] + radius * sin(phi1) * cos(theta2),
                            center[1] + radius * sin(phi1) * sin(theta2),
                            center[2] + radius * cos(phi1));

            Util::Point3D v3(center[0] + radius * sin(phi2) * cos(theta1),
                            center[1] + radius * sin(phi2) * sin(theta1),
                            center[2] + radius * cos(phi2));

            Util::Point3D v4(center[0] + radius * sin(phi2) * cos(theta2),
                            center[1] + radius * sin(phi2) * sin(theta2),
                            center[2] + radius * cos(phi2));

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

    ASSERT_OPEN_GL_STATE();
}
