// ============================================================================
// Capped Cone
// ============================================================================

precision mediump float;
uniform vec2 resolution;     // resolution (512.0, 512.0)
uniform vec2 mouse;          // mouse(-1.0 ~ 1.0)
uniform float time;          // time(1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

float sdCappedCone(in vec3 p)
{
	vec3 c = vec3(1.0, 1.0, 1.0);
	vec2 q  = vec2(length(p.xz), p.y);
	vec2 v  = vec2(c.z*c.y/c.x, -c.z);
	vec2 w  = v - q;
	vec2 vv = vec2(dot(v,v), v.x*v.x);
	vec2 qv = vec2(dot(v,w), v.x*w.x);
	vec2 d  = max(qv,0.0)*qv/vv;
	return sqrt(dot(w,w) - max(d.x,d.y)) * sign(max(q.y*v.x-q.x*v.y,w.y));
}

/*できるだけ数式に直したもの*/
float sdMathCappedCone(in vec3 p)
{
	vec3 c = vec3(1.0, 1.0, 1.0);
	vec2 q  = vec2(sqrt(p.x*p.x+p.z*p.z), p.y);
	vec2 v  = vec2(c.z*c.y/c.x, -c.z);
	vec2 w  = vec2(c.z*c.y/c.x-sqrt(p.x*p.x+p.z*p.z), -c.z-p.y);
	vec2 vv = vec2(dot(v,v), v.x*v.x);
	vec2 qv = vec2(dot(v,w), v.x*w.x);
	vec2 d  = max(qv,0.0)*qv/vv;
	return sqrt(dot(w,w) - max(d.x,d.y)) * sign(max(q.y*v.x-q.x*v.y,w.y));
}

/*数式を変形したもの*/
float sdPlayMathCappedCone(in vec3 p)
{
	vec3 c = vec3(1.0, 1.0, 1.0);
	vec2 q  = vec2(sqrt(p.x*p.x+p.z*p.z), p.y);
// 	vec2 q  = vec2(sqrt(p.x*p.x+(p.z*p.z)*cos(time)), p.y);
// 	vec2 q  = vec2(sqrt(p.x*p.x*cos(time)+(p.z*p.z)), p.y);
// 	vec2 q  = vec2(sqrt(p.x*p.x+p.y*p.y*cos(time)+(p.z*p.z)), p.y);
// 	vec2 q  = vec2(sqrt(p.x*p.x+p.z*p.z), p.y*p.y*cos(time));	

	vec2 v  = vec2(c.z*c.y/c.x, -c.z);
// 	vec2 v  = vec2(c.z*c.y/c.x, -c.z+(c.z*c.y/c.x)*cos(time));

	vec2 w  = vec2(c.z*c.y/c.x-sqrt(p.x*p.x+p.z*p.z), -c.z-p.y);
// 	vec2 w  = vec2(c.z*c.y/c.x-sqrt(p.x*p.x+p.y*p.y*cos(time)+p.z*p.z), -c.z-p.y);
	
	vec2 vv = vec2(dot(v,v), v.x*v.x);
	vec2 qv = vec2(dot(v,w), v.x*w.x);
	vec2 d  = max(qv,0.0)*qv/vv;
	return sqrt(dot(w,w) - max(d.x,d.y)) * sign(max(q.y*v.x-q.x*v.y,w.y));
}


float sdPlayCappedCone(in vec3 p)
{
	vec3 c = vec3(1.0, 1.0, 1.0);
	// p = mat3(cos(time),0,-sin(time), 0,1,0, sin(time),0,cos(time))*p;
	// p = mat3(1,0,0, 0,cos(time),-sin(time), 0,sin(time),cos(time))*p;

	vec2 q  = vec2(length(p.xz), p.y);
	// vec2 q  = vec2(length(p.xz), p.y)*cos(time);
	// vec2 q  = vec2(length(p.xz)*cos(time), p.y);
	// vec2 q  = vec2(length(p.xz), p.y*cos(time));

	vec2 v  = vec2(c.z*c.y/c.x, -c.z);
	// vec2 v  = vec2(c.z*c.y/c.x, -c.z)*cos(time);
	// vec2 v  = vec2(c.z*c.y/c.x*cos(time), -c.z);
	// vec2 v  = vec2(c.z*c.y/c.x, -c.z*cos(time));


	vec2 w  = v - q;
	// vec2 w  = (v - q)*cos(time);

	vec2 vv = vec2(dot(v,v), v.x*v.x);
	// vec2 vv = vec2(dot(v,v), v.x*v.x)*cos(time);
	// vec2 vv = vec2(dot(v,v)*cos(time), v.x*v.x);
	// vec2 vv = vec2(dot(v,v), v.x*v.x*cos(time));

	vec2 qv = vec2(dot(v,w), v.x*w.x);
	// vec2 qv = vec2(dot(v,w), v.x*w.x)*cos(time);
	// vec2 qv = vec2(dot(v,w)*cos(time), v.x*w.x);
	// vec2 qv = vec2(dot(v,w), v.x*w.x*cos(time));

	vec2 d  = max(qv,0.0)*qv/vv;
	// vec2 d  = max(qv,0.0)*qv/vv*cos(time);
	// vec2 d  = max(qv*cos(time),0.0)*qv/vv;
	// vec2 d  = max(qv,sin(time))*qv/vv;

	return sqrt(dot(w,w) - max(d.x,d.y)) * sign(max(q.y*v.x-q.x*v.y,w.y));
	// return -sqrt(dot(w,w) - max(d.x,d.y));
	// return sqrt(dot(w,w) - max(d.x,d.y)*sin(time)) * sign(max(q.y*v.x-q.x*v.y,w.y));
	// return sqrt(dot(w,w) - max(d.x,d.y));
	// return sqrt(dot(w,w) - max(d.x,d.y))*cos(time);
	// return sqrt(dot(w,w) - max(d.x,d.y)) * sign(max(q.y*v.x-q.x*v.y,w.y)*cos(time));
}

