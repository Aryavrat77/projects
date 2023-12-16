#include <cmath>
#include <Util/exceptions.h>
#include "scene.h"

using namespace Ray;
using namespace Util;

///////////
// Scene //
///////////
Point3D Scene::Reflect( Point3D v , Point3D n )
{
	//////////////////
	// Reflect here //
	//////////////////
	//v = -1 * v;
	Point3D l =  v - 2 * v.dot(n) * n; // using formula to calculate l
	return l;

}

bool Scene::Refract( Point3D v , Point3D n , double ir , Point3D& refract )
{
	double cosi = -n.dot(v);
    double etai = 1;
	double etat = ir;
    Point3D N = n;

    if (cosi < 0) { // If the ray is inside the object, swap the indices and invert the normal to get the correct direction
        cosi = -cosi;
        std::swap(etai, etat);
        N = -n;
    }

    double eta = etai / etat;
    double k = 1 - eta * eta * (1 - cosi * cosi);

    if (k < 0) // Total internal reflection
        return false;

    refract = eta * v + (eta * cosi - sqrt(k)) * N;

    return true;
}

Point3D Scene::getColor( Ray3D ray , int rDepth , Point3D cLimit , unsigned int lightSamples , unsigned int tIdx )
{
	Point3D color;
	RayTracingStats::IncrementRayNum();
	ShapeProcessingInfo spInfo;
	RayIntersectionFilter rFilter = []( double ){ return true; };
	if (rDepth == 0) {
		return color;
	}
	RayIntersectionKernel rKernel = [&]( const ShapeProcessingInfo &_spInfo , const RayShapeIntersectionInfo &_iInfo )
	{
		/////////////////////////////////////////////////////////
		// Create the computational kernel that gets the color //
		/////////////////////////////////////////////////////////

		RayShapeIntersectionInfo rsiInfo = _iInfo;
		rsiInfo.position = _spInfo.localToGlobal * _iInfo.position;
		rsiInfo.normal = _spInfo.normalLocalToGlobal * _iInfo.normal;
		rsiInfo.normal = rsiInfo.normal.unit();
		Point3D texSample = Point3D(1, 1, 1);

		if (_spInfo.material->tex != NULL) {
			// bilinear sample
			Point2D texAdjusted = Point2D();
			texAdjusted[0] = rsiInfo.texture[0] * (_spInfo.material->tex->_image.width() - 1);
			texAdjusted[1] = rsiInfo.texture[1] * (_spInfo.material->tex->_image.height() - 1);

			texSample[0] = (double) (_spInfo.material->tex->_image.bilinearSample(texAdjusted)).r / (double) 256;
			texSample[1] = (double) (_spInfo.material->tex->_image.bilinearSample(texAdjusted)).g / (double) 256;
			texSample[2] = (double) (_spInfo.material->tex->_image.bilinearSample(texAdjusted)).b / (double) 256;

		}

		color = Point3D(0, 0, 0);
		color += _spInfo.material->emissive * texSample;

		for( unsigned int i = 0; i < _globalData.lights.size(); i++) {
			color += _globalData.lights[i]->getAmbient(ray, rsiInfo, *(_spInfo.material)) * texSample;

			if (ray.direction.dot(rsiInfo.normal) < 0) { // replace isShadow with transparency (but doesn't give desired image because there might me a minor error in Sphere::processAllIntersections)
				color += (_globalData.lights[i]->getDiffuse(ray, rsiInfo, *(_spInfo.material)) + 
			_globalData.lights[i]->getSpecular(ray, rsiInfo, *(_spInfo.material))) * _globalData.lights[i]->isInShadow(rsiInfo, *this, tIdx) * texSample;
			}
			
		}

		// reflection 
		if (ray.direction.dot(rsiInfo.normal) < 0) {
			Ray3D reflection = Ray3D(rsiInfo.position, Reflect(ray.direction, rsiInfo.normal));
			Point3D tempColor = getColor(reflection, rDepth - 1, cLimit, lightSamples, tIdx) * _spInfo.material->specular;
			if (tempColor[0] < 0 || tempColor[1] < 0 || tempColor[2] < 0) {
				tempColor = Point3D(0, 0, 0);
			}
			color += tempColor;

		}

		// refraction
		Point3D refraction = ray.direction;
		if (Refract(ray.direction, rsiInfo.normal, _spInfo.material->ir, refraction)) {
			Ray3D refractedRay = Ray3D(rsiInfo.position, refraction);
			color += getColor(refractedRay, rDepth - 1, cLimit, lightSamples, tIdx) * _spInfo.material->transparent;
		}

		return true;
	};

	ray.position = spInfo.globalToLocal * ray.position;
	ray.direction = spInfo.directionGlobalToLocal * ray.direction;

	processFirstIntersection( ray , BoundingBox1D( Epsilon , Infinity ) , rFilter , rKernel , spInfo , tIdx );

	return color;
}

