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
	// Set up the projection matrix
    
	glMatrixMode( GL_MODELVIEW );        
	glLoadIdentity();
	gluLookAt( position[0] , position[1] , position[2] , position[0]+forward[0] , position[1]+forward[1] , position[2]+forward[2] , up[0] , up[1] , up[2] );

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}

void Camera::rotateUp( Point3D center , float angle )
{
	///////////////////////////////////////////////////
	// Rotate the camera about the up direction here //
	///////////////////////////////////////////////////

    // Translate to the center 
    position[0] -= center[0];
    position[1] -= center[1];
    position[2] -= center[2];

    // Convert angle to radians
    angle = angle * (M_PI / 180.0);

    // Calculate the rotation matrix
    float cosTheta = cos(angle);
    float sinTheta = sin(angle);

    float rotatedX = cosTheta * position[0] + sinTheta * position[2];
    float rotatedZ = -sinTheta * position[0] + cosTheta * position[2];

    // Update the position
    position[0] = rotatedX;
    position[2] = rotatedZ;

	// Translate back from the center
    position[0] += center[0];
    position[1] += center[1];
    position[2] += center[2];
}

void Camera::rotateRight( Point3D center , float angle )
{
	//////////////////////////////////////////////////////
	// Rotate the camera about the right direction here //
	//////////////////////////////////////////////////////

    // Translate to the center 
    position[0] -= center[0];
    position[1] -= center[1];
    position[2] -= center[2];

    // Convert angle to radians
    angle = angle * (M_PI / 180.0);

    // Calculate the rotation matrix
    float cosTheta = cos(angle);
    float sinTheta = sin(angle);

    float rotatedY = cosTheta * position[1] -sinTheta * position[2];
    float rotatedZ = sinTheta * position[1] + cosTheta * position[2];

    // Update the position
    position[1] = rotatedY;
    position[2] = rotatedZ;

	// Translate back from the center
    position[0] += center[0];
    position[1] += center[1];
    position[2] += center[2];
}

void Camera::moveForward( float dist )
{
	//////////////////////////////////
	// Move the camera forward here //
	//////////////////////////////////
	position += forward * dist;
}

void Camera::moveRight( float dist )
{
	///////////////////////////////////////
	// Move the camera to the right here //
	///////////////////////////////////////
	position += right * dist;
}

void Camera::moveUp( float dist )
{
	/////////////////////////////
	// Move the camera up here //
	/////////////////////////////
	position += up * dist;
}
