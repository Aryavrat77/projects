#include <algorithm>
#include "image.h"
#include <stdlib.h>
#include <math.h>
#include <Util/exceptions.h>
#include <cmath>

using namespace Util;
using namespace Image;

#define EPS 1e-10

/////////////
// Image32 //
/////////////
Image32 Image32::addRandomNoise( double noise ) const
{
	///////////////////////////
	// Add random noise here //
	///////////////////////////
	Image32 new_img = *this;

	for (Image32::iterator it = new_img.begin(); it != new_img.end(); ++it) {
		Pixel32& pixel = *it;
		double random_noise1 = -noise + 2 * noise * ((double) rand() / RAND_MAX); // [-noise, noise]
		double random_noise2 = -noise + 2 * noise * ((double) rand() / RAND_MAX); // [-noise, noise]
		double random_noise3 = -noise + 2 * noise * ((double) rand() / RAND_MAX); // [-noise, noise]

		pixel.r = floor(std::max(0.0, std::min(255.0, 255 * (pixel.r / (255 + EPS) + random_noise1))));
        pixel.g = floor(std::max(0.0, std::min(255.0, 255 * (pixel.g / (255 + EPS) + random_noise2))));
        pixel.b = floor(std::max(0.0, std::min(255.0, 255 * (pixel.b / (255 + EPS) + random_noise3))));
	}

	return new_img;
}

Image32 Image32::brighten( double brightness ) const
{
	/////////////////////////
	// Do brightening here //
	/////////////////////////
	Image32 new_img = *this;

	for (Image32::iterator it = new_img.begin(); it != new_img.end(); ++it) {
		Pixel32& pixel = *it;
		pixel.r = floor(std::min(255.0, 255 * (pixel.r / (255 + EPS) * brightness)));
        pixel.g = floor(std::min(255.0, 255 * (pixel.g / (255 + EPS) * brightness)));
        pixel.b = floor(std::min(255.0, 255 * (pixel.b / (255 + EPS) * brightness)));
		
	}
	return new_img;
}

Image32 Image32::luminance( void ) const
{
	//////////////////////////////////
	// Compute luminance image here //
	//////////////////////////////////

	Image32 new_img = *this;

	for (Image32::iterator it = new_img.begin(); it != new_img.end(); ++it) {
		Pixel32& pixel = *it;
		double luminance = 0.30 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b;
		pixel.r = floor(luminance);
        pixel.g = floor(luminance);
        pixel.b = floor(luminance);
	}
	return new_img;
}

Image32 Image32::contrast( double contrast ) const
{
	//////////////////////////////////
	// Do contrast enhancement here //
	//////////////////////////////////
	int num_pixels = width() * height(); 

	Image32 new_img = *this;
	double luminance = 0.0;

	for (Image32::iterator it = new_img.begin(); it != new_img.end(); ++it) {		
		Pixel32& pixel = *it;
		luminance += (0.30 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b);
	}
	double average_luminance = (luminance / num_pixels) / 255;

	for (Image32::iterator it = new_img.begin(); it != new_img.end(); ++it) {
		Pixel32& pixel = *it;
		pixel.r = floor(std::min(255.0, 255 * abs((pixel.r / (255 + EPS) - average_luminance) * contrast + average_luminance)));
        pixel.g = floor(std::min(255.0, 255 * abs((pixel.g / (255 + EPS) - average_luminance) * contrast + average_luminance)));
        pixel.b = floor(std::min(255.0, 255 * abs((pixel.b / (255 + EPS) - average_luminance) * contrast + average_luminance)));
	}
	return new_img;
}

Image32 Image32::saturate( double saturation ) const
{
	////////////////////////////////////
	// Do saturation enhancement here //
	////////////////////////////////////
	Image32 new_img = *this;

	for (Image32::iterator it = new_img.begin(); it != new_img.end(); ++it) {
		Pixel32& pixel = *it;
		double luminance = (0.30 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b) / 255;

		pixel.r = floor(std::min(255.0, 255 * abs((pixel.r / (255 + EPS) - luminance) * saturation + luminance)));
        pixel.g = floor(std::min(255.0, 255 * abs((pixel.g / (255 + EPS) - luminance) * saturation + luminance)));
        pixel.b = floor(std::min(255.0, 255 * abs((pixel.b / (255 + EPS) - luminance) * saturation + luminance)));
	}
	return new_img;
}

