#include <cmath>
#include <Util/exceptions.h>
#include "scene.h"
#include "spotLight.h"

using namespace Ray;
using namespace Util;

///////////////
// SpotLight //
///////////////
Point3D SpotLight::getAmbient( Ray3D ray , const RayShapeIntersectionInfo &iInfo , const Material &material ) const
{
	////////////////////////////////////////////////////
	// Get the ambient contribution of the light here //
	////////////////////////////////////////////////////

	Point3D distance = iInfo.position - _location;
	Point3D v = distance / sqrt(distance.dot(distance));

	double dv = _direction.dot(v);

	double delta = sqrt(distance.dot(distance));

	if (cos(_cutOffAngle) < dv) {
		Point3D I =  material.ambient * (_ambient * (pow(dv, _dropOffRate))) / (_constAtten + _linearAtten * delta + _quadAtten * delta * delta);
		return I;
	} else {
		return Point3D(0,0,0);
	}

}

Point3D SpotLight::getDiffuse( Ray3D ray , const RayShapeIntersectionInfo &iInfo , const Material &material ) const
{
	////////////////////////////////////////////////////
	// Get the diffuse contribution of the light here //
	////////////////////////////////////////////////////
	Point3D distance = iInfo.position - _location;
	Point3D v = distance / sqrt(distance.dot(distance));

	double dv = _direction.dot(v);

	double delta = sqrt(distance.dot(distance));
	Point3D IL;

	if (cos(_cutOffAngle) < dv) {
		IL =  _ambient * (pow(dv, _dropOffRate)) / (_constAtten + _linearAtten * delta + _quadAtten * delta * delta);
	} else {
		IL = Point3D(0,0,0);
	}

	Point3D direction = -1 * distance;
	direction = direction / sqrt(direction.dot(direction));

	return material.diffuse * iInfo.normal.dot(direction) * IL;
}

Point3D SpotLight::getSpecular( Ray3D ray , const RayShapeIntersectionInfo &iInfo , const Material &material ) const
{
	/////////////////////////////////////////////////////
	// Get the specular contribution of the light here //
	/////////////////////////////////////////////////////
	Point3D distance = iInfo.position - _location;
	Point3D v = distance / sqrt(distance.dot(distance));

	double dv = _direction.dot(v);

	double delta = sqrt(distance.dot(distance));
	Point3D IL;

	if (cos(_cutOffAngle) < dv) {
		IL =  _specular * (pow(dv, _dropOffRate)) / (_constAtten + _linearAtten * delta + _quadAtten * delta * delta);
	} else {
		IL = Point3D(0,0,0);
	}

	Point3D vVector = ray.position - iInfo.position;
	vVector = vVector / sqrt(vVector.dot(vVector));

	Point3D lVector = distance;
	lVector = lVector / sqrt(lVector.dot(lVector));

	Point3D rVector =  lVector - 2 * lVector.dot(iInfo.normal) * iInfo.normal; // using formula to calculate rVector

	double rv = vVector.dot(rVector);

	Point3D I = material.specular * pow(rv, material.specularFallOff) * IL;

	return I;

}

bool SpotLight::isInShadow( const RayShapeIntersectionInfo& iInfo , const Shape &shape , unsigned int tIdx ) const
{
	//////////////////////////////////////////////
	// Determine if the light is in shadow here //
	//////////////////////////////////////////////
	Point3D position = iInfo.position;
	Point3D direction = _location - position;
	direction = direction / sqrt(direction.dot(direction));

	Ray3D ray(position, direction);

	Shape::ShapeProcessingInfo spInfo;
	Shape::RayIntersectionFilter rFilter = []( double ){ return true; };
	Shape::RayIntersectionKernel rKernel = [&]( const Shape::ShapeProcessingInfo &spInfo , const RayShapeIntersectionInfo &_iInfo ) { return true; };


	if (shape.processFirstIntersection(ray, BoundingBox1D(0, Infinity), rFilter, rKernel, spInfo, tIdx)) {
		return false;
	}

	return true;
}

Point3D SpotLight::transparency( const RayShapeIntersectionInfo &iInfo , const Shape &shape , Point3D cLimit , unsigned int samples , unsigned int tIdx ) const
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

void SpotLight::drawOpenGL( int index , GLSLProgram * glslProgram ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////
	glEnable(GL_LIGHTING);

	GLfloat ambient[] = {(GLfloat)_ambient[0], (GLfloat)_ambient[1], (GLfloat)_ambient[2], 1.0f};
	GLfloat diffuse[] = {(GLfloat)_diffuse[0], (GLfloat)_diffuse[1], (GLfloat)_diffuse[2], 1.0f};
	GLfloat specular[] = {(GLfloat)_specular[0], (GLfloat)_specular[1], (GLfloat)_specular[2], 1.0f};

	glLightfv(GL_LIGHT0 + index, GL_AMBIENT, ambient);
	glLightfv(GL_LIGHT0 + index, GL_DIFFUSE, diffuse);
	glLightfv(GL_LIGHT0 + index, GL_SPECULAR, specular);

    GLfloat location[] = { (GLfloat)_location[0], (GLfloat)_location[1], (GLfloat)_location[2], 1.0f };
	glLightfv(GL_LIGHT0 + index, GL_POSITION, location);

	GLfloat constant = (GLfloat) _constAtten;
	GLfloat linear = (GLfloat) _linearAtten;
	GLfloat quadratic = (GLfloat) _quadAtten;

	glLightfv(GL_LIGHT0 + index, GL_CONSTANT_ATTENUATION, &constant);
	glLightfv(GL_LIGHT0 + index, GL_LINEAR_ATTENUATION, &linear);
	glLightfv(GL_LIGHT0 + index, GL_QUADRATIC_ATTENUATION, &quadratic);
	

	GLfloat exponent = (GLfloat) _dropOffRate;
	GLfloat cutoff = (GLfloat) _cutOffAngle * (180.0 / M_PI);

	glLightfv(GL_LIGHT0 + index, GL_SPOT_EXPONENT, &exponent);
	glLightfv(GL_LIGHT0 + index, GL_SPOT_CUTOFF, &cutoff);


	glEnable(GL_LIGHT0 + index);

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}
