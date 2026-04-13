(function() {
    const reappearDelaySeconds = 0.26; // 再表示タイミング（秒単位、負値もOK）

    const _Sprite_Character_startAnimation = Sprite_Character.prototype.startAnimation;
    Sprite_Character.prototype.startAnimation = function(animation, mirror, delay) {
        const animationId = animation.id;

        // IDが4〜10のときだけ適用
        if (this._character === $gamePlayer && animationId >= 4 && animationId <= 11) {
            $gamePlayer.setTransparent(true); // アニメ開始で透明化

            const sprite = this;
            const frameRate = 60; // 基本フレームレート
            const totalDuration = (animation.frames.length + animation.timings.length) / frameRate;
            const appearTime = totalDuration + reappearDelaySeconds;

            let elapsed = 0;
            const originalUpdate = SceneManager.updateMain.bind(SceneManager);

            SceneManager.updateMain = function() {
                elapsed += this._deltaTime;
                if (elapsed >= appearTime) {
                    $gamePlayer.setTransparent(false);
                    SceneManager.updateMain = originalUpdate; // 復元
                }
                originalUpdate();
            };
        }

        _Sprite_Character_startAnimation.call(this, animation, mirror, delay);
    };
})();
