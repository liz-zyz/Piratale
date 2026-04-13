

(function() {
    // ★ 1. ImageManager.loadCharacter をキャッシュ化（Bitmap再生成防止）
    const _ImageManager_loadCharacter = ImageManager.loadCharacter;
    const _textureCache = {};

    ImageManager.loadCharacter = function(filename, hue) {
        const key = `${filename}_${hue || 0}`;
        if (_textureCache[key]) {
            return _textureCache[key];
        }

        const bitmap = _ImageManager_loadCharacter.call(this, filename, hue);
        _textureCache[key] = bitmap;
        return bitmap;
    };

    // ★ 2. Sprite_Character.updateBitmap を最適化（無駄なBitmap再設定を防止）
    Sprite_Character.prototype.updateBitmap = function() {
        const characterName = this._character.characterName();
        const characterIndex = this._character.characterIndex();

        // 名前かインデックスが変わったときだけ再設定
        if (this._characterName !== characterName || this._characterIndex !== characterIndex) {
            // すでにBitmapが設定されていて、名前が同じなら何もしない
            if (this.bitmap && this._characterName === characterName) return;

            this._characterName = characterName;
            this._characterIndex = characterIndex;
            this.setCharacterBitmap();
        }
    };
})();
