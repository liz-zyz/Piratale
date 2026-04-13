(function() {
    var _equipAndStatus2Sprite;

    // 背景画像を表示
    window.showEquipAndStatus2 = function() {
        if (!_equipAndStatus2Sprite) {
            // 背景画像の設定
            _equipAndStatus2Sprite = new Sprite();
            _equipAndStatus2Sprite.bitmap = ImageManager.loadBitmap('img/pMapInventory/', 'inventoryBackground2');
            _equipAndStatus2Sprite.x = Graphics.width - 693;
            _equipAndStatus2Sprite.y = (Graphics.height - 660) / 2;
            SceneManager._scene.addChild(_equipAndStatus2Sprite);
        }
    };

    // 背景画像を非表示
    window.hideEquipAndStatus2 = function() {
        if (_equipAndStatus2Sprite) {
            SceneManager._scene.removeChild(_equipAndStatus2Sprite);
            _equipAndStatus2Sprite = null;
        }
    };
})();
