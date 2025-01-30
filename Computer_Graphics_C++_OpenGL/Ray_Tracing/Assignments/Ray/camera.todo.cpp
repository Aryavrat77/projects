#include <cmath>
#include <Util/exceptions.h>
#include "camera.h"
#include "shape.h"

using namespace Ray;
using namespace Util;

////////////
// Camera //
////////////

Ray3D Camera::getRay( int i , int j , int width , int height ) const
{
	/////////////////////////////////////////////////
	// Get the ray through the (i,j)-th pixel here //
	/////////////////////////////////////////////////
	
	// arbitrary distance d
	double d = 10.0; 

	Point3D p1 = position + d * forward - d * tan(heightAngle / 2) * up;
	Point3D p2 = position + d * forward + d * tan(heightAngle / 2) * up;
	
	// widthAngle calculations
	double ar = (double) height / (double) width;
	double widthAngle = atan(tan(heightAngle / 2) / ar) * 2;


	Point3D pj = p1 + ((j + 0.5) / height) * (p2 - p1);

	Point3D p3 = position + d * forward + d * tan(widthAngle / 2) * right;
	Point3D p4 = position + d * forward - d * tan(widthAngle / 2) * right;

	Point3D pi = p4 + ((i + 0.5) / width) * (p3 - p4);

	// Point i-j initialization	

	Point3D pij = (pj - forward) + pi;

	if (i == 320 && j == 240) {
		std::cout << pij << std::endl;
	}

    Point3D direction = pij - position;
	direction = direction / sqrt(direction.dot(direction));
	return Ray3D(position, direction);

}

void Camera::drawOpenGL( void ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////
	WARN_ONCE( "method undefined" );

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}

void Camera::rotateUp( Point3D center , float angle )
{
	///////////////////////////////////////////////////
	// Rotate the camera about the up direction here //
	///////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
}

void Camera::rotateRight( Point3D center , float angle )
{
	//////////////////////////////////////////////////////
	// Rotate the camera about the right direction here //
	//////////////////////////////////////////////////////
	WARN_ONCE( "method undefined" );
}

void Camera::moveForward( float dist )
{
	//////////////////////////////////
	// Move the camera forward here //
	//////////////////////////////////
	WARN_ONCE( "method undefined" );
}

void Camera::moveRight( float dist )
{
	///////////////////////////////////////
	// Move the camera to the right here //
	///////////////////////////////////////
	WARN_ONCE( "method undefined" );
}

void Camera::moveUp( float dist )
{
	/////////////////////////////
	// Move the camera up here //
	/////////////////////////////
	WARN_ONCE( "method undefined" );
}
