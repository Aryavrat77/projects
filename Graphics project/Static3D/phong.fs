#version 400
uniform vec3 light_ambient;
uniform vec3 light_diffuse;
uniform vec3 light_specular;
uniform vec3 material_emissive;
uniform vec3 material_ambient;
uniform vec3 material_diffuse;
uniform vec3 material_specular;
uniform float material_specular_shininess;
in vec3 v_normal;
in vec3 v_eye_to_position;
in vec3 v_light_direction;
layout (location = 0) out vec4 FragColor;

void main( void )
{
	vec3 surface_normal = normalize( v_normal );
	vec3 position_to_light = normalize( -v_light_direction );

	// Ambient + emissive components
	vec3 lighting_color = material_emissive + light_ambient * material_ambient;
	float normal_dot_light = dot( position_to_light , surface_normal );
	if( normal_dot_light>0. )
	{
		// Diffuse component
		lighting_color += normal_dot_light * ( light_diffuse * material_diffuse );

		// Specular component
		vec3 position_to_eye = normalize( -v_eye_to_position );
		vec3 specular_direction = 2.f * surface_normal * normal_dot_light - position_to_light;
		float specular_attenuation = pow( max( dot( specular_direction , position_to_eye ) , 0.0 ) , material_specular_shininess );
		lighting_color += specular_attenuation * ( light_specular * material_specular );
	}
	FragColor = vec4( min( lighting_color , 1. ) , 1.0 );

}