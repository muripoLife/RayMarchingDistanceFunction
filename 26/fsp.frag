#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

float distanceHub(vec3 p){
    return length(p) - 1.;
}

vec3 genNormal(vec3 p){
	float d = 0.001;
	return normalize(vec3(
		distanceHub(p + vec3(  d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
		distanceHub(p + vec3(0.0,   d, 0.0)) - distanceHub(p + vec3(0.0,  -d, 0.0)),
		distanceHub(p + vec3(0.0, 0.0,   d)) - distanceHub(p + vec3(0.0, 0.0,  -d))
	));
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 g = genNormal(vec3(p, .15));

	vec3 plane;
	vec3 f;
	// カメラの座標
	vec3 c= vec3(0.0, 5.0, 5.0);
	vec3 y=vec3(1.0,3.0,0.0);

	for( float i=.0; i<8.; i+=.05 ) {
		f = fract(c += g*i*.1);
		plane = floor(c)*.4;
		if( cos(plane.z) + sin(plane.x) > ++plane.y ) {
			g = (f.y-.04*cos((c.x+c.z)*10.)>.7?y:f.x*y.yxz) / i;
			break;
		}

	}
	gl_FragColor = vec4(g,1.0);
}
