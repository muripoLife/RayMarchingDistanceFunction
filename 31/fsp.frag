// ============================================================================
// メタボールの距離関数
// ============================================================================

precision mediump float;
// 解像度 (512.0, 512.0)
uniform vec2  resolution;
// mouse (-1.0 ~ 1.0)
uniform vec2  mouse;
// time (1second == 1.0)
uniform float time;
// previous scene texture
uniform sampler2D prevScene;

// 図形の距離関数
float dSphere(vec3 p, float r){
    // ここに図形の距離関数を書く
    return sqrt(p.x*p.x+p.y*p.y+p.z*p.z) - r;
}

float instanceSpherer(vec3 p){
    p = mat3(cos(time),-sin(time),0, sin(time),cos(time),0 ,0,0,1)*p;
    p = mat3(1,0,0, 0,cos(time),-sin(time), 0,sin(time),cos(time))*p;
    vec3 p1 = vec3(p.x+1.0*sin(time), p.y, p.z);
    vec3 p2 = vec3(p.x-1.0*sin(time), p.y, p.z);
    float spherer01 = dSphere(p1, 1.3+0.3*sin(time));
    float spherer02 = dSphere(p2, 1.3+0.3*cos(time));
    return min(spherer01, spherer02);
}

float distanceHub(vec3 p){
    // 二つの図形の描く距離関数を書く
    return instanceSpherer(p);
}

// 法線
vec3 genNormal(vec3 p){
    float d = 0.001;
    // 法線を生成
    return normalize(vec3(
        distanceHub(p + vec3(  d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
        distanceHub(p + vec3(0.0,   d, 0.0)) - distanceHub(p + vec3(0.0,  -d, 0.0)),
        distanceHub(p + vec3(0.0, 0.0,   d)) - distanceHub(p + vec3(0.0, 0.0,  -d))
    ));
}

// 図形ごとに色をわける
vec3 doColor(vec3 p){
    float e = 0.001;
    if (instanceSpherer(p)<e){
        vec3 normal  = genNormal(p);
        vec3 light   = normalize(vec3(1.0, 1.0, 1.0));
        float diff   = max(dot(normal, light), 0.1);
        return vec3(diff*abs(sin(time)), diff*abs(cos(time)), diff);
    }
    // if (dTorus(p)<e){
    //     vec3 normal  = genNormal(p);
    //     vec3 light   = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff   = max(dot(normal, light), 0.1);
    //     return vec3(diff*abs(cos(time)), diff*abs(sin(time)), diff);
    // }
    return vec3(0.0);
}

// カメラのワーク
void main(){
    // スクリーンスペースを考慮して座標を正規化
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    // カメラを定義
    vec3 cPos         = vec3(0.0,  0.0,  3.0); // カメラの位置
    vec3 cDir         = vec3(0.0,  0.0, -1.0); // カメラの向き(視線)
    vec3 cUp          = vec3(0.0,  1.0,  0.0); // カメラの上方向
    vec3 cSide        = cross(cDir, cUp);      // 外積を使って横方向を算出
    float targetDepth = 1.0;                   // フォーカスする深度

    // カメラの情報からレイを定義
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    // マーチングループを組む
    float dist = 0.0;  // レイとオブジェクト間の最短距離
    float rLen = 0.0;  // レイに継ぎ足す長さ
    vec3  rPos = cPos; // レイの先端位置(初期位置)

    // レイが進む処理(マーチングループ)
    for(int i = 0; i < 32; ++i){
        dist = distanceHub(rPos);
        rLen += dist;
        rPos = cPos + ray * rLen;
    }

    // レイとオブジェクトの距離を確認
    vec3 color = doColor(rPos);
    gl_FragColor = vec4(color, 1.0);

}
