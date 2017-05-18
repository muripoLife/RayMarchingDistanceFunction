// ============================================================================
// clock function
// ============================================================================

precision mediump float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D prevScene;

// characuter
float line(vec2 p, vec2 s, vec2 e)
{
    float scale     = 0.075;
    float border    = 0.04;
    float lineWidth = 0.02;
    s *= scale;
    e *= scale;
    float l = length(s-e);
    vec2 d  = vec2(e-s)/l;
    p -= vec2(s.x,-s.y);
    p  = vec2(p.x*d.x+p.y*-d.y,p.x*d.y+p.y*d.x);
    return length(max(abs(p-vec2(l/2.0,0))-vec2(l/2.0,lineWidth/2.0),0.0))-border;
}

float one(vec2 p){float d=1.0;d=min(d,line(p,vec2(2.0,2.0),vec2(3.0,1.5)));d=min(d,line(p,vec2(3,1.5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(1.5,8)));d=min(d,line(p,vec2(1.5,8),vec2(4.5,8)));return d;}
float two(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(1,4.5),vec2(5,4.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,3.5)));d=min(d,line(p,vec2(1,5.5),vec2(1,7.5)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}
float three(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(1,4.5),vec2(5,4.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,3.5)));d=min(d,line(p,vec2(5,5.5),vec2(5,7.5)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}
float four(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,4.5),vec2(5,4.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,3.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,3.5)));d=min(d,line(p,vec2(5,5.5),vec2(5,7.5)));return d;}
float five(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float six(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(1,5),vec2(1,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float seven(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));return d;}
float eight(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(1,5),vec2(1,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float nine(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float zero(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(1,5),vec2(1,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float ten(vec2 p){float d=1.0;d=min(d,line(p,vec2(0,1.5),vec2(0,8)));d=min(d,line(p,vec2(3,1.5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(3,8)));d=min(d,line(p,vec2(7,1.5),vec2(3,1.5)));d=min(d,line(p,vec2(7,1.5),vec2(7,5)));d=min(d,line(p,vec2(7,5),vec2(7,8)));d=min(d,line(p,vec2(7,8),vec2(3,8)));return d;}
float eleven(vec2 p){float d=1.0;d=min(d,line(p,vec2(0,1.5),vec2(0,8)));d=min(d,line(p,vec2(4,1.5),vec2(4,8)));return d;}

float secondHand(vec2 p){float d=1.0;d=min(d,line(p,vec2(0,0),vec2(0,-20)));return d;}
float minuteHand(vec2 p){float d=1.0;d=min(d,line(p,vec2(0,0),vec2(0,-15)));return d;}

float distanceCharacter(vec3 p)
{
    float d = 1e3;
    float letters  = 1e10;
    vec3 boundingSize = vec3(30,12,0.8);

    p += vec3(0.0, 0.0, -1.0);
    // p = mat3(cos(time),0,-sin(time), 0,1,0, sin(time),0,cos(time))*p;
    float r = 2.2;
    letters = min(letters, one(vec2(p.x-r*cos(1.04), p.y-r*sin(1.04))));
    letters = min(letters, two(vec2(p.x-r*cos(0.52), p.y-r*sin(0.52))));
    letters = min(letters, three(vec2(p.x-r*cos(0.), p.y-r*sin(0.))));
    letters = min(letters, four(vec2(p.x-r*cos(-0.52), p.y-r*sin(-0.52))));
    letters = min(letters, five(vec2(p.x-r*cos(-1.04), p.y-r*sin(-1.04))));
    letters = min(letters, six(vec2(p.x-r*cos(-1.57), p.y-r*sin(-1.57))));
    letters = min(letters, seven(vec2(p.x-r*cos(-2.09), p.y-r*sin(-2.09))));
    letters = min(letters, eight(vec2(p.x-r*cos(-2.61), p.y-r*sin(-2.61))));
    letters = min(letters, nine(vec2(p.x-r*cos(3.14), p.y-r*sin(3.14))));
    letters = min(letters, ten(vec2(p.x-r*cos(2.61), p.y-r*sin(2.61))));
    letters = min(letters, eleven(vec2(p.x-r*cos(2.09), p.y-r*sin(2.09))));
    letters = min(letters, zero(vec2(p.x-r*cos(1.57), p.y-r*sin(1.57))));

    vec2 tmp =  vec2(p.x, p.y);
    vec2 tmp1 = mat2(cos(time), sin(time), -sin(time), cos(time))* tmp;
    letters = min(letters, secondHand(tmp1));
    vec2 tmp2 = mat2(cos(time*0.083), sin(time*0.083), -sin(time*0.083), cos(time*0.083))* tmp;
    letters = min(letters, minuteHand(tmp2));

    float bounding = length(max(abs(p)-boundingSize,0.0));
    letters = max(bounding, letters);
    d = min(d, letters);
    return d;
}

// Capped cylinder
float sdCappedCylinder(vec3 p)
{
    vec2 h = vec2(2.0, 0.01);
    vec2 d = abs(vec2(sqrt(p.x*p.x+p.y*p.y),p.z)) - h;
    return max(d.x,d.y),-1.0 + length(max(d,0.0));
}

float distanceHub(vec3 p){
    return min(sdCappedCylinder(p), distanceCharacter(p));
}

vec3 genNormal(vec3 p){
    float d = 0.0001;
    // float d = 0.001;
    // float d = 0.01;
    // float d = 0.1;
    // float d = 1.;
    return normalize(vec3(
        distanceHub(p + vec3(  d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
        distanceHub(p + vec3(0.0,   d, 0.0)) - distanceHub(p + vec3(0.0,  -d, 0.0)),
        distanceHub(p + vec3(0.0, 0.0,   d)) - distanceHub(p + vec3(0.0, 0.0,  -d))
    ));
}

vec3 doColor(vec3 p){
    float e = 0.001;
    // float e = 0.01;
    // float e = 0.1;
    // float e = 1.;
    if (sdCappedCylinder(p)<e){
        vec3 normal = genNormal(p);
        vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
        float diff  = max(dot(normal, light), 0.1);
        return vec3(diff, diff, diff);
    }
    if (distanceCharacter(p)<e){
        vec3 normal = genNormal(p);
        vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
        float diff  = max(dot(normal, light), 0.1);
        return vec3(diff*0.5, diff, diff);
    }
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

    for(int i = 0; i < 32; ++i){
        dist = distanceHub(rPos);
        rLen += dist;
        rPos = cPos + ray * rLen;
    }

    vec3 color = doColor(rPos);
    gl_FragColor = vec4(color, 1.0);
}
