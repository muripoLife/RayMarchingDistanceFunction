// ============================================================================
// Sphere distance function
// ============================================================================

/* 精度修飾子の宣言 */
precision mediump float;

/* WebGLで受け渡された変数 */
// 解像度 (512.0, 512.0)
uniform vec2  resolution;
// mouse (-1.0 ~ 1.0)
uniform vec2  mouse;
// time (1second == 1.0)
uniform float time;
// previous scene texture
uniform sampler2D prevScene;

// 球の距離関数
float dSphere(vec3 p, float r){
	return length(p) - r;
}
// 球の距離関数(数式のみ)
float dSphere_math(vec3 p, float r){
	return sqrt(p.x*p.x+p.y*p.y+p.z*p.z) - r;
}
// 球の距離関数(数式を変形1)
float dPlaySphere_math1(vec3 p, float r){
	return sqrt(p.x*p.x-p.y*p.y+p.z*p.z) - r*(1.+sin(time));
}
// 球の距離関数(数式を変形2)
float dPlaySphere_math2(vec3 p, float r){
	return sqrt(p.x*p.x+p.y*p.y-p.z*p.z) - r*(1.+sin(time));
}
// 球の距離関数(数式を変形3)
float dPlaySphere_math3(vec3 p, float r){
	return sqrt(p.x*p.x-p.y*p.y-p.z*p.z) - r*(1.+sin(time));
}
// 球の距離関数(数式を変形4)
float dPlaySphere_math4(vec3 p, float r){
	return sqrt(p.x*p.x+sin(p.y*p.y+time)+p.z*p.z) - r;
}

// 複数の図形を合成するの距離関数
float distanceHub(vec3 p){
	// p = mat3(1.0,0,0, 0,cos(time),-sin(time), 0,sin(time),cos(time) )*p;
	// p = mat3(cos(time),0,-sin(time), 0,1,0, sin(time),0,cos(time))*p;
	// p = mat3(cos(time),-sin(time),0, sin(time), cos(time),0 ,0,0,1)*p;

	// 二つの図形の描く距離関数を書く
	float graphic = dSphere(vec3(p.x+0., p.y-(1.+sin(time)), p.z), 0.5);
	graphic = min (graphic,dSphere_math(vec3(p.x+0., p.y-(1.+cos(time)), p.z), 0.5));
	graphic = min (graphic,dPlaySphere_math1(vec3(p.x+6., p.yz), 0.5));
	graphic = min (graphic,dPlaySphere_math2(vec3(p.x+3., p.yz), 0.5));
	graphic = min (graphic,dPlaySphere_math3(vec3(p.x-3., p.yz), 0.5));
	graphic = min (graphic,dPlaySphere_math4(vec3(p.x-6., p.yz), 0.5));
	return graphic;
}

/* シェーディング */
// 法線の生成
vec3 genNormal(vec3 p){
	float d = 0.001;
	return normalize(vec3(
		distanceHub(p + vec3(  d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
		distanceHub(p + vec3(0.0,   d, 0.0)) - distanceHub(p + vec3(0.0,  -d, 0.0)),
		distanceHub(p + vec3(0.0, 0.0,   d)) - distanceHub(p + vec3(0.0, 0.0,  -d))
	));
}
// シェーディング(色など)
vec3 doColor(vec3 p){
	float e = 0.001;
	// レイとオブジェクトの距離を確認
	if (distanceHub(p)<e){
		// 法線を算出
		vec3 normal = genNormal(p);
		// ライトベクトルの定義（マウスの影響を受けるように）
		vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
		// ライトベクトルとの内積を取る
		float diff  = max(dot(normal, light), 0.1);
		return vec3(diff, diff, diff);
		// スペキュラーを定義する
		// float spec = pow(diff*diff, 15.0);
		// return vec3(diff+spec, diff+spec, diff+spec);
	}
	// 衝突しなかった場合はそのまま黒
	return vec3(0.0);
}

/* カメラのワーク */
void main(){
	// スクリーンスペースを考慮して座標を正規化
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	/* カメラを定義 */
	// カメラの位置
	vec3 cPos         = vec3(0.0,  0.0,  4.0);
	// カメラの向き(視線)
	vec3 cDir         = vec3(0.0,  0.0, -1.0);
	// カメラの上方向
	vec3 cUp          = vec3(0.0,  1.0,  0.0);
	// 外積を使って横方向を算出
	vec3 cSide        = cross(cDir, cUp);
	// フォーカスする深度
	float targetDepth = 1.0;

	// カメラの情報からレイを定義
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

	/* マーチングループを組む */
	// レイとオブジェクト間の最短距離
	float dist = 0.0;
	// レイに継ぎ足す長さ
	float rLen = 0.0;
	// レイの先端位置(初期位置)
	vec3  rPos = cPos;
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