Image32 Image32::quantize( int bits ) const
{
	//////////////////////////
	// Do quantization here //
	//////////////////////////
	Image32 new_img = *this;
	double scaling_factor = 1 << bits; // compute 2^bits

	for (Image32::iterator it = new_img.begin(); it != new_img.end(); ++it) {
		Pixel32& pixel = *it;
		pixel.r = floor(std::min(255.0, (255 / (scaling_factor - 1 )) * floor(((pixel.r / (255 + EPS)) * scaling_factor))));
        pixel.g = floor(std::min(255.0, (255 / (scaling_factor - 1 )) * floor(((pixel.g / (255 + EPS)) * scaling_factor))));
        pixel.b = floor(std::min(255.0, (255 / (scaling_factor - 1 )) * floor(((pixel.b / (255 + EPS)) * scaling_factor))));
	}
	return new_img;
}

Image32 Image32::randomDither( int bits ) const
{
	////////////////////////////// 
	// Do random dithering here //
	//////////////////////////////
	Image32 new_img = *this;
	int scaling_factor = 1 << bits;

	for (Image32::iterator it = new_img.begin(); it != new_img.end(); ++it) {
		Pixel32& pixel = *it;
		double random_noise1 = -1 + 2 * ((double) rand() / RAND_MAX); // [-1, 1)
		double random_noise2 = -1 + 2 * ((double) rand() / RAND_MAX); // [-1, 1)
		double random_noise3 = -1 + 2 * ((double) rand() / RAND_MAX); // [-1, 1)

		pixel.r = floor(std::max(0.0, std::min(255.0, 255.0 * ((pixel.r / (255 + EPS)) + (random_noise1 / (scaling_factor))))));
		pixel.g = floor(std::max(0.0, std::min(255.0, 255.0 * ((pixel.g / (255 + EPS)) + (random_noise2 / (scaling_factor))))));
		pixel.b = floor(std::max(0.0, std::min(255.0, 255.0 * ((pixel.b / (255 + EPS)) + (random_noise3 / (scaling_factor))))));
	
	}
	return new_img;
}

Image32 Image32::orderedDither2X2( int bits ) const
{
	///////////////////////////////
	// Do ordered dithering here //
	///////////////////////////////

	double dither_matrix[2][2] = {{1.0, 3.0}, {4.0, 2.0}};
	Image32 new_img = *this;
	double scaling_factor = 1 << bits; // compute 2^bits

	for (int j = 0; j < height(); j++) {
		for (int i = 0; i < width(); i++) {
			Pixel32& pixel = new_img(i, j);

			//locate the index in the matrix
			int index_i = i % 2; 
			int index_j = j % 2;

			// get fractional component
			double fractional_component_cr = (scaling_factor - 1) * (pixel.r / (255 + EPS)); // [0, 4)
			double fractional_component_cg = (scaling_factor - 1) * (pixel.g / (255 + EPS));
			double fractional_component_cb = (scaling_factor - 1) * (pixel.b / (255 + EPS));

			double fractional_component_er = fractional_component_cr - floor(fractional_component_cr); // [0, 1)
			double fractional_component_eg = fractional_component_cg - floor(fractional_component_cg);
			double fractional_component_eb = fractional_component_cb - floor(fractional_component_cb);

			// round up or down
			int r = fractional_component_er > (dither_matrix[index_i][index_j] / 5) ? ceil(fractional_component_cr) : floor(fractional_component_cr);
			int g = fractional_component_eg > (dither_matrix[index_i][index_j] / 5) ? ceil(fractional_component_cg) : floor(fractional_component_cg);
			int b = fractional_component_eb > (dither_matrix[index_i][index_j] / 5) ? ceil(fractional_component_cb) : floor(fractional_component_cb);

			pixel.r = floor(std::min(255.0, r * (255 / (scaling_factor - 1))));
			pixel.g = floor(std::min(255.0, g * (255 / (scaling_factor - 1))));
			pixel.b = floor(std::min(255.0, b * (255 / (scaling_factor - 1))));
		}
	}

	return new_img;
}

