// ============================================================================
// Capsule / Line function_01
// ============================================================================

precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// Capsule / Lineの距離関数
float sdCapsule(vec3 p)
{
    // 回転
    // mat3 m_x = mat3(1,0,0,0,cos(time),-sin(time),0,sin(time),cos(time));
    // p = m_x * p;
    // mat3 m_y = mat3(cos(time),0,-sin(time),0,1,0,sin(time),0,cos(time));
    // p = m_y * p;
    // mat3 m_z = mat3(cos(time),-sin(time),0,sin(time),cos(time),0,0,0,1);
    // p = m_z * p;

    vec3 a  = vec3(0.75, 0.0, 1.0);
    vec3 b  = vec3(-0.75, 0.0, 1.0);
    float r = 1.0;

    /* 元の距離関数 */
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0);
    return length( pa - ba*h ) - r;

    /* 距離関数1 */
    // vec3 pa = p - a, ba = b - a;
    // float h = min(max( dot(pa,ba)/dot(ba,ba), 0.0), 1.0);
    // return sqrt((p.x-h*ba.x)*(p.x-h*ba.x)+(p.y-h*ba.y)*(p.y-h*ba.y)+(p.z-h*ba.z)*(p.z-h*ba.z))- r;

    /* 距離関数2 */
    // vec3 pa = p - a, ba = b - a;
    // float d = dot(pa,ba)/dot(ba,ba);
    // if(d < 0.0){
    //      return length(pa) - r;
    // } else if(d > 1.0){
    //      return length( pa - ba ) - r;
    // }
    // return length( pa - ba * d ) - r;

	/* dの変化を見る_1 */
    // vec3 pa   = p - a, ba = b - a;
    // float ipr = dot(pa,ba)/(dot(ba,ba)*abs(sin(time)));
    // float h   = clamp(ipr, 0.0, 1.0);
    // return length( pa - ba*h ) - r;

	/* dの変化を見る_2 */
    // vec3 pa = p - a, ba = b - a;
    // float ipr = (dot(pa,ba)/dot(ba,ba))*abs(sin(time));
    // float h   = clamp(ipr, 0.0, 1.0);
    // return length( pa - ba*h ) - r;

	/* dの変化を見る_3 */
    // vec3 pa = p - a, ba = b - a;
    // float ipr = dot(pa,ba)/dot(ba,ba);
    // float h   = clamp(abs(sin(ipr+time)), 0.0, 1.0);
    // return length( pa - ba*h ) - r;
}

// 距離関数を呼び出すハブ関数
float distanceHub(vec3 p){
    return sdCapsule(p);
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
    vec3 cPos = vec3(0.0,  0.0,  5.0); // カメラの位置
    vec3 cDir = vec3(0.0,  0.0, -1.0); // カメラの向き(視線)
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
        // ライトベクトルの定義
        vec3 light = normalize(vec3(1.0, 1.0, 1.0));
        // ライトベクトルとの内積を取る
        float diff = max(dot(normal, light), 0.1);
        // gl_FragColor = vec4(vec3(diff, diff, diff), 1.0);
        gl_FragColor = vec4(vec3(diff*177.0/255.0, diff*120.0/255.0, diff*68.0/255.0), 1.0);
    }else{
        // 衝突しなかった場合はそのまま黒
        gl_FragColor = vec4(vec3(0.0, 0.0, 0.0), 1.0);
    }
}
