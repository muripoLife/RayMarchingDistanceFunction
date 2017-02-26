
(function(){
    'use strict';
    var gl, canvasElement, canvasWidth, canvasHeight;
    var startTime, front, back, flip, active;
    var mousePosition = [0.0, 0.0];

    // glcubic の初期化
    canvasElement = document.getElementById('canvas');
    gl3.initGL(canvasElement);
    if(!gl3.ready){console.log('initialize error'); return;}

    // 扱いやすいように gl に WebGL Context オブジェクトを代入しておく
    gl = gl3.gl;

    // canvas のサイズをフレーム内の最大幅(512px)に設定
    canvasWidth  = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvasElement.width  = canvasWidth;
    canvasElement.height = canvasHeight;

    // マウスカーソルの座標を -1.0 ~ 1.0 に正規化する関数の登録
    canvasElement.addEventListener('mousemove', function(eve){
        var x = eve.clientX / canvasWidth * 2.0 - 1.0;
        var y = 1.0 - eve.clientY / canvasHeight * 2.0;
        mousePosition = [x, y];
    }, false);

    // 初期化関数の呼び出し
    init();

    function init(){
        // 板ポリでフレームバッファの内容を表に出すだけのシェーダ
        var prg = gl3.program.create_from_source(
            WE.vs,
            WE.fs,
            ['position'],
            [3],
            ['texture'],
            ['1i']
        );
        if(!prg){return;}

        // フレームバッファに描き込むためのシーン用シェーダ
        var pPrg = gl3.program.create_from_source(
            WE.vsp,
            WE.fsp,
            ['position'],
            [3],
            ['resolution', 'mouse', 'time', 'prevScene'],
            ['2fv', '2fv', '1f', '1i']
        );
        if(!pPrg){return;}

        // 頂点データ格納用の配列を定義
        var position = [
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        // 頂点バッファのセットを生成
        var VBO = [gl3.create_vbo(position)];

        // フレームバッファの生成とテクスチャのバインド
        gl.activeTexture(gl.TEXTURE0);
        front = gl3.create_framebuffer(canvasWidth, canvasHeight, 0);
        gl.bindTexture(gl.TEXTURE_2D, gl3.textures[0].texture);
        gl.activeTexture(gl.TEXTURE1);
        back = gl3.create_framebuffer(canvasWidth, canvasHeight, 1);
        gl.bindTexture(gl.TEXTURE_2D, gl3.textures[1].texture);
        active = 0;

        // レンダリング許可フラグを立ててレンダリング開始
        WE.run = true;
        startTime = Date.now();
        render();

        // レンダリング関数
        function render(){
            // 現在の経過時間を格納する変数
            var nowTime = (Date.now() - startTime) / 1000;

            // まずはバックバッファにシーンを描画する
            gl.bindFramebuffer(gl.FRAMEBUFFER, back.framebuffer);
            pPrg.set_program();
            pPrg.set_attribute(VBO, null);
            gl3.scene_clear([0.0, 0.0, 0.0, 1.0]);
            gl3.scene_view(null, 0, 0, canvasWidth, canvasHeight);

            // 必要な情報をシェーダに送り描画する
            pPrg.push_shader([[canvasWidth, canvasHeight], mousePosition, nowTime, active]);
            gl3.draw_arrays(gl.TRIANGLE_STRIP, 4);

            // 続いてバックバッファの内容を表に描画する
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            prg.set_program();
            prg.set_attribute(VBO, null);
            gl3.scene_clear([0.0, 0.0, 0.0, 1.0]);
            gl3.scene_view(null, 0, 0, canvasWidth, canvasHeight);

            // 転写するテクスチャのユニット番号をフリップしてから送る
            active = active === 0 ? 1 : 0;
            prg.push_shader([active]);

            // 描画命令を発行して三角形で描画
            gl3.draw_arrays(gl.TRIANGLE_STRIP, 4);

            // フレームバッファをフリップする
            flip = front;
            front = back;
            back = flip;

            // フラグをチェックして再帰
            if(WE.run){requestAnimationFrame(render);}
        }
    }
})();

