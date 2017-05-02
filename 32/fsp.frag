precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform sampler2D prevScene;

// characuter関数
float line(vec2 p, vec2 s, vec2 e)
{
	float scale     = 0.075;
	float border    = 0.05;
	float lineWidth = 0.02;
	s *= scale;
	e *= scale;
	float l = length(s-e);
	vec2 d  = vec2(e-s)/l;
	p -= vec2(s.x,-s.y);
	p  = vec2(p.x*d.x+p.y*-d.y,p.x*d.y+p.y*d.x);
	return length(max(abs(p-vec2(l/2.0,0))-vec2(l/2.0,lineWidth/2.0),0.0))-border;
}

// Alphabet distance function
float A(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));return d;}
float B(vec2 p){float d=1.0;d=min(d,line(p,vec2(4,5),vec2(4,1.5)));d=min(d,line(p,vec2(4,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));return d;}
float C(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}
float D(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(4,8)));d=min(d,line(p,vec2(4,8),vec2(4.5,7.5)));d=min(d,line(p,vec2(4.5,7.5),vec2(5,6.25)));d=min(d,line(p,vec2(5,6.25),vec2(5,3.75)));d=min(d,line(p,vec2(5,3.75),vec2(4.5,2)));d=min(d,line(p,vec2(4.5,2),vec2(4,1.5)));d=min(d,line(p,vec2(4,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));return d;}
float E(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}
float F(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(1,8)));return d;}
float G(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,2.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(3.5,5)));return d;}
float H(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,8)));return d;}
float I(vec2 p){float d=1.0;d=min(d,line(p,vec2(1.5,1.5),vec2(4.5,1.5)));d=min(d,line(p,vec2(4.5,1.5),vec2(3,1.5)));d=min(d,line(p,vec2(3,1.5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(1.5,8)));d=min(d,line(p,vec2(1.5,8),vec2(4.5,8)));return d;}
float J(vec2 p){float d=1.0;d=min(d,line(p,vec2(1.5,8),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(4,7)));d=min(d,line(p,vec2(4,7),vec2(4,1.5)));d=min(d,line(p,vec2(4,1.5),vec2(1.5,1.5)));return d;}
float K(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(2.5,5)));d=min(d,line(p,vec2(2.5,5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(2.5,5)));d=min(d,line(p,vec2(2.5,5),vec2(5,8)));return d;}
float L(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}
float M(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(3,4)));d=min(d,line(p,vec2(3,4),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,8)));return d;}
float N(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}
float O(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}
float P(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));return d;}
float Q(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,8),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(3.5,6.5)));return d;}
float R(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(3.5,5)));d=min(d,line(p,vec2(3.5,5),vec2(5,8)));return d;}
float S(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float T(vec2 p){float d=1.0;d=min(d,line(p,vec2(3,8),vec2(3,1.5)));d=min(d,line(p,vec2(3,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));return d;}
float U(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}
float V(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(5,1.5)));return d;}
float W(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(3,6)));d=min(d,line(p,vec2(3,6),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}
float X(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(3,4.75)));d=min(d,line(p,vec2(3,4.75),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(1,8)));return d;}
float Y(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(5,1.5)));return d;}
float Z(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1.5,5)));d=min(d,line(p,vec2(1.5,5),vec2(4.5,5)));d=min(d,line(p,vec2(4.5,5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}

float one(vec2 p){float d=1.0;d=min(d,line(p,vec2(2.0,2.0),vec2(3.0,1.5)));d=min(d,line(p,vec2(3,1.5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(1.5,8)));d=min(d,line(p,vec2(1.5,8),vec2(4.5,8)));return d;}
float two(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(1,4.5),vec2(5,4.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,3.5)));d=min(d,line(p,vec2(1,5.5),vec2(1,7.5)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}
float three(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(1,4.5),vec2(5,4.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,3.5)));d=min(d,line(p,vec2(5,5.5),vec2(5,7.5)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}
float four(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,4.5),vec2(5,4.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,3.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,3.5)));d=min(d,line(p,vec2(5,5.5),vec2(5,7.5)));return d;}
float five(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float six(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(1,5),vec2(1,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float seven(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));return d;}
float eight(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(1,5),vec2(1,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float nine(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}
float zero(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(1,5),vec2(1,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}

float plus(vec2 p){float d=1.0;d=min(d,line(p,vec2(0,5),vec2(4,5)));d=min(d,line(p,vec2(2,3),vec2(2,7)));return d;}
float minus(vec2 p){float d=1.0;d=min(d,line(p,vec2(0.0,5.0),vec2(7.0,5.0)));return d;}
float product(vec2 p){float d=1.0;d=min(d,line(p,vec2(4.0,5.0),vec2(4.5,5.0)));return d;}
float devided(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(2,8)));return d;}
float equals(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,3),vec2(5,3)));d=min(d,line(p,vec2(1,6),vec2(5,6)));return d;}

float distanceCharacter(vec3 p)
{
	float d = 1e3;
	float letters  = 1e10;
	vec3 boundingSize = vec3(30,12,0.8);
	p += vec3(0.2, -1.0, 0.0);

	// p = mat3(1.0,0,0, 0,cos(time),-sin(time), 0,sin(time),cos(time) )*p;
	p = mat3(cos(time),0,-sin(time), 0,1,0, sin(time),0,cos(time))*p;
	// p = mat3(cos(time),-sin(time),0, sin(time), cos(time),0 ,0,0,1)*p;

	// alphabet 追加
	// p -= vec3(1.5*sin(time), 0.0, 0.0);

	letters = min(letters, X(vec2(p.x+2.0, p.y-1.0)));
	letters = min(letters, minus(vec2(p.x+1.0, p.y-1.0)));
	letters = min(letters, Y(vec2(p.x, p.y-1.0)));
	letters = min(letters, equals(vec2(p.x-1.0, p.y-1.0)));
	letters = min(letters, one(vec2(p.x-2.0, p.y-1.0)));

	letters = min(letters, one(vec2(p.x+2.0, p.y)));
	letters = min(letters, two(vec2(p.x+1.0, p.y)));
	letters = min(letters, three(vec2(p.x, p.y)));
	letters = min(letters, four(vec2(p.x-1.0, p.y)));
	letters = min(letters, five(vec2(p.x-2.0, p.y)));

	letters = min(letters, six(vec2(p.x+2.0, p.y+1.0)));
	letters = min(letters, seven(vec2(p.x+1.0, p.y+1.0)));
	letters = min(letters, eight(vec2(p.x, p.y+1.0)));
	letters = min(letters, nine(vec2(p.x-1.0, p.y+1.0)));
	letters = min(letters, zero(vec2(p.x-2.0, p.y+1.0)));

	float bounding = length(max(abs(p)-boundingSize,0.0));
	letters = max(bounding, letters);
	d = min(d, letters);
	return d;
}

// 距離関数を呼び出すハブ関数
float distanceHub(vec3 p)
{
	return distanceCharacter(p);
}

// 法線を生成する
vec3 genNormal(vec3 p)
{
	float d = 0.001;
	return normalize(vec3(
		distanceHub(p + vec3(d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
		distanceHub(p + vec3(0.0, d, 0.0)) - distanceHub(p + vec3(0.0,-d, 0.0)),
		distanceHub(p + vec3(0.0, 0.0, d)) - distanceHub(p + vec3(0.0, 0.0,-d))
	));
}

// 図形ごとに色をわける
vec3 doColor(vec3 p){
	float e = 0.001;
	if (distanceCharacter(p)<e){
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