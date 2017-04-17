// ============================================================================
// Quad
// ============================================================================

precision mediump float;
uniform vec2 resolution;     // resolution (512.0, 512.0)
uniform vec2 mouse;          // mouse(-1.0 ~ 1.0)
uniform float time;          // time(1second == 1.0)
uniform sampler2D prevScene; // previous scene texture


float dot2( in vec3 v ) { return dot(v,v); }
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

float udInstanceQuad(in vec3 p)
{
// 	p = mat3(1.0,0,0, 0,cos(1.57),-sin(1.57), 0,sin(1.57),cos(1.57) )*p;
// 	p = mat3(1.0,0,0, 0,cos(0.78),-sin(0.78), 0,sin(0.78),cos(0.78) )*p;
// 	p = mat3(cos(1.57),0,-sin(1.57), 0,1,0, sin(1.57),0,cos(1.57))*p;
	p = mat3(cos(0.78),0,-sin(0.78), 0,1,0, sin(0.78),0,cos(0.78))*p;
// 	p = mat3(cos(1.57),-sin(1.57),0, sin(1.57), cos(1.57),0 ,0,0,1)*p;

// 	p = mat3(1.0,0,0, 0,cos(time),-sin(time), 0,sin(time),cos(time) )*p;
// 	p = mat3(cos(time),0,-sin(time), 0,1,0, sin(time),0,cos(time))*p;
// 	p = mat3(cos(time),-sin(time),0, sin(time), cos(time),0 ,0,0,1)*p;
	return udQuad(p, vec3(0.0, 0.5, 1.0), vec3(0.2, 0.8, 0.5), vec3(0.9, 0.3, 0.4),vec3(0.7, 0.1, 0.6) );
// 	return udQuad(p, vec3(0.0, 0.5, 1.0), vec3(0.2, 0.8, 0.5), vec3(0.9, 0.3, 0.4),vec3(0.7, 0.1, 0.6) )*abs(sin(time))+udTriangle(p, vec3(0.0, 0.5, 1.0), vec3(0.2, 1.0, 0.9), vec3(0.9, 0.2, 0.1) )*(1.0-abs(sin(time)));
}

float distanceHub(vec3 p){
	// 0.4を書けて、rayの進行を遅らせている
	return udInstanceQuad(p)*0.5;
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
	if (udInstanceQuad(p)<e){
		vec3 normal = genNormal(p);
		vec3 light  = normalize(vec3(1.0, 1.0, 1.0));
		float diff  = max(dot(normal, light), 0.1);
		return vec3(diff, diff, diff);
	}
	return vec3(0.0);
}

// カメラのワーク
void main(){
	// スクリーンスペースを考慮して座標を正規化
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	// カメラを定義
	vec3 cPos  = vec3(0.0, 0.0,  3.0);   // カメラの位置
	vec3 cDir  = vec3(0.0, 0.0, -1.0);   // カメラの向き(視線)
	vec3 cUp   = vec3(0.0, 1.0,  0.0);   // カメラの上方向
	vec3 cSide = cross(cDir, cUp);       // 外積を使って横方向を算出
	float targetDepth = 1.0;             // フォーカスする深度

	// カメラの情報からレイを定義
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
	// マーチングループを組む
	float dist = 0.0; // レイとオブジェクト間の最短距離
	float rLen = 0.0; // レイに継ぎ足す長さ
	vec3 rPos = cPos; // レイの先端位置(初期位置)

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