Image32 Image32::floydSteinbergDither( int bits ) const
{
	///////////////////////////////////////
	// Do Floyd-Steinberg dithering here //
	///////////////////////////////////////
	Image32 source_img = *this;
	double scaling_factor = 1 << bits; // compute 2^bits

	for (int j = 0; j < height(); j++) {
		for (int i = 0; i < width(); i++) {
			Pixel32& source = source_img(i, j);
			unsigned char dest_r = floor(std::min(255.0, (255 / (scaling_factor - 1 )) * floor(((source.r / (255 + EPS)) * scaling_factor))));
        	unsigned char dest_g = floor(std::min(255.0, (255 / (scaling_factor - 1 )) * floor(((source.g / (255 + EPS)) * scaling_factor))));
        	unsigned char dest_b = floor(std::min(255.0, (255 / (scaling_factor - 1 )) * floor(((source.b / (255 + EPS)) * scaling_factor))));

			int error_r = (int) source.r - (int) dest_r;
			int error_g = (int) source.g - (int) dest_g;
			int error_b = (int) source.b - (int) dest_b;
			double r, g, b = 0.0;

			source.r = dest_r;
			source.g = dest_g;
			source.b = dest_b;

			if ((i + 1) < width()) {
				Pixel32& source = source_img(i + 1, j);
				r = error_r * (7.0 / 16.0) + source.r;
				g = error_g * (7.0 / 16.0) + source.g;
				b = error_b * (7.0 / 16.0) + source.b;

				source.r = std::max(0.0, std::min(r, 255.0));
				source.g = std::max(0.0, std::min(g, 255.0));
				source.b = std::max(0.0, std::min(b, 255.0));

			}
			if ((i - 1) >= 0 && (j + 1) < height()) {
				Pixel32& source = source_img(i - 1, j + 1);
				r = error_r * (3.0 / 16.0) + source.r;
				g = error_g * (3.0 / 16.0) + source.g;
				b = error_b * (3.0 / 16.0) + source.b;

				source.r = std::max(0.0, std::min(r, 255.0));
				source.g = std::max(0.0, std::min(g, 255.0));
				source.b = std::max(0.0, std::min(b, 255.0));
			}

			if ((j + 1) < height()) {
				Pixel32& source = source_img(i, j + 1);
				r = error_r * (5.0 / 16.0) + source.r;
				g = error_g * (5.0 / 16.0) + source.g;
				b = error_b * (5.0 / 16.0) + source.b;

				source.r = std::max(0.0, std::min(r, 255.0));
				source.g = std::max(0.0, std::min(g, 255.0));
				source.b = std::max(0.0, std::min(b, 255.0));
			}

			if ((i + 1) < width() && (j + 1) < height()) {
				Pixel32& source = source_img(i + 1, j + 1);
				r = error_r * (1.0 / 16.0) + source.r;
				g = error_g * (1.0 / 16.0) + source.g;
				b = error_b * (1.0 / 16.0) + source.b;

				source.r = std::max(0.0, std::min(r, 255.0));
				source.g = std::max(0.0, std::min(g, 255.0));
				source.b = std::max(0.0, std::min(b, 255.0));
			}
		}
	}

	return source_img;

	
}

Image32 Image32::blur3X3( void ) const
{
	//////////////////////
	// Do blurring here //
	//////////////////////

	// Assumption: the exterior values are black i.e. don't normalize at edges or corners

	double filter_matrix[3][3] = {
		{1.0 / 16.0, 2.0 / 16.0, 1.0 / 16.0},
		{2.0 / 16.0, 4.0 / 16.0, 2.0 / 16.0}, 
		{1.0 / 16.0, 2.0 / 16.0, 1.0 / 16.0}
		};

	Image32 blur_img = *this;
	Image32 copy_img = *this;

	for (int j = 0; j < height(); j++) {
		for (int i = 0; i < width(); i++) {
			Pixel32& blur_pixel = blur_img(i, j);

			double r = 0;
			double g = 0;
			double b = 0;

			for (int k = j - 1; k < j + 2; k++) {
				for (int l = i - 1; l < i + 2; l++) {
					r += (k >= 0 && k < height() && l >= 0 && l < width()) ? copy_img(l, k).r * filter_matrix[k - (j - 1)][l - (i - 1)] : 0;
					g += (k >= 0 && k < height() && l >= 0 && l < width()) ? copy_img(l, k).g * filter_matrix[k - (j - 1)][l - (i - 1)] : 0;
					b += (k >= 0 && k < height() && l >= 0 && l < width()) ? copy_img(l, k).b * filter_matrix[k - (j - 1)][l - (i - 1)] : 0;
				}
			}
			blur_pixel.r = r;
			blur_pixel.g = g;
			blur_pixel.b = b;
		}
	}

	return blur_img;
}

