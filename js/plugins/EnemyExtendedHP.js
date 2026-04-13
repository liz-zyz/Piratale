/*:
 * @plugindesc 敵のHP制限を拡張して、999999999まで設定可能にします（メモタグ対応） - 完全版
 * @author ChatGPT
 *
 * @help
 * 敵のメモ欄に次のように記述してください：
 *
 *   <ExtendedHP:99999999999>
 *
 * ※ このプラグインは内部のHP最大値制限も拡張します。
 */

(function() {
  // ★ paramMax の上限を拡張（HP以外も変更可能）
  Game_BattlerBase.prototype.paramMax = function(paramId) {
    if (paramId === 0) return 999999999999999999; // 最大HP
    return 999999; // 他のパラメータの最大値も拡張（任意）
  };

  // ★ 敵の初期化時にExtendedHPを上書き
  const _Game_Enemy_setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function(enemyId, x, y) {
    _Game_Enemy_setup.call(this, enemyId, x, y);
    const meta = $dataEnemies[enemyId].meta;
    if (meta.ExtendedHP) {
      const newHp = Number(meta.ExtendedHP);
      this._paramPlus[0] = newHp - this.paramBase(0);
      this._hp = this.mhp; // HPを満タンに
    }
  };
})();
