/*:
 * @plugindesc デフォルト画面の初期ズーム倍率を変更し、マップごとにメモ欄で上書きできるプラグイン
 *
 * @param Default Zoom
 * @text 初期ズーム倍率
 * @desc ゲーム開始時・マップ読み込み時に適用するズーム倍率（例：1.0〜5.0）
 * @default 2.0
 *
 * @param Zoom Duration
 * @text ズーム適用時間
 * @desc ズームを適用するフレーム数（0で即時）
 * @default 30
 * @help
 * ■ マップメモ欄タグ
 * マップごとにズーム倍率を変更したい場合、マップのメモ欄に以下を記述します。
 *
 *   <Zoom: 数値>
 *
 * 例：
 *   <Zoom: 1.5>   // ズーム倍率 1.5
 *   <Zoom: 3.0>   // ズーム倍率 3.0
 *
 * メモ欄にタグがない場合は「初期ズーム倍率」の設定値が使われます。
 *
 */

(function() {
    var parameters = PluginManager.parameters('DefaultZoom');
    var defaultZoom = Number(parameters['Default Zoom'] || 2.0);
    var zoomDuration = Number(parameters['Zoom Duration'] || 30);

    // マップ開始時にズームを適用
    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        applyMapZoom();
    };

    // マップ遷移時にもズームを適用
    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        applyMapZoom();
    };

    function applyMapZoom() {
        var player = $gamePlayer;
        if (!player) return;

        var map = $dataMap;
        var zoom = defaultZoom;

        // メモ欄に <Zoom: 数値> があれば優先
        if (map && map.meta && map.meta.Zoom) {
            zoom = Number(map.meta.Zoom);
        }

        var x = player.screenX();
        var y = player.screenY();

        $gameScreen.setZoom(x, y, zoom, zoomDuration);
    }
})();