Image32 Image32::edgeDetect3X3( void ) const
{
	////////////////////////////
	// Do edge detection here //
	////////////////////////////

	double filter_matrix[3][3] = {
		{-1.0 / 8.0, -1.0 / 8.0, -1.0 / 8.0},
		{-1.0 / 8.0, 1.0, -1.0 / 8.0}, 
		{-1.0 / 8.0, -1.0 / 8.0, -1.0 / 8.0}
		};

	Image32 edge_img = *this;
	Image32 copy_img = *this;
	unsigned char max = 0;

	for (int j = 0; j < height(); j++) {
		for (int i = 0; i < width(); i++) {
			Pixel32& edge_pixel = edge_img(i, j);
			double r = 0;
			double g = 0;
			double b = 0;
			
			for (int k = j - 1; k < j + 2; k++) {
				for (int l = i - 1; l < i + 2; l++) {
					r += (k >= 0 && k < height() && l >= 0 && l < width()) ? copy_img(l, k).r * filter_matrix[k - (j - 1)][l - (i - 1)] : 0;
					g += (k >= 0 && k < height() && l >= 0 && l < width()) ? copy_img(l, k).g * filter_matrix[k - (j - 1)][l - (i - 1)] : 0;
					b += (k >= 0 && k < height() && l >= 0 && l < width()) ? copy_img(l, k).b * filter_matrix[k - (j - 1)][l - (i - 1)] : 0;
				}
			}


			edge_pixel.r = (unsigned char) std::max(0, std::min(255, (int) r));
			edge_pixel.g = (unsigned char) std::max(0, std::min(255, (int) g));
			edge_pixel.b = (unsigned char) std::max(0, std::min(255, (int) b));

			max = std::max(edge_pixel.r, max);
			max = std::max(edge_pixel.g, max);
			max = std::max(edge_pixel.b, max);
			
		}
	}
	double scaleFactor = 4 * (255.0 / max);
	std::cout << (int)max << std::endl;
	return edge_img.brighten(scaleFactor);
}

Image32 Image32::scaleNearest( double scaleFactor ) const
{
	/////////////////////////////////////////////////
	// Do scaling with nearest-point sampling here //
	/////////////////////////////////////////////////
	Image32 new_img;
	new_img.setSize(width() * scaleFactor, height() * scaleFactor);


	for (int j = 0; j < new_img.height(); j++) {
		for (int i = 0; i < new_img.width(); i++) {
			Point2D source_point;
			source_point[0] = i / scaleFactor;
			source_point[1] = j / scaleFactor;
			Pixel32 pixel = nearestSample(source_point);
			new_img(i, j) = pixel;
		}
	}
	return new_img;
}

Image32 Image32::scaleBilinear( double scaleFactor ) const
{
	////////////////////////////////////////////
	// Do scaling with bilinear sampling here //
	////////////////////////////////////////////
	Image32 new_img;
	new_img.setSize(width() * scaleFactor, height() * scaleFactor);

	for (int j = 0; j < new_img.height(); j++) {
		for (int i = 0; i < new_img.width(); i++) {
			Point2D source_point;
			source_point[0] = i / scaleFactor;
			source_point[1] = j / scaleFactor;
			Pixel32 pixel = bilinearSample(source_point);
			new_img(i, j) = pixel;
		}
	}
	return new_img;
}

Image32 Image32::scaleGaussian( double scaleFactor ) const
{
	////////////////////////////////////////////
	// Do scaling with Gaussian sampling here //
	////////////////////////////////////////////
	Image32 new_img;
	new_img.setSize(width() * scaleFactor, height() * scaleFactor);
	
	double variance = scaleFactor * scaleFactor;
    double radius = 2.0 * scaleFactor;

	for (int j = 0; j < new_img.height(); j++) {
		for (int i = 0; i < new_img.width(); i++) {
			Point2D source_point;
			source_point[0] = i / scaleFactor;
			source_point[1] = j / scaleFactor;
			Pixel32 pixel = gaussianSample(source_point, variance, radius);
			new_img(i, j) = pixel;
		}
	}
	return new_img;
}

