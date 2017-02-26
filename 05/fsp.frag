// ============================================================================
// Torus function
// ============================================================================

precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// Boxの距離関数
float dTorus(vec3 p){
    // vec2 t = vec2(1.0, 0.3);
    // vec2 q = vec2(length(p.xz)-t.x,p.y);
    // return length(q)-t.y;

    float r = 0.3;
    float R = 1.0;
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z+R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y) ) - r;
    return sqrt(p.x*p.x+p.y*p.y+p.z*p.z+R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y) ) - abs(sin(time));

    // vec2 t = vec2(【外円の半径】, 【Torusの厚さ】);
    // vec2 q = vec2(length(vec2(【x軸方向の長さ】,【z軸方向の長さ】)) - 【外円の半径】, 【Torusの高さ】);
    // return length(q)-【Torusの厚さ】;

    /*まとめると*/
    // vec2 q = vec2(length(vec2(【x軸方向の長さ】,【z軸方向の長さ】)) - 【外円の半径】, 【Torusの高さ】);
    // return length(q)-【Torusの厚さ】;
}

// 距離関数を呼び出すハブ関数
float distanceHub(vec3 p){
    return dTorus(p);
    // return max(dCube(p), length(p)-1.0*abs(sin(time)));
}

// 法線を生成する
vec3 genNormal(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        distanceHub(p + vec3(  d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
        distanceHub(p + vec3(0.0,   d, 0.0)) - distanceHub(p + vec3(0.0,  -d, 0.0)),
        distanceHub(p + vec3(0.0, 0.0,   d)) - distanceHub(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(){
    // スクリーンスペースを考慮して座標を正規化する
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    // カメラを定義する
    vec3 cPos = vec3(0.0,  1.0,  2.5); // カメラの位置
    vec3 cDir = vec3(0.0,  -0.5, -1.0); // カメラの向き(視線)
    vec3 cUp  = vec3(0.0,  1.0,  0.0); // カメラの上方向
    vec3 cSide = cross(cDir, cUp);     // 外積を使って横方向を算出
    float targetDepth = 1.0;           // フォーカスする深度

    // カメラの情報からレイを定義する
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

    // マーチングループを組む
    float dist = 0.0;  // レイとオブジェクト間の最短距離
    float rLen = 0.0;  // レイに継ぎ足す長さ
    vec3  rPos = cPos; // レイの先端位置(初期位置)
    for(int i = 0; i < 32; ++i){
        dist = distanceHub(rPos);
        rLen += dist;
        rPos = cPos + ray * rLen;
    }

    // レイとオブジェクトの距離を確認
    if(abs(dist) < 0.001){
        // 法線を算出
        vec3 normal = genNormal(rPos);

        // ライトベクトルの定義（マウスの影響を受けるように）
        // vec3 light = normalize(vec3(mouse + 1.0, 1.0));
        vec3 light = normalize(vec3(1.0, 1.0, 1.0));

        // ライトベクトルとの内積を取る
        float diff = max(dot(normal, light), 0.1);

        // diffuse を出力する
        gl_FragColor = vec4(vec3(diff), 1.0);
    }else{
        // 衝突しなかった場合はそのまま黒
        gl_FragColor = vec4(vec3(0.0, 0.0, 0.0), 1.0);
    }
}
