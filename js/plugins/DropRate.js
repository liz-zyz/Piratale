/*:
 * @plugindesc ドロップアイテム、武器、防具の出現率を1/1,000,000まで拡張し、エフェクトを追加
 * @author あなたの名前
 * @help 
 * RPGツクールMVのドロップアイテム、武器、防具の確率上限を拡張し、
 * 指定のエフェクトを表示できるようにします。
 * 
 * 【使い方】
 * 敵キャラのメモ欄に以下の形式で記述：
 * <DropRateExt: x, y, z, w>
 * 
 * x = 1: アイテム、x = 2: 武器、x = 3: 防具  
 * y = ID  
 * z = 確率 (例: 1000000 → 1/1,000,000)  
 * w = 0 (エフェクトなし)  
 * w = 1以上 (エフェクトIDを指定)  
 * 
 * 例）アイテムID 5 を 1/500000 の確率でドロップし、エフェクトID 10 を再生：
 * <DropRateExt: 1, 5, 500000, 10>
 * 
 * 武器ID 10 を 1/1000000 でドロップ、エフェクトなし：
 * <DropRateExt: 2, 10, 1000000, 0>
 */

(function() {
    const _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
    Game_Enemy.prototype.makeDropItems = function() {
        let drops = _Game_Enemy_makeDropItems.call(this);
        
        // メモ欄から拡張ドロップを取得
        const note = this.enemy().note;
        const regex = /<DropRateExt:\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*>/g;
        let match;
        
        while ((match = regex.exec(note)) !== null) {
            const type = Number(match[1]);  // 1: アイテム, 2: 武器, 3: 防具
            const id = Number(match[2]);    // アイテム/武器/防具 ID
            const rate = Number(match[3]);  // ドロップ確率 (1/○○)
            const effectId = Number(match[4]); // エフェクトID (0なら無し)

            let item = null;
            if (type === 1 && $dataItems[id] && Math.random() * rate < 1) {
                item = $dataItems[id]; // アイテム
            } else if (type === 2 && $dataWeapons[id] && Math.random() * rate < 1) {
                item = $dataWeapons[id]; // 武器
            } else if (type === 3 && $dataArmors[id] && Math.random() * rate < 1) {
                item = $dataArmors[id]; // 防具
            }

            if (item) {
                drops.push(item);
                if (effectId > 0) {
                    this.startEffect(effectId); // エフェクト再生
                }
            }
        }

        return drops;
    };

    // エフェクトを再生する関数
Game_Enemy.prototype.startEffect = function(effectId) {
    if (!effectId || !$dataAnimations[effectId]) return;
    
    const animation = $dataAnimations[effectId];
    const scene = SceneManager._scene;

    // シーンが存在しない場合は中止
    if (!scene || !scene._spriteset) return;

    // プレイヤーキャラクター（または特定のイベント）をターゲットにする
    const target = $gamePlayer;
    const sprite = scene._spriteset._characterSprites.find(sprite => sprite._character === target);

    if (!sprite) return; // スプライトが見つからない場合は処理を中断

    // アニメーションを再生
    sprite.startAnimation(animation, false, 0);
};





})();
