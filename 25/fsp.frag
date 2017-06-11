// ============================================================================
// terrain formula
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

void main( void ) {
	// スクリーンスペースを考慮して座標を正規化
	vec2 scene = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	/* カメラを定義 */
	// カメラの位置
	vec3 cPos         = vec3(1.0, 3.0,0.0);
	// カメラの向き(視線)
	vec3 cDir         = vec3(0.0,  0.0, -1.0);
	// カメラの上方向
	vec3 cUp          = vec3(0.0,  1.0,  0.0);
	// 外積を使って横方向を算出
	vec3 cSide        = cross(cDir, cUp);
	// フォーカスする深度
	float targetDepth = 1.0;
	// カメラの情報からレイを定義
	vec3 ray = normalize(cSide * scene.x + cUp * scene.y + cDir * targetDepth);

	/* マーチングループを組む */
	// レイとオブジェクト間の最短距離
	// float dist = 0.0;
	// レイの先端位置(初期位置)
	vec3 rPos = cPos;

	vec3 f1, f2;
	// レイが進む処理(マーチングループ)
	for( float loop_num=.0; loop_num<16.; loop_num+=.05 ) {
		// 地形の式を書く.
		f1 = fract(cPos += ray*loop_num*.1);
		f2 = floor(cPos);
		
		if( cos(f2.z) + sin(f2.x) > ++f2.y ) {
			if(f1.y-.04*cos((cPos.x+cPos.z)*10.)>.7){
				ray = cUp;
			}else{
				ray = f1.x*cUp.yxz;
			}
			break;
		}
	}
	// レイとオブジェクトの距離を確認
	gl_FragColor = vec4(ray,1.0);
}