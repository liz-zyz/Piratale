/*:
 * @plugindesc マップタグ <keepcamera:x,y> カメラ固定（完全版）
 * @author F4is
 */

(function() {

    // ---------------------------------------------------------
    // マップセットアップ：初期化のみ（note はここで読まない）
    // ---------------------------------------------------------
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        this._keepCamera = null;
    };

    // ---------------------------------------------------------
    // マップ読み込み完了後に note を読む（ここなら確実に現在のマップ）
    // ---------------------------------------------------------
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);

        const note = $dataMap.note || "";
        const tag = note.match(/<keepcamera\s*:\s*(\d+)\s*,\s*(\d+)\s*>/i);

        if (tag) {
            $gameMap._keepCamera = {
                x: Number(tag[1]),
                y: Number(tag[2])
            };
        }
    };

    // ---------------------------------------------------------
    // カメラ固定処理（あなたの元コードをそのまま使用）
    // ---------------------------------------------------------
    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.call(this, sceneActive);

        if (this._keepCamera) {
            const dx = this._keepCamera.x - Graphics.width / this.tileWidth() / 2;
            const dy = this._keepCamera.y - Graphics.height / this.tileHeight() / 2;

            this._displayX = Math.max(0, Math.min(dx, this.width() - this.screenTileX()));
            this._displayY = Math.max(0, Math.min(dy, this.height() - this.screenTileY()));

            this._scrollX = this._scrollY = 0;
        }
    };

    // ---------------------------------------------------------
    // ★ 微動の原因：scrollDown/Up/Left/Right を MV が後から呼ぶ
    //   → タグがある時だけ完全停止させる
    // ---------------------------------------------------------
    const _scrollDown = Game_Map.prototype.scrollDown;
    Game_Map.prototype.scrollDown = function(distance) {
        if (this._keepCamera) return;
        _scrollDown.call(this, distance);
    };

    const _scrollUp = Game_Map.prototype.scrollUp;
    Game_Map.prototype.scrollUp = function(distance) {
        if (this._keepCamera) return;
        _scrollUp.call(this, distance);
    };

    const _scrollLeft = Game_Map.prototype.scrollLeft;
    Game_Map.prototype.scrollLeft = function(distance) {
        if (this._keepCamera) return;
        _scrollLeft.call(this, distance);
    };

    const _scrollRight = Game_Map.prototype.scrollRight;
    Game_Map.prototype.scrollRight = function(distance) {
        if (this._keepCamera) return;
        _scrollRight.call(this, distance);
    };

})();
