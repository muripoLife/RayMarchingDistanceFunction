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
    // Torusの距離関数
    // vec2 t = vec2(1.0, 0.3);
    // vec2 q = vec2(length(p.xz)-t.x,p.y);
    // return length(q)-t.y;

    // lenght使わない方法
    // float r = 0.3;
    // float R = 1.0;
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y) ) - r;

    float r = 0.3;
    float R = 1.0;
    // 波面ぽいやつ
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - (3.0-abs(sin(time))) * R * sqrt(p.x*p.x+p.y*p.y) ) - r;

    // Sphere
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y+p.z*p.z) ) - r;

    // TorusからSphereへ変形
    return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y+p.z*p.z*abs(sin(time))) ) - r;

    // 縦向き(xz)から横向き(xy)へ変形
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y*abs(sin(time))+p.z*p.z*abs(cos(time))) ) - r;

    // xzきからyzへ変形
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x*abs(cos(time))+p.y*p.y*abs(sin(time))+p.z*p.z) ) - r;

    // xy→yzに回転をかける
    // mat3 m_1 = mat3(cos(time), -sin(time), 0, sin(time), cos(time), 0, 0, 0, 1);
    // mat3 m_2 = mat3(0, 0, 1, cos(time), -sin(time), 0, sin(time), cos(time), 0);
    // mat3 m_3 = mat3( cos(time),0 , -sin(time), 0, 1, 0, sin(time), 0, cos(time));
    // p = m_2* m_1 * p;
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y*abs(sin(time))+p.z*p.z*abs(cos(time))) ) - r;

    // // xy→yzに逆回転も追加
    // float t = 180.0 * sin(time/100.0);
    // mat3 m_1 = mat3(cos(t), -sin(t), 0, sin(t), cos(t), 0, 0, 0, 1);
    // mat3 m_2 = mat3(0, 0, 1, cos(t), -sin(t), 0, sin(t), cos(t), 0);
    // mat3 m_3 = mat3( cos(t),0 , -sin(t), 0, 1, 0, sin(t), 0, cos(t));
    // p = m_2* m_1 * p;
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y*abs(sin(time))+p.z*p.z*abs(cos(time))) ) - r;

    // xy→yzに逆回転も追加
    // float t = 180.0 * sin(time/100.0);
    // mat3 m_1 = mat3(cos(t), -sin(t), 0, sin(t), cos(t), 0, 0, 0, 1);
    // mat3 m_2 = mat3(0, 0, 1, cos(t), -sin(t), 0, sin(t), cos(t), 0);
    // mat3 m_3 = mat3( cos(t),0 , -sin(t), 0, 1, 0, sin(t), 0, cos(t));
    // p = m_2* m_1 * p;
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y*abs(sin(time))+p.z*p.z*abs(cos(time))) ) - r;

    // 遊んでみた
    // float t = 180.0 * sin(time/100.0);
    // mat3 m_1 = mat3(cos(t), -sin(t), 0, sin(t), cos(t), 0, 0, 0, 1);
    // mat3 m_2 = mat3(0, 0, 1, cos(t), -sin(t), 0, sin(t), cos(t), 0);
    // mat3 m_3 = mat3( cos(t),0 , -sin(t), 0, 1, 0, sin(t), 0, cos(t));
    // p = m_2* m_1 * p;
    // return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x*abs(cos(time))+p.y*p.y*abs(sin(time))+p.z*p.z*abs(tan(10.0*abs(sin(time/100.0))))) ) - r;
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