//////////////
// Material //
//////////////
void Material::drawOpenGL( GLSLProgram * glslProgram ) const
{
	//////////////////////////////
	// Do OpenGL rendering here //
	//////////////////////////////

	GLfloat ambient[] = {(GLfloat) ambient[0], (GLfloat) ambient[1], (GLfloat) ambient[2], 1.0f};
	GLfloat diffuse[] = {(GLfloat) diffuse[0], (GLfloat) diffuse[1], (GLfloat) diffuse[2], 1.0f};
	GLfloat specular[] = {(GLfloat) specular[0], (GLfloat) specular[1], (GLfloat) specular[2], 1.0f};
	GLfloat emissive[] = {(GLfloat) emissive[0], (GLfloat) emissive[1], (GLfloat) emissive[2], 1.0f};

	GLfloat shininess = (GLfloat) specularFallOff;

	// Set front material properties using glMaterialfv
    glMaterialfv(GL_FRONT, GL_AMBIENT, ambient);
    glMaterialfv(GL_FRONT, GL_DIFFUSE, diffuse);
    glMaterialfv(GL_FRONT, GL_SPECULAR, specular);
    glMaterialfv(GL_FRONT, GL_EMISSION, emissive);
    glMaterialfv(GL_FRONT, GL_SHININESS, &shininess);

	// Set back material properties using glMaterialfv
    glMaterialfv(GL_BACK, GL_AMBIENT, ambient);
    glMaterialfv(GL_BACK, GL_DIFFUSE, diffuse);
    glMaterialfv(GL_BACK, GL_SPECULAR, specular);
    glMaterialfv(GL_BACK, GL_EMISSION, emissive);
    glMaterialfv(GL_BACK, GL_SHININESS, &shininess);
	
	// Enable textures
	glEnable(GL_TEXTURE_2D);

	GLuint texName;
	glGenTextures(1, &texName);
	glBindTexture(GL_TEXTURE_2D, texName);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);

	// Sanity check to make sure that OpenGL state is good
	ASSERT_OPEN_GL_STATE();	
}

/////////////
// Texture //
/////////////
void Texture::initOpenGL( void )
{
	// ///////////////////////////////////
	// // Do OpenGL texture set-up here //
	// ///////////////////////////////////
	
	// // Generate and bind the OpenGL texture
    // glGenTextures(1, &_openGLHandle);
    // glBindTexture(GL_TEXTURE_2D, _openGLHandle);

    // // Set texture parameters
	// glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);

	// int width = _image.width();
    // int height = _image.height();

 	// // Iterate through the pixels and load data into the texture
    // for (int y = 0; y < height; ++y)
    // {
    //     for (int x = 0; x < width; ++x)
    //     {
    //         Image::Pixel32 pixel = _image(x, y);

    //         // Assuming Pixel32 has RGBA components
    //         GLubyte rgba[4] = { pixel.r, pixel.g, pixel.b, pixel.a };

    //         // Load pixel data into the texture
    //         glTexSubImage2D(GL_TEXTURE_2D, 0, x, y, 1, 1, GL_RGBA, GL_UNSIGNED_BYTE, rgba);
    //     }
    // }
    // // Unbind the texture
    // glBindTexture(GL_TEXTURE_2D, 0);

    // // Sanity check to make sure that OpenGL state is good
    // ASSERT_OPEN_GL_STATE();
}
