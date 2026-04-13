(function() {
    // ステートID18のアイコンを右下に表示・非表示する
    const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        _Scene_Map_createSpriteset.call(this);
        this._stateIconSprite = new Sprite();
        this._stateIconSprite.bitmap = new Bitmap(Window_Base._iconWidth, Window_Base._iconHeight);
        this.addChild(this._stateIconSprite);
        this.updateStateIcon(); // 初回チェック
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateStateIcon();
    };

    // ステート変更をリアルタイムで監視
    const _Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        _Game_Battler_addState.call(this, stateId);
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.updateStateIcon();
        }
    };

    const _Game_Battler_eraseState = Game_Battler.prototype.eraseState;
    Game_Battler.prototype.eraseState = function(stateId) {
        _Game_Battler_eraseState.call(this, stateId);
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.updateStateIcon();
        }
    };

    // ステートID18のアイコンのみを右下に表示
    Scene_Map.prototype.updateStateIcon = function() {
        const hasState18 = $gameParty.members().some(actor => actor.isStateAffected(18));
        
        if (hasState18) {
            const iconIndex = $dataStates[18].iconIndex;
            const pw = Window_Base._iconWidth;
            const ph = Window_Base._iconHeight;
            const sx = (iconIndex % 16) * pw;
            const sy = Math.floor(iconIndex / 16) * ph;
            
            this._stateIconSprite.bitmap.clear();
            this._stateIconSprite.bitmap.blt(ImageManager.loadSystem("IconSet"), sx, sy, pw, ph, 0, 0);
            
            this._stateIconSprite.x = Graphics.width - pw - 10;
            this._stateIconSprite.y = Graphics.height - ph - 10;
            this._stateIconSprite.visible = true;
        } else {
            this._stateIconSprite.visible = false;
        }
    };
})();