Image32 Image32::rotateNearest( double angle ) const
{
	//////////////////////////////////////////////////
	// Do rotation with nearest-point sampling here //
	//////////////////////////////////////////////////

	Image32 new_img;
	angle = angle * (M_PI / 180.0);
	// Calculate the rotated image's dimensions
    double cos_angle = fabs(cos(angle));
    double sin_angle = fabs(sin(angle));
    int new_width = static_cast<int>(width() * cos_angle + height() * sin_angle);
    int new_height = static_cast<int>(width() * sin_angle + height() * cos_angle);

	double translate_x = new_width / 2.0;
	double translate_y = new_height / 2.0;

	new_img.setSize(new_width, new_height);


	for (int j = 0; j < new_img.height(); j++) {
		for (int i = 0; i < new_img.width(); i++) {
			Point2D dest_point;
			dest_point[0] = i;
			dest_point[1] = j;
			Point2D source_point;
			source_point[0] = (i - translate_x) * cos(angle) - (j - translate_y) * sin(angle) + width() / 2;
			source_point[1] = (i - translate_x) * sin(angle) + (j - translate_y) * cos(angle) + height() / 2;
				
			Pixel32 pixel = nearestSample(source_point);
			new_img(i, j) = pixel;
			
		}
	}
	return new_img;
}

Image32 Image32::rotateBilinear( double angle ) const
{
	/////////////////////////////////////////////
	// Do rotation with bilinear sampling here //
	/////////////////////////////////////////////

	Image32 new_img;
	angle = angle * (M_PI / 180.0);
	// Calculate the rotated image's dimensions
    double cos_angle = fabs(cos(angle));
    double sin_angle = fabs(sin(angle));
    int new_width = static_cast<int>(width() * cos_angle + height() * sin_angle);
    int new_height = static_cast<int>(width() * sin_angle + height() * cos_angle);

	double translate_x = new_width / 2.0;
	double translate_y = new_height / 2.0;

	new_img.setSize(new_width, new_height);


	for (int j = 0; j < new_img.height(); j++) {
		for (int i = 0; i < new_img.width(); i++) {
			Point2D dest_point;
			dest_point[0] = i;
			dest_point[1] = j;
			Point2D source_point;
			source_point[0] = (i - translate_x) * cos(angle) - (j - translate_y) * sin(angle) + width() / 2;
			source_point[1] = (i - translate_x) * sin(angle) + (j - translate_y) * cos(angle) + height() / 2;
				
			Pixel32 pixel = bilinearSample(source_point);
			new_img(i, j) = pixel;
			
		}
	}
	return new_img;
}

Image32 Image32::rotateGaussian( double angle ) const
{
	/////////////////////////////////////////////
	// Do rotation with Gaussian sampling here //
	/////////////////////////////////////////////
	Image32 new_img;
	angle = angle * (M_PI / 180.0);
	// Calculate the rotated image's dimensions
    double cos_angle = fabs(cos(angle));
    double sin_angle = fabs(sin(angle));
    int new_width = static_cast<int>(width() * cos_angle + height() * sin_angle);
    int new_height = static_cast<int>(width() * sin_angle + height() * cos_angle);

	double translate_x = new_width / 2.0;
	double translate_y = new_height / 2.0;

	new_img.setSize(new_width, new_height);


	for (int j = 0; j < new_img.height(); j++) {
		for (int i = 0; i < new_img.width(); i++) {
			Point2D dest_point;
			dest_point[0] = i;
			dest_point[1] = j;
			Point2D source_point;
			source_point[0] = (i - translate_x) * cos(angle) - (j - translate_y) * sin(angle) + width() / 2;
			source_point[1] = (i - translate_x) * sin(angle) + (j - translate_y) * cos(angle) + height() / 2;
				
			Pixel32 pixel = gaussianSample(source_point, 1, 2);
			new_img(i, j) = pixel;
			
		}
	}
	return new_img;
}

void Image32::setAlpha( const Image32& matte )
{
	///////////////////////////
	// Set alpha values here //
	///////////////////////////
	WARN( "method undefined" );
}

Image32 Image32::composite( const Image32& overlay ) const
{
	/////////////////////////
	// Do compositing here //
	/////////////////////////
	WARN( "method undefined" );
	return Image32();
}

