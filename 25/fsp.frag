// ============================================================================
// Triangle stone distance function
// ============================================================================

precision mediump float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D prevScene;

float rnd(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 v = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float r = mix(
        mix(rnd(v), rnd(v + vec2(1.0, 0.0)), u.x),
        mix(rnd(v + vec2(0.0, 1.0)), rnd(v + vec2(1.0, 1.0)), u.x),
        u.y
    );
    return r * r;
}

float snoise(vec2 p){
    float n = 0.0;
    for(float i = 0.0; i < 4.0; ++i){
        float v = pow(2.0, 2.0 + i);
        float w = pow(2.0, -1.0 - i);
        n += noise(p * v) * w;
    }
    return n;
}

float dot2( in vec3 v ) { return dot(v,v); }
float udTriangle( vec3 p, vec3 a, vec3 b, vec3 c )
{
    vec3 ba = b - a; vec3 pa = p - a;
    vec3 cb = c - b; vec3 pb = p - b;
    vec3 ac = a - c; vec3 pc = p - c;
    vec3 nor = cross( ba, ac );

    return sqrt(
        (sign(dot(cross(ba,nor),pa)) +
        sign(dot(cross(cb,nor),pb)) +
        sign(dot(cross(ac,nor),pc))<2.0)
        ?
        min( min(
        dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
        dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),
        dot2(ac*clamp(dot(ac,pc)/dot2(ac),0.0,1.0)-pc) )
        :
        dot(nor,pa)*dot(nor,pa)/dot2(nor)
    );
}
float udQuad( vec3 p, vec3 a, vec3 b, vec3 c, vec3 d )
{
    vec3 ba = b - a; vec3 pa = p - a;
    vec3 cb = c - b; vec3 pb = p - b;
    vec3 dc = d - c; vec3 pc = p - c;
    vec3 ad = a - d; vec3 pd = p - d;
    vec3 nor = cross( ba, ad );

    return sqrt(
    (sign(dot(cross(ba,nor),pa)) +
        sign(dot(cross(cb,nor),pb)) +
        sign(dot(cross(dc,nor),pc)) +
        sign(dot(cross(ad,nor),pd))<3.0)
        ?
        min( min( min(
        dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
        dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),
        dot2(dc*clamp(dot(dc,pc)/dot2(dc),0.0,1.0)-pc) ),
        dot2(ad*clamp(dot(ad,pd)/dot2(ad),0.0,1.0)-pd) )
        :
        dot(nor,pa)*dot(nor,pa)/dot2(nor)
    );
}

float udInstanceTriangle01(in vec3 p)
{
    return (udTriangle(p,
        vec3(0.0, 0.707, 0.0),
        vec3( 1.0, -1.0, 1.0),
        vec3(-1.0, -1.0, 1.0))- 0.01)*0.5;
}
float udInstanceTriangle02(in vec3 p)
{
    return (udTriangle(p,
        vec3(0.0, 0.707, 0.0),
        vec3(1.0, -1.0, 1.0),
        vec3(1.0, -1.0,-1.0))- 0.01)*0.5;
}

float udInstanceTriangle03(in vec3 p)
{
    return (udTriangle(p,
        vec3(0.0, 0.707, 0.0),
        vec3(-1.0, -1.0, -1.0),
        vec3(-1.0, -1.0, 1.0))- 0.01)*0.5;
}
float udInstanceTriangle04(in vec3 p)
{
    return (udTriangle(p,
        vec3(0.0, 0.707, 0.0),
        vec3(-1.0, -1.0, -1.0),
        vec3( 1.0, -1.0, -1.0))- 0.01)*0.5;
}
float udInstanceQuad(in vec3 p)
{
    return (udQuad(p,
        vec3(-1.0, -1.0,  1.0),
        vec3(-1.0, -1.0, -1.0),
        vec3( 1.0, -1.0, -1.0),
        vec3( 1.0, -1.0,  1.0)
        ) - 0.01)*0.5;
}

float sdTriangleStone(vec3 p){
    // return udInstanceQuad(p);

    return min(min(min(min(
        udInstanceTriangle01(p),
        udInstanceTriangle02(p)),
        udInstanceTriangle03(p)),
        udInstanceTriangle04(p)),
        udInstanceQuad(p)
    );
}

float distanceHub(vec3 p){
    // p = mat3(1.0,0,0, 0,cos(time),-sin(time), 0,sin(time),cos(time) )*p;
    p = mat3(cos(time),0,-sin(time), 0,1,0, sin(time),0,cos(time))*p;
    p = mat3(cos(time),-sin(time),0, sin(time), cos(time),0 ,0,0,1)*p;
    // return sdTriangleStone(p);
    return sdTriangleStone(vec3(p.x+snoise(p.xz)*0.1, p.y+snoise(p.xz)*0.1, p.z+snoise(p.xz)*0.1));
    // return sdTriangleStone(vec3(p.x+noise(p.xz)*0.1, p.y+noise(p.xz)*0.1, p.z+noise(p.xz)*0.1));
    
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
    // float e = 0.001;
    // float e = 0.01;
    // float e = 0.1;
    // float e = 0.5;
    // float e = 0.1 + 0.9*abs(sin(time));
    float e = 1.;

    if (sdTriangleStone(p)<e){
        vec3 normal = genNormal(p);
        vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
        float diff  = max(dot(normal, light), 0.1);
        float spec = pow(diff*diff, 15.0);
        return vec3(251, 231, 49)*diff/255.0 +vec3(spec);
    }

    // if (udInstanceTriangle01(p)<e){
    //     vec3 normal = genNormal(p);
    //     vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff  = max(dot(normal, light), 0.1);
    //     float spec = pow(diff*diff, 15.0);
    //     return vec3(diff*0.3+spec, diff+spec, diff+spec);
    // }
    // if (udInstanceTriangle02(p)<e){
    //     vec3 normal = genNormal(p);
    //     vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff  = max(dot(normal, light), 0.1);
    //     float spec = pow(diff*diff, 15.0);
    //     return vec3(diff*0.3+spec, diff+spec, diff+spec);
    // }
    // if (udInstanceTriangle03(p)<e){
    //     vec3 normal = genNormal(p);
    //     vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff  = max(dot(normal, light), 0.1);
    //     float spec = pow(diff*diff, 15.0);
    //     return vec3(diff*0.3+spec, diff+spec, diff+spec);
    // }
    // if (udInstanceTriangle04(p)<e){
    //     vec3 normal = genNormal(p);
    //     vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff  = max(dot(normal, light), 1.0);
    //     float spec = pow(diff*diff, 15.0);
    //     return vec3(diff*0.3+spec, diff+spec, diff+spec);
    // }
    return vec3(0.0);
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 cPos  = vec3(0.0, 0.0,  5.0);
    vec3 cDir  = vec3(0.0, 0.0, -1.0);
    vec3 cUp   = vec3(0.0, 1.0,  0.0);
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 1.0;

    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    float dist = 0.0;
    float rLen = 0.0;
    vec3 rPos = cPos;

    for(int i = 0; i < 64; ++i){
        dist = distanceHub(rPos);
        rLen += dist;
        rPos = cPos + ray * rLen;
    }

    vec3 color = doColor(rPos);
    gl_FragColor = vec4(color, 1.0);
}
