// ============================================================================
// Capped Cone
// ============================================================================

precision mediump float;
uniform vec2 resolution; // resolution (512.0, 512.0)
uniform vec2 mouse;      // mouse(-1.0 ~ 1.0)
uniform float time;      // time(1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

/* Capped Cone距離関数 */
float sdCappedCylinder(vec3 p)
{
	p += vec3(-0.5, 0.0, 0.0);
	vec2 h = vec2(0.3, 1.0);
	// vec2 h = vec2(【半径】, 【高さ】);
	vec2 d = abs(vec2(length(p.xz),p.y)) - h;
//	 return min(max(d.x,d.y),0.0) + length(max(d,0.0));
	return clamp(d.x,d.y,0.0) + length(max(d,0.0));
	/* clamp(d.x,d.y,0.0)ボリュームの調整 */
}

/* Capped Cone距離関数(数式) */
float sdMathCappedCylinder(vec3 p)
{
	p += vec3(0.5, 0.0, 0.0);
	float r = 0.3;
	float h = 1.0;
	return clamp(sqrt(p.x*p.x+p.z*p.z)-r, abs(p.y)-h,0.0)+ sqrt(max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)*max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)+max(abs(p.y)-h, 0.0)*max(abs(p.y)-h, 0.0));
}

/* Capped Coneで遊ぶ */
float playCappedCylinder(vec3 p)
{
		// p = mat3(cos(time),-sin(time),0, sin(time), cos(time),0 ,0,0,1)*p;
		// p = mat3(cos(time),0,-sin(time), 0,1,0, sin(time),0,cos(time))*p;
		p = mat3(1,0,0, 0,cos(time),-sin(time), 0,sin(time),cos(time))*p;
//	 p += vec3(0.5, 0.0, 0.0);
	float r = 0.3;
	float h = 1.0;
	// 元の式
//	 return clamp(sqrt(p.x*p.x+p.z*p.z)-r, abs(p.y)-h,0.0)+ sqrt(max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)*max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)+max(abs(p.y)-h, 0.0)*max(abs(p.y)-h, 0.0));
	// 遊んだ式
//	 return clamp(sqrt(p.x*p.x+p.y*p.y+p.z*p.z)-r, abs(p.y)-h,0.0)+ sqrt(max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)*max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)+max(abs(p.y)-h, 0.0)*max(abs(p.y)-h, 0.0));
//	 return clamp(sqrt(p.x*p.x+p.y*p.y+sin(p.z*p.z+time))-r, abs(p.y)-h,0.0)+ sqrt(max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)*max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)+max(abs(p.y)-h, 0.0)*max(abs(p.y)-h, 0.0));
//	 return clamp(sqrt(p.x*p.x+p.y*p.y+p.z*p.z)-r, abs(p.y*sin(time))-h,0.0)+ sqrt(max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)*max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)+max(abs(p.y)-h, 0.0)*max(abs(p.y)-h, 0.0));

		/*ボリュームの調整*/
	return -abs(sin(clamp(sqrt(p.x*p.x+p.z*p.z)-r, abs(p.y)-h,0.0)+time))+ sqrt(max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)*max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)+max(abs(p.y)-h, 0.0)*max(abs(p.y)-h, 0.0));
		/*出現*/
//	 return clamp(sqrt(p.x*p.x+p.z*p.z)-r, abs(p.y)-h,0.0) + sqrt(max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)*max(sqrt(p.x*p.x+p.z*p.z)-r, 0.0)+max(abs(p.y)-h, 0.0)*max(abs(p.y)-h, 0.0))*abs(sin(time));


}

float distanceHub(vec3 p){
		// 二つの図形の描く距離関数を書く
		return min(sdCappedCylinder(p), sdMathCappedCylinder(p));
		// return playCappedCylinder(p);
		// return sdTabaco(p);
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
		if (sdCappedCylinder(p)<e){
				vec3 normal	= genNormal(p);
				vec3 light	 = normalize(vec3(1.0, 1.0, 1.0));
				float diff	 = max(dot(normal, light), 0.1);
				return vec3(0.0, diff, diff);
		}
		if (sdMathCappedCylinder(p)<e){
				vec3 normal	= genNormal(p);
				vec3 light	 = normalize(vec3(1.0, 1.0, 1.0));
				float diff	 = max(dot(normal, light), 0.1);
				return vec3(diff*abs(cos(time)), diff*abs(sin(time)), diff);
		}
		if (playCappedCylinder(p)<e){
				vec3 normal	= genNormal(p);
				vec3 light	 = normalize(vec3(1.0, 1.0, 1.0));
				float diff	 = max(dot(normal, light), 0.1);
				return vec3(diff, diff, diff);
		}
		return vec3(0.0);
}

// カメラのワーク
void main(){
		// スクリーンスペースを考慮して座標を正規化
		vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
		// カメラを定義
		vec3 cPos				 = vec3(0.0,	0.0,	3.0); // カメラの位置
		vec3 cDir				 = vec3(0.0,	0.0, -1.0); // カメラの向き(視線)
		vec3 cUp					= vec3(0.0,	1.0,	0.0); // カメラの上方向
		vec3 cSide				= cross(cDir, cUp);			// 外積を使って横方向を算出
		float targetDepth = 1.0;									 // フォーカスする深度

		// カメラの情報からレイを定義
		vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
		// マーチングループを組む
		float dist = 0.0;	// レイとオブジェクト間の最短距離
		float rLen = 0.0;	// レイに継ぎ足す長さ
		vec3	rPos = cPos; // レイの先端位置(初期位置)

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
