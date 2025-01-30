#include <cmath>
#include <Util/exceptions.h>
#include "directionalLight.h"
#include "scene.h"

using namespace Ray;
using namespace Util;

//////////////////////
// DirectionalLight //
//////////////////////

Point3D DirectionalLight::getAmbient( Ray3D ray , const RayShapeIntersectionInfo &iInfo , const Material &material ) const
{
	////////////////////////////////////////////////////
	// Get the ambient contribution of the light here //
	////////////////////////////////////////////////////
	return _ambient * material.ambient;
}

Point3D DirectionalLight::getDiffuse( Ray3D ray , const RayShapeIntersectionInfo &iInfo , const Material &material ) const
{
	////////////////////////////////////////////////////
	// Get the diffuse contribution of the light here //
	////////////////////////////////////////////////////

	Point3D IL = _diffuse;
	Point3D I = material.diffuse * iInfo.normal.dot(-1 * _direction) * IL;
	return I;
}

Point3D DirectionalLight::getSpecular( Ray3D ray , const RayShapeIntersectionInfo &iInfo , const Material &material ) const
{
	/////////////////////////////////////////////////////
	// Get the specular contribution of the light here //
	/////////////////////////////////////////////////////
	Point3D IL = _specular;

	Point3D vVector = ray.position - iInfo.position;
	vVector = vVector / sqrt(vVector.dot(vVector));

	Point3D lVector = _direction;
	lVector = lVector / sqrt(lVector.dot(lVector));

	Point3D rVector =  lVector - 2 * lVector.dot(iInfo.normal) * iInfo.normal; // using formula to calculate rVector

	double rv = vVector.dot(rVector);

	Point3D I = material.specular * pow(rv, material.specularFallOff) * IL;

	return I;
}

bool DirectionalLight::isInShadow( const RayShapeIntersectionInfo& iInfo , const Shape &shape , unsigned int tIdx ) const
{
	//////////////////////////////////////////////
	// Determine if the light is in shadow here //
	//////////////////////////////////////////////
	Point3D position = iInfo.position;	

	Ray3D ray(position, -1 * _direction);

	Shape::ShapeProcessingInfo spInfo;
	Shape::RayIntersectionFilter rFilter = []( double ){ return true; };
	Shape::RayIntersectionKernel rKernel = [&]( const Shape::ShapeProcessingInfo &spInfo , const RayShapeIntersectionInfo &_iInfo ) { return true; };


	if (shape.processFirstIntersection(ray, BoundingBox1D(Epsilon, Infinity), rFilter, rKernel, spInfo, tIdx)) {
		return false;
	}

	return true;
}

Point3D DirectionalLight::transparency( const RayShapeIntersectionInfo &iInfo , const Shape &shape , Point3D cLimit , unsigned int samples , unsigned int tIdx ) const
{
	//////////////////////////////////////////////////////////
	// Compute the transparency along the path to the light //
	//////////////////////////////////////////////////////////
	AffineShape::ShapeProcessingInfo spInfo = AffineShape::ShapeProcessingInfo();
	Shape* shapeType = (Shape*) &shape;
	Ray3D shadow = Ray3D(iInfo.position, -_direction);
	const BoundingBox1D range = BoundingBox1D(Epsilon, Infinity);
	const AffineShape::RayIntersectionFilter dummyFilter = [](double) { return true; };
	Point3D totalTransparency = Point3D(1.0, 1.0, 1.0); // assume no transparency (1, 1, 1) 
	const AffineShape::RayIntersectionKernel dummyKernel = [&](const AffineShape::ShapeProcessingInfo& spInfo, const RayShapeIntersectionInfo& _iInfo) {
		totalTransparency += spInfo.material->transparent;
		return true;
	};
	int numIntersections = shapeType->processAllIntersections(shadow, range, dummyFilter, dummyKernel, spInfo, tIdx);
	return totalTransparency;
}

void DirectionalLight::drawOpenGL( int index , GLSLProgram * glslProgram ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////
	
	GLfloat ambient[] = {(GLfloat)_ambient[0], (GLfloat)_ambient[1], (GLfloat)_ambient[2], 1.0f};
	GLfloat diffuse[] = {(GLfloat)_diffuse[0], (GLfloat)_diffuse[1], (GLfloat)_diffuse[2], 1.0f};
	GLfloat specular[] = {(GLfloat)_specular[0], (GLfloat)_specular[1], (GLfloat)_specular[2], 1.0f};

	glLightfv(GL_LIGHT0 + index, GL_AMBIENT, ambient);
	glLightfv(GL_LIGHT0 + index, GL_DIFFUSE, diffuse);
	glLightfv(GL_LIGHT0 + index, GL_SPECULAR, specular);

	GLfloat direction[] = {(GLfloat)-_direction[0], (GLfloat)-_direction[1], (GLfloat)-_direction[2], 0.0f};

	glLightfv(GL_LIGHT0 + index, GL_POSITION, direction);

	glEnable(GL_LIGHT0 + index);

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}
