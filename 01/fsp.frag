// ============================================================================
// レイマーチングチートシート
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
float dGraphic(vec3 p){
    // ここに図形の距離関数を書く
    return sqrt(p.x*p.x+sin(p.y*p.y+time)+p.z*p.z) - 0.5;
}

// 二つの図形を合成するの距離関数
float distanceHub(vec3 p){
    // 二つの図形の描く距離関数を書く
    return dGraphic(p);
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
    if(abs(dist) < 0.001){
        // 法線を算出
        vec3 normal  = genNormal(rPos);
        // ライトベクトルの定義（マウスの影響を受けるように）
        vec3 light   = normalize(vec3(mouse + 1.0, 1.0));
        // ライトベクトルとの内積を取る
        float diff   = max(dot(normal, light), 0.1);
        // diffuse を出力する
        gl_FragColor = vec4(vec3(diff), 1.0);
    }else{
        // 衝突しなかった場合はそのまま黒
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}