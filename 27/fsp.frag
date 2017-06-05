// ============================================================================
//  diffusion
// ============================================================================

precision mediump float;

uniform vec2  resolution;
uniform vec2  mouse;
uniform float time;
uniform sampler2D prevScene;

float rnd(vec2 n) {
    return sin(n.x+n.y);
}

float noise(vec2 p){
    vec2 v = floor(p);
    vec2 u = fract(p);
    float r = mix(
        mix(rnd(v), rnd(v + vec2(1.0, 0.0)), u.x),
        mix(rnd(v + vec2(0.0, 1.0)), rnd(v + vec2(1.0, 1.0)), u.x),
        u.y
    );
    return r;
}

float snoise(vec2 p){
    float n = 0.0;
    for(float i = 0.0; i < 4.0; ++i){
        float v = pow(2.0, 2.0 + i);
        float w = pow(2.0, -1.0 - i);
        n += noise(p * v) * w;
    }
    return n*0.2;
}

float dSphere(vec3 p, float r){
    return sqrt(p.x*p.x+p.y*p.y+p.z*p.z) - r;
}

float instanceSpherer(vec3 p){
    // p = mat3(cos(time),-sin(time),0, sin(time),cos(time),0 ,0,0,1)*p;
    // p = mat3(cos(time),0,-sin(time), 0,1.0,0, sin(time),0,cos(time))*p;
    p = mat3(1,0,0, 0,cos(time),-sin(time), 0,sin(time),cos(time))*p;

    float spherer = dSphere(vec3(p.x+snoise(p.xz), p.y+snoise(p.xz), p.z+snoise(p.xz)), 1.3);
    return spherer;
}

float distanceHub(vec3 p){
    return instanceSpherer(p);
}

vec3 genNormal(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        distanceHub(p + vec3(  d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
        distanceHub(p + vec3(0.0,   d, 0.0)) - distanceHub(p + vec3(0.0,  -d, 0.0)),
        distanceHub(p + vec3(0.0, 0.0,   d)) - distanceHub(p + vec3(0.0, 0.0,  -d))
    ));
}

vec3 doColor(vec3 p){
    float e = 0.001;
    if (instanceSpherer(p)<e){
        vec3 normal  = genNormal(p);
        vec3 light   = normalize(vec3(1.0, 1.0, 1.0));
        float diff   = max(dot(normal, light), 0.1);
        float spec   = pow(diff*diff, 15.0);
        return vec3(diff*0.3+spec, diff+spec, diff+spec);
    }
    return vec3(0.0);
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 cPos         = vec3(0.0,  0.0,  3.0);
    vec3 cDir         = vec3(0.0,  0.0, -1.0);
    vec3 cUp          = vec3(0.0,  1.0,  0.0);
    vec3 cSide        = cross(cDir, cUp);
    float targetDepth = 1.0;

    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

    float dist = 0.0;
    float rLen = 0.0;
    vec3  rPos = cPos;

    for(int i = 0; i < 32; ++i){
        dist = distanceHub(rPos);
        rLen += dist;
        rPos = cPos + ray * rLen;
    }

    vec3 color = doColor(rPos);
    gl_FragColor = vec4(color, 1.0);

}
