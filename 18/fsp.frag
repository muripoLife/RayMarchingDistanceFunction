// ============================================================================
// Ellipsoid
// ============================================================================

precision mediump float;
uniform vec2 resolution;	 // resolution (512.0, 512.0)
uniform vec2 mouse;		  // mouse(-1.0 ~ 1.0)
uniform float time;		  // time(1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

float sdEllipsoid(in vec3 p, in vec3 r)
{
	return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float sdMathEllipsoid(in vec3 p, in vec3 r)
{
	return (sqrt(p.x/r.x*p.x/r.x+p.y/r.y*p.y/r.y+p.z/r.z*p.z/r.z) - 1.0) * min(min(r.x,r.y),r.z);
}

float sdStretchMathEllipsoid(in vec3 p, in vec3 r)
{
	return (sqrt(p.x/r.x*p.x/r.x+p.y/r.y*p.y/r.y+p.z/r.z*p.z/r.z) - 1.0) * ((max(max(r.x,r.y),r.z)-min(min(r.x,r.y),r.z))*abs(sin(time))+min(min(r.x,r.y),r.z));
}

// Torusの距離関数
float dTorus(vec3 p){
	float r = 0.3;
	float R = 3.0;
	vec3  s = vec3(0.2, 0.45, 0.6);
	return sqrt(p.x/s.x*p.x/s.x+p.y/s.y*p.y/s.y+p.z/s.z*p.z/s.z+R*R - 2.0 * R * sqrt(p.x/s.x*p.x/s.x+p.y/s.y*p.y/s.y))* min(min(s.x,s.y),s.z)- r;
}


float sdPlay(in vec3 p, in vec3 r)
{
	/*双曲線*/
	// return (sqrt(-p.x/r.x*p.x/r.x+p.y/r.y*p.y/r.y+p.z/r.z*p.z/r.z) - 1.0) * min(min(r.x,r.y),r.z);
	// return (sqrt(p.x/r.x*p.x/r.x-p.y/r.y*p.y/r.y+p.z/r.z*p.z/r.z) - 1.0) * min(min(r.x,r.y),r.z);
	// return (sqrt(p.x/r.x*p.x/r.x+p.y/r.y*p.y/r.y-p.z/r.z*p.z/r.z) - 1.0) * min(min(r.x,r.y),r.z);
	/*アニメ1*/
	// return (sqrt(p.x/r.x*p.x/r.x+p.y/r.y*p.y/r.y*sin(time)+p.z/r.z*p.z/r.z) - 1.0) * min(min(r.x,r.y),r.z);
	// return sdEllipsoid(p, vec3(0.1+0.9*cos(time)*cos(time*2.0),0.1+0.9*cos(time)*sin(time*2.0),0.1+0.9*sin(time)));
	return (sqrt(p.x/r.x*p.x/r.x+p.y/r.y*p.y/r.y+p.z/r.z*p.z/r.z) - 1.0) * sin(time);
}


float sdInstanceEllipsoid(in vec3 p)
{
	// p = mat3(1.0,0,0, 0,cos(1.57),-sin(1.57), 0,sin(1.57),cos(1.57) )*p;
	p = mat3(1.0,0,0, 0,cos(time),-sin(time), 0,sin(time),cos(time) )*p;
 	// p = mat3(cos(time),0,-sin(time), 0,1,0, sin(time),0,cos(time))*p;
	p = mat3(cos(time),-sin(time),0, sin(time), cos(time),0 ,0,0,1)*p;
	// return sdEllipsoid(p, vec3(0.3, 0.45, 0.6));
	// return sdPlay(p, vec3(0.3, 0.45, 0.6));
	// return sdEllipsoid(p, vec3(0.1+0.9*cos(time)*cos(time*2.0),0.1+0.9*cos(time)*sin(time*2.0),0.1+0.9*sin(time)));
	return dTorus(p);
}

float distanceHub(vec3 p){
	return sdInstanceEllipsoid(p);
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
	if (sdInstanceEllipsoid(p)<e){
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
