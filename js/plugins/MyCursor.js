/*:
 * @plugindesc マウスカーソルをカスタム画像に変更し、中央に配置するプラグイン
 * @author ChatGPT
 *
 * @param CursorImage
 * @text カーソル画像
 * @desc img/system/ に配置するカーソル画像のファイル名（拡張子なし）
 * @default mousecorB
 *
 * @help
 * 【使用方法】
 * 1. img/system/ にカーソル用の画像（例: mousecorB.png）を用意する。
 * 2. プラグインパラメータ「カーソル画像」にファイル名を設定する（拡張子なし）。
 * 3. プラグインを有効化すれば、自動でカーソルが変更される。
 */

(function() {
    var parameters = PluginManager.parameters('CustomCursor');
    var cursorImageName = parameters['CursorImage'] || 'mousecorB';

    var cursorImage = new Image();
    cursorImage.src = 'img/system/' + cursorImageName + '.png';

    cursorImage.onload = function() {
        var cursorWidth = cursorImage.width;
        var cursorHeight = cursorImage.height;

        // カーソルの中央を基準にするためのCSS
        var cursorStyle = `url("img/system/${cursorImageName}.png") ${cursorWidth / 2} ${cursorHeight / 2}, auto`;
        
        function applyCursor() {
            document.body.style.cursor = cursorStyle;
        }
        
        // 初期適用
        applyCursor();

        // クリック時にカーソルを再適用
        document.addEventListener('click', applyCursor);
        document.addEventListener('mousedown', applyCursor);

        // マウスがウィンドウ内に戻ったらカーソルを再適用
        document.addEventListener('mouseenter', applyCursor);
        document.addEventListener('focus', applyCursor);

        // マウスを動かしたときにカーソルを適用（より確実に）
        document.addEventListener('mousemove', applyCursor);

        // ウィンドウの外に出たとき、一度カーソルをデフォルトに戻す
        document.addEventListener('mouseleave', function() {
            document.body.style.cursor = 'default';
        });

        // 定期的にカーソルをチェックし、適用し直す（安全対策）
        setInterval(applyCursor, 1000);
    };

    cursorImage.onerror = function() {
        console.error('カーソル画像が見つかりません: ' + cursorImage.src);
    };
})();