Image32 Image32::CrossDissolve( const Image32& source , const Image32& destination , double blendWeight )
{
	////////////////////////////
	// Do cross-dissolve here //
	////////////////////////////
	WARN( "method undefined" );
	return Image32();
}

Image32 Image32::warp(const OrientedLineSegmentPairs& olsp) const
{
    // Create a new image for the output
    Image32 output_image;
    output_image.setSize(width(), height());

    // Iterate over each destination pixel in the output image
    for (int y = 0; y < height(); y++) {
        for (int x = 0; x < width(); x++) {
            Util::Point2D pout(x, y);
            Util::Point2D pin(0, 0);
            double sum_weights = 0.0;

            // Iterate over each line segment pair
            for (const auto& pair : olsp) {

				Util::Point2D qin = pair.first.GetSourcePosition(pair.first, pair.second, pout);

                double weight = pair.first.getWeight(pout);

                pin += qin * weight;
                sum_weights += weight;
            }

            pin /= sum_weights;

            output_image(x, y) = nearestSample(pin);
        }
    }

    return output_image;
}


Image32 Image32::funFilter( void ) const
{
	////////////////////////////
	// Do the fun-filter here //
	////////////////////////////

	// Swirl implemented using the pseudo-code provided here:
	// https://stackoverflow.com/questions/30448045/how-do-you-add-a-swirl-to-an-image-image-distortion?fbclid=IwAR0i_VKwEu9Er2yT3AOnWmqB47Rb6A4zenSV3yI2fDpOAn7IoX0z-o38OXQ
	

	int x_coordinate;
	int y_coordinate;
	double alpha;
	double scale = 0.1; //arbitrary swirl factor

	Image32 swirl_img;
	swirl_img.setSize(width(), height());

	int cx = (int) width() / 2; 
	int cy = (int) height() / 2;


	for (int y = 0; y < height(); y++){
		for (int x = 0; x < width(); x++){
			int row_number = y + 1; // row index to row number
			int col_number = x + 1; // column index to column number

			// computes alpha, x coordinate and y coordinate values using the helper functions
			alpha = swirl_helper(col_number, row_number, cx, cy, scale); 
			x_coordinate = coordinate_x(col_number, row_number, cx, cy, alpha);
			y_coordinate = coordinate_y(col_number, row_number, cx, cy, alpha);

			// Sets all channels to 0 (pixel is black) if the image coordinates are out of bounds
			if (!this->checkInBounds(x_coordinate,y_coordinate)) {
				swirl_img(x, y).r = 0;
				swirl_img(x, y).g = 0;
				swirl_img(x, y).b = 0;
			} else { // otherwise, maps the calculated image coordinates to the swirl image
				swirl_img(x, y) = (*this)(x_coordinate, y_coordinate);
			}
		}
	}

	return swirl_img;

}


Image32 Image32::crop( int x1 , int y1 , int x2 , int y2 ) const
{
	//////////////////////
	// Do cropping here //
	//////////////////////
	int width = (x2 - x1) + 1;
	int height = (y2 - y1) + 1;
	Image32 new_img;
	new_img.setSize(width, height);

	Pixel32 pixel_matrix[height][width];

	for (int j = y1; j <= y2; j++) {
		for (int i = x1; i <= x2; i++) {
			Pixel32 pixel = (*this)(i, j);
			pixel_matrix[j - y1][i - x1] = pixel;
		}
	}

	int row = 0;
	int col = 0;

	for (Image32::iterator it = new_img.begin(); it != new_img.end(); ++it) {
		Pixel32& pixel = *it;
		pixel = pixel_matrix[row][col];

		if (col >= width) {
			row++;
			col = 0;
		} 
		col++;
		
	}
	
	return new_img;
}

Pixel32 Image32::nearestSample( Point2D p ) const
{
	//////////////////////////////
	// Do nearest sampling here //
	//////////////////////////////
	int iu = floor(p[0] + 0.5);
	int iv = floor(p[1] + 0.5);
	if (checkInBounds(iu, iv)) {
		Pixel32 pixel = (*this)(iu, iv);
		return pixel;
	} else {
		return Pixel32();
	}
	
}

