// ============================================================================
// sigmoid distance function
// f(x) = 1/(1+exp(-ax))
// ============================================================================

precision mediump float;
uniform vec2  resolution;
uniform vec2  mouse;
uniform float time;
uniform sampler2D prevScene;

mat3 rot_x(float arg){
    return mat3(
        1.0,0,0,
        0,cos(arg),-sin(arg),
        0,sin(arg),cos(arg)
    );
}

mat3 rot_y(float arg){
    return mat3(
        cos(arg),0,-sin(arg),
        0,1,0,
        sin(arg),0,cos(arg)
    );
}

mat3 rot_z(float arg){
    return mat3(
        cos(time),-sin(time),0,
        sin(time), cos(time),0
        ,0,0,1
    );
}

float sigmoid(float x, float k)
{
    return 1./(1.+exp(-(k*x)));
}

float sigmoid_atan(float x, float k)
{
    return (1.26*atan(0.315*k*x)+1.)/2.;
}

float dSphere(vec3 p){

    return length(p)-1.;
}

float dSequenceSigmoid(vec3 p){
    // sin刻みでSigmoid関数を慣べてみる
    // float s1 = sigmoid(p.x, 1.) + sin(p.z);
    float s = sigmoid(p.x, 32.*abs(sin(time/3.))) + sin(p.z);
    // 高さがわかりやすように強調する
    s = s*1.5;
    // ベースラインを下げてからシグモイド関数で持ち上げてみる.
    return dot(p, vec3(0.0, 1.0, 0.0)) + 4.0 - s;
}

float dSigmoidSphere(vec3 p){
    // p = vec3(sigmoid(p.x, 1.), sigmoid(p.y, 1.), sigmoid(p.z, 1.));
    // p = vec3(sigmoid(p.x, 32.*abs(sin(time/3.))), sigmoid(p.y, 1.), sigmoid(p.z, 1.));
    // p = vec3(sigmoid(p.x*sin(time), 1.), sigmoid(p.y, 1.), sigmoid(p.z, 1.));
    // p = vec3(sigmoid(p.x, 1.), sigmoid(p.y*sin(time), 1.), sigmoid(p.z, 1.));
    // p = vec3(sigmoid(p.x, 1.), sigmoid(p.y, 1.), sigmoid(p.z*sin(time), 1.));
    p = vec3(sigmoid(p.x*sin(time), 5.*abs(sin(time/3.)))+cos(time), sigmoid(p.y*sin(time)+sin(time), 5.*abs(sin(time/3.))), sigmoid(p.z, 1.));
    return length(p) - 1.0;
}

float dSigmoidTorus(vec3 p){
    // p = vec3(sigmoid(p.x, 1.), sigmoid(p.y, 1.), sigmoid(p.z, 1.));
    // p = vec3(sigmoid(p.x*sin(time), 1.), sigmoid(p.y, 1.), sigmoid(p.z, 1.));
    // p = vec3(sigmoid(p.x, 1.), sigmoid(p.y*sin(time), 1.), sigmoid(p.z, 1.));
    // p = vec3(sigmoid(p.x, 1.), sigmoid(p.y, 1.), sigmoid(p.z*sin(time), 1.));
    p = vec3(sigmoid(p.x*sin(time), 1.)+cos(time), sigmoid(p.y*sin(time)+sin(time), 1.), sigmoid(p.z, 1.));

    float r = 0.3;
    float R = 1.0;
    vec2 q = vec2(length(p.xy)-R,p.z);
    return length(q)-r;
}