// 割と面白いアニメーション
float sdAnimePlayCappedCone(in vec3 p)
{
	vec3 c = vec3(1.0, 1.0, 1.0);
	vec2 q  = vec2(length(p.xz), p.y);
	vec2 v  = vec2(c.z*c.y/c.x, -c.z);
	vec2 w  = v - q;
	vec2 vv = vec2(dot(v,v), v.x*v.x);
	vec2 qv = vec2(dot(v,w), v.x*w.x);
	vec2 d  = max(qv,sin(time))*qv/vv;
	return sqrt(dot(w,w) - max(d.x,d.y))*cos(time);
}

float distanceHub(vec3 p){
    return sdCappedCone(p);
// 	return sdMathCappedCone(p);
// 	return sdPlayMathCappedCone(p);
// 	return sdPlayCappedCone(p);
	// return sdAnimePlayCappedCone(p);
}

// 法線
vec3 genNormal(vec3 p){
	float d = 0.001;
	// 法線を生成
	return normalize(vec3(
		distanceHub(p + vec3(	d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
		distanceHub(p + vec3(0.0,	 d, 0.0)) - distanceHub(p + vec3(0.0,	-d, 0.0)),
		distanceHub(p + vec3(0.0, 0.0,	 d)) - distanceHub(p + vec3(0.0, 0.0,	-d))
	));
}

// 図形ごとに色をわける
vec3 doColor(vec3 p){
	float e = 0.001;
	if (sdCappedCone(p)<e){
		vec3 normal	= genNormal(p);
		vec3 light	 = normalize(vec3(1.0, 1.0, 1.0));
		float diff	 = max(dot(normal, light), 0.1);
		return vec3(diff, diff, diff);
	}
// 	if (sdMathCappedCone(p)<e){
// 		vec3 normal	= genNormal(p);
// 		vec3 light	 = normalize(vec3(1.0, 1.0, 1.0));
// 		float diff	 = max(dot(normal, light), 0.1);
// 		return vec3(0.0, diff, diff);
// 	}
//     if (sdPlayMathCappedCone(p)<e){
// 		vec3 normal	= genNormal(p);
// 		vec3 light	 = normalize(vec3(1.0, 1.0, 1.0));
// 		float diff	 = max(dot(normal, light), 0.1);
// 		return vec3(0.0, diff, diff);
// 	}
// 	if (sdPlayCappedCone(p)<e){
// 		vec3 normal	= genNormal(p);
// 		vec3 light	 = normalize(vec3(1.0, 1.0, 1.0));
// 		float diff	 = max(dot(normal, light), 0.1);
// 		return vec3(0.0, diff, diff);
// 	}
// 	if (sdAnimePlayCappedCone(p)<e){
// 		vec3 normal	= genNormal(p);
// 		vec3 light	 = normalize(vec3(1.0, 1.0, 1.0));
// 		float diff	 = max(dot(normal, light), 0.1);
// 		return vec3(diff, diff, diff);
// 	}
	return vec3(0.0);
}

// カメラのワーク
void main(){
	// スクリーンスペースを考慮して座標を正規化
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	// カメラを定義
	vec3 cPos  = vec3(0.0,	0.0,	3.0);   // カメラの位置
	vec3 cDir  = vec3(0.0,	0.0, -1.0);     // カメラの向き(視線)
	vec3 cUp   = vec3(0.0,	1.0,	0.0);   // カメラの上方向
	vec3 cSide = cross(cDir, cUp);          // 外積を使って横方向を算出
	float targetDepth = 1.0;                // フォーカスする深度

	// カメラの情報からレイを定義
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
	// マーチングループを組む
	float dist = 0.0;	// レイとオブジェクト間の最短距離
	float rLen = 0.0;	// レイに継ぎ足す長さ
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
