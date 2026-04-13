(function() {
    const delayFrames = 13; // 遅延フレーム数

    const _Sprite_Character_startAnimation = Sprite_Character.prototype.startAnimation;
    Sprite_Character.prototype.startAnimation = function(animation, mirror, delay) {
        const animationId = animation.id;

        // IDが12〜15のときだけ遅延させる
        if (this._character === $gamePlayer && animationId >= 12 && animationId <= 15) {
            // アニメーション遅延用のフラグを設定
            this._delayedAnimationId = animationId;
            this._delayedAnimationFrame = delayFrames; // 10フレーム遅延
            return; // 遅延中なのでアニメーション開始を一時保留
        }

        // 通常のアニメーション処理
        _Sprite_Character_startAnimation.call(this, animation, mirror, delay);
    };

    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        // 遅延アニメーションフレームの処理
        if (this._delayedAnimationFrame > 0) {
            this._delayedAnimationFrame--; // 1フレーム遅延をカウント
        } else if (this._delayedAnimationId) {
            // 遅延が終わったらアニメーションを実行
            const animation = $dataAnimations[this._delayedAnimationId];
            _Sprite_Character_startAnimation.call(this, animation, false, 0); // アニメーションを再開
            this._delayedAnimationId = null; // フラグリセット
        }

        // 通常の更新処理
        _Sprite_Character_update.call(this);
    };

    // イベントのアニメーション処理に関して、ウェイトを無視して動作させる処理を追加
    const _Game_Interpreter_command_106 = Game_Interpreter.prototype.command_106;
    Game_Interpreter.prototype.command_106 = function() {
        const result = _Game_Interpreter_command_106.call(this);
        
        // イベントのアニメーション表示時、遅延を考慮して処理
        if (this._character === $gamePlayer) {
            if (this._params[0] >= 12 && this._params[0] <= 15) {
                // イベントの処理後にアニメーションを遅延させる
                this.wait(delayFrames);  // ウェイトを入れることで遅延を反映
            }
        }

        return result;
    };
})();
