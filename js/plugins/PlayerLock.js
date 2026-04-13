/*:
 * @plugindesc プレイヤー移動を完全にロック／解除するプラグイン
 * @author -
 *
 * @help
 * ◆ 機能
 * PlayerLock.lock();    // プレイヤー移動を完全に禁止
 * PlayerLock.unlock();  // プレイヤー移動を解除
 *
 * ◆ 使い方
 * イベントの最初に：  Script：PlayerLock.lock();
 * イベントの最後に：  Script：PlayerLock.unlock();
 *
 * これだけでプレイヤーは絶対に動けなくなる。
 */

var PlayerLock = PlayerLock || {};
PlayerLock._locked = false;

PlayerLock.lock = function() {
    this._locked = true;
};

PlayerLock.unlock = function() {
    this._locked = false;
};

const _Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function() {
    if (PlayerLock._locked) return false;
    return _Game_Player_canMove.call(this);
};