float dSigmoid(vec3 p){
    /*
    ** オーソドックスに書いてみる
    ** f(x) = 1/(1+exp(-x), 0<f(x)<1で描画
    */
    // -------------------------------------------------------------------
    // return sigmoid(p.x, 1.)+sigmoid(p.y, 1.)+sigmoid(p.z, 1.)-1.0;
    // return sigmoid(p.x, 1.)+sigmoid(p.z, 1.)-1.0;
    // return sigmoid(p.x, 1.)-1.0;
    // -------------------------------------------------------------------

    /*
    ** 係数を変化させてみる
    ** f(x) = 1/(1+exp(-ax)), 0<f(x)<1で描画
    ** a = 10.*sin(time)
    */
    // -------------------------------------------------------------------
    // float a = 10.*sin(time*0.1);
    // return 1./(1.+exp(-a*p.x))+1./(1.+exp(-a*p.y))+1./(1.+exp(-a*p.z))-1.0;
    // return 1./(1.+exp(-a*p.x))+1./(1.+exp(-a*p.z))-1.0;
    // return 1./(1.+exp(-a*p.x))-1.0;
    // -------------------------------------------------------------------

    /*
    ** 係数の変化を正だけにさせてみる
    ** f(x) = 1/(1+exp(-ax)), 0<f(x)<1で描画
    ** a = 10.*abs(sin(time))
    */
    // -------------------------------------------------------------------
    // float a = 10.*abs(sin(time*0.1));
    // return 1./(1.+exp(-a*p.x))+1./(1.+exp(-a*p.y))+1./(1.+exp(-a*p.z))-1.0;
    // return 1./(1.+exp(-a*p.x))+1./(1.+exp(-a*p.z))-1.0;
    // return 1./(1.+exp(-a*p.x))-1.0;
    // -------------------------------------------------------------------

    /*
    ** 係数の変化を30まで正だけにさせてみる
    ** f(x) = 1/(1+exp(-ax)), 0<f(x)<1で描画
    ** a = 30.*abs(sin(time))
    */
    // -------------------------------------------------------------------
    // float a = 30.*abs(sin(time*0.1));
    // return 1./(1.+exp(-a*p.x))+1./(1.+exp(-a*p.y))+1./(1.+exp(-a*p.z))-1.;
    // return 1./(1.+exp(-a*p.x))+1./(1.+exp(-a*p.z))-1.0;
    // return 1./(1.+exp(-a*p.x))-1.0;
    // -------------------------------------------------------------------

    /*
    ** オーソドックスに書いてみる
    ** f(x) = 1/(1+exp(-x), 0<f(x)<10で描画
    */
    // -------------------------------------------------------------------
    // return sigmoid(p.x, 1.)+sigmoid(p.y, 1.)+sigmoid(p.z, 1.)-10.0;
    // return sigmoid(p.x, 1.)+sigmoid(p.z, 1.)-1.0;
    // return sigmoid(p.x, 1.)-1.0;
    // -------------------------------------------------------------------

    /*
    ** f(x) = 1/(1+exp(-x)
    ** 0<f(x)<k*abs(sin(time)), k =10
    */
    // -------------------------------------------------------------------
    // float k = 10.*abs(sin(time*0.1));
    // return sigmoid(p.x, 1.)+sigmoid(p.y, 1.)+sigmoid(p.z, 1.)-k;
    // return sigmoid(p.x, 1.)+sigmoid(p.z, 1.)-k;
    // return sigmoid(p.x, 1.)-k;
    // -------------------------------------------------------------------

    /*
    ** 合わせてみる
    ** f(x) = 1/(1+exp(-x)
    ** 0<f(x)<k*abs(sin(time)), k =10
    */
    // -------------------------------------------------------------------
    float k = 10.*abs(sin(time*0.1));
    float a = 10.*abs(sin(time*0.1));
    return 1./(1.+exp(-a*p.x))+1./(1.+exp(-a*p.y))+1./(1.+exp(-a*p.z))-k;
    // return 1./(1.+exp(-a*p.x))+1./(1.+exp(-a*p.z))-k;
    // return 1./(1.+exp(-a*p.x))-k;
    // -------------------------------------------------------------------
}

float distanceHub(vec3 p){
    // p = rot_x(time) * p;
    // p = rot_y(time) * p;
    // p = rot_z(time) * p;
    p = vec3(p.x+cos(time)*cos(time/2.), p.y+cos(time)*sin(time/2.), p.z+sin(time));


    // return dSigmoid(p);
    // return dSequenceSigmoid(p);
    // return min(dSigmoid(p), dSequenceSigmoid(p));
    // return dSigmoidSphere(p);
    // return dSigmoidTorus(p);
    // return dSigmoidSphere(p)*abs(sin(time))+dSigmoidTorus(p)*(1.-abs(sin(time)));
    // return (dSphere(p))*(0.1+abs(cos(time/3.)*cos(time/2.)))+dSigmoidSphere(p)*(0.1+abs(cos(time/3.)*sin(time/2.)))+dSigmoidTorus(p)*(0.1+abs(sin(time/3.)));
    return (dSphere(p)*(0.1+abs(cos(time/3.)*cos(time/2.)))+dSigmoidSphere(p)*(0.1+abs(cos(time/3.)*sin(time/2.)))+dSigmoidTorus(p)*(0.1+abs(sin(time/3.))))-0.3;

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
    if (distanceHub(p)<e){
        vec3 normal = genNormal(p);
        vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
        float diff  = max(dot(normal, light), 0.1);
        float spec = pow(diff*diff, 15.0);
        return vec3(diff*0.3+spec, diff+spec, diff+spec);
    }
    // if (dSigmoidSphere(p)<e){
    //     vec3 normal = genNormal(p);
    //     vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff  = max(dot(normal, light), 0.1);
    //     float spec = pow(diff*diff, 15.0);
    //     return vec3(diff*0.5+spec, diff+spec, diff+spec);
    // }
    // if (dSigmoidTorus(p)<e){
    //     vec3 normal = genNormal(p);
    //     vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff  = max(dot(normal, light), 0.1);
    //     float spec = pow(diff*diff, 15.0);
    //     return vec3(diff+spec, diff*0.5+spec, diff+spec);
    // }
    // if (dSphere(p)<e){
    //     vec3 normal = genNormal(p);
    //     vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff  = max(dot(normal, light), 0.1);
    //     float spec = pow(diff*diff, 15.0);
    //     return vec3(diff*0.5+spec, diff+spec, diff*0.5+spec);
    // }
    return vec3(0.);
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
    // for(int i = 0; i < 32; ++i){
        dist = distanceHub(rPos);
        rLen += dist;
        rPos = cPos + ray * rLen;
    }

    vec3 color = doColor(rPos);
    gl_FragColor = vec4(color, 1.0);
}
