// ============================================================================
// Mobius function
// ============================================================================
precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

/*
Mobiusの帯の距離関数(始)
*/
// x,y,zを表すための行列を定義
mat2 rotate(float u)
{
    return mat2(cos(u), sin(u), -sin(u), cos(u));   
}
float sdMobius(vec3 p)
{
    // 小半径
    float r = 0.3;
    // 大半径
    float R = 1.5;
    // 媒介変数の角度を出す
    float u = atan(p.y, p.x);
    // p.x = (cos(u)*p.x + sin(u)*p.y)
    // p.y = (-sin(u)*p.x + cos(u)*p.y)
    p.xy *= rotate(u);
    // p.x = (cos(u)*p.x + sin(u)*p.y) - R
    p.x -= R;
    // Mobiusの帯の二つの角度の関係を表現
    // p.x = cos(u/2)*{(cos(u)*p.x + sin(u)*p.y) - R} + sin(u) * p.z
    // P.z = -sin(u/2)*{(cos(u)*p.x + sin(u)*p.y) - R} + cos(u) * p.z
    p.xz *= rotate(u * 0.5);
    // ここまでを整理
    // p.x = cos(u/2)*{(cos(u)*p.x + sin(u)*p.y) - R} + sin(u) * p.z
    // p.y = (-sin(u)*p.x + cos(u)*p.y)
    // P.z = -sin(u/2)*{(cos(u)*p.x + sin(u)*p.y) - R} + cos(u) * p.z
    return abs(p.x) + abs(p.y) + abs(p.z) - r;
}
/*
MobiusStripの距離関数(終)
*/

// Torusの距離関数
float dTorus(vec3 p){
    float r = 0.3;
    float R = 1.5;
    return sqrt(p.x*p.x+p.y*p.y+p.z*p.z+R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y) ) - r;
}
// TorusToMobius
float TorusToMobius(vec3 p){
    p = mat3(cos(time), -sin(time), 0, sin(time), cos(time),0, 0,0,1.0)*p;
    return dTorus(p)*abs(sin(time))+sdMobius(p)*0.6*(1.0-abs(sin(time)));
}

// Rotetionのmubiusの帯の関数
float rotetionMubius(vec3 p){
    float r = 0.3;
    float R = 1.5;
    float u = atan(p.y, p.x);
    p.xy *= rotate(u);
    p.x -= R;
    p.xz *= rotate(u * sin(time));
    return abs(p.x) + abs(p.y) + abs(p.z) - r;
}

// 距離関数を呼び出すハブ関数
float distanceHub(vec3 p){
    return sdMobius(p)*0.6;
    // return rotetionMubius(p)*0.6;
    // return TorusToMobius(p);
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
vec4 doColor(vec3 p){
    float e = 0.001;
    if (sdMobius(p)<e){
        vec3 normal  = genNormal(p);
        vec3 light   = normalize(vec3(1.0, 1.0, 1.0));
        float diff   = max(dot(normal, light), 0.1);
        vec3 color = vec3(diff, diff, diff*0.3);
        return vec4(color, 1.0);
    }
    // if (rotetionMubius(p)<e){
    //     vec3 normal  = genNormal(p);
    //     vec3 light   = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff   = max(dot(normal, light), 0.1);
    //     vec3 color = vec3(diff, diff, diff*0.3);
    //     return vec4(color, 1.0);
    // }
    // if (dTorus(p)<e){
    //     vec3 normal  = genNormal(p);
    //     vec3 light   = normalize(vec3(1.0, 1.0, 1.0));
    //     float diff   = max(dot(normal, light), 0.1);
    //     // return vec3(diff*abs(sin(time)), diff*abs(cos(time)), diff);
    //     vec3 color = vec3(diff*0.3, diff, diff);
    //     return vec4(color, 1.0);
    // }
    vec3 color = vec3(0.0);
    return vec4(color, 1.0);
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
    for(int i = 0; i < 64; ++i){
        dist = distanceHub(rPos);
        rLen += dist;
        rPos = cPos + ray * rLen;
    }

    // レイとオブジェクトの距離を確認
    vec4 color = doColor(rPos);
    gl_FragColor = vec4(color);

}