Pixel32 Image32::bilinearSample( Point2D p ) const
{
	///////////////////////////////
	// Do bilinear sampling here //
	///////////////////////////////

	double u = p[0];
	double v = p[1];

	int u1 = floor(u);
	int v1 = floor(v);
	int u2 = u1 + 1;
	int v2 = v1 + 1;

	double du = u - u1;

	Pixel32 pixel_a;
	if (checkInBounds(u1, v1) && checkInBounds(u2, v1)) {
		pixel_a.r = (*this)(u1, v1).r * (1 - du) + (*this)(u2, v1).r * (du);
		pixel_a.g = (*this)(u1, v1).g * (1 - du) + (*this)(u2, v1).g * (du);
		pixel_a.b = (*this)(u1, v1).b * (1 - du) + (*this)(u2, v1).b * (du);
	}
	

	Pixel32 pixel_b;
	if (checkInBounds(u1, v2) && checkInBounds(u2, v2)) {
		pixel_b.r = (*this)(u1, v2).r * (1 - du) + (*this)(u2, v2).r * (du);
		pixel_b.g = (*this)(u1, v2).g * (1 - du) + (*this)(u2, v2).g * (du);
		pixel_b.b = (*this)(u1, v2).b * (1 - du) + (*this)(u2, v2).b * (du);
	}
	double dv = v - v1;
	
	Pixel32 dest_pixel;
	dest_pixel.r = std::max(0, (int) std::min(255.0, floor(pixel_a.r * (1 - dv) + pixel_b.r * dv)));
	dest_pixel.g = std::max(0, (int) std::min(255.0, floor(pixel_a.g * (1 - dv) + pixel_b.g * dv)));
	dest_pixel.b = std::max(0, (int) std::min(255.0, floor(pixel_a.b * (1 - dv) + pixel_b.b * dv)));

	return dest_pixel;
}

bool Image32::checkInBounds(int x, int y) const {
	return x >= 0 && x < width() && y >= 0 && y < height();
}

Pixel32 Image32::gaussianSample( Point2D p , double variance , double radius ) const
{
	///////////////////////////////
	// Do Gaussian sampling here //
	///////////////////////////////

	int x = static_cast<int>(p[0]);
    int y = static_cast<int>(p[1]);

	double density_sum = 0.0;
	double density = 0.0;
	double distance = 0.0;
	double sum_r = 0.0;
	double sum_g = 0.0;
	double sum_b = 0.0;

	for (int j = floor(y - radius); j <= floor(y + radius); j++) {
    	for (int i = floor(x - radius); i <= floor(x + radius); i++) {
			if ((x - i) * (x - i) + (y - j) * (y - j) < (radius * radius)) {
				if (checkInBounds(i, j)) {
   					distance = (pow(i - x - radius, 2) + pow(j - y - radius, 2));
            		density = (1.0 / (2.0 * M_PI * variance)) * exp(-distance / (2 * variance));
					density_sum += density;
					sum_r += density * (*this)(i, j).r; 
					sum_g += density * (*this)(i, j).g;
					sum_b += density * (*this)(i, j).b;
				} else { // set other canvas pixels to black
					Pixel32 pixel;
					pixel.r = 0;
					pixel.g = 0;
					pixel.b = 0;
					return pixel;
				}	
			}
    	} 
	}
	sum_r /= density_sum;
	sum_g /= density_sum;
	sum_b /= density_sum;

	Pixel32 pixel;
	pixel.r = std::max(0.0, std::min(255.0, sum_r));
	pixel.g = std::max(0.0, std::min(255.0, sum_g));
	pixel.b = std::max(0.0, std::min(255.0, sum_b));


	return pixel;
}


int Image32::coordinate_x(int x, int y, int cx, int cy, double alpha) const{
  int coordinate_x = (int)(((x - cx) * cos(alpha)) - ((y - cy) * sin(alpha)) + cx) - 1;
  return coordinate_x;
}


int Image32::coordinate_y(int x, int y, int cx, int cy, double alpha) const{
  int coordinate_y = (int)(((x - cx) * sin(alpha)) + ((y - cy) * cos(alpha)) + cy) - 1;
  return coordinate_y;
}

double Image32::swirl_helper(int x, int y, int cx, int cy, double s) const{
  	double alpha = sqrt(pow((x - cx), 2) + pow((y - cy), 2)) / s; 
  	return alpha;
}
