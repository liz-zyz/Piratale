/*:
 * @plugindesc セット装備による効果を実装するプラグイン (最大3つのタグ対応)
 * @author Your Name
 *
 * @help
 * <setgear1:x,y,z>
 * x: セット識別子
 * y: セット効果発動に必要な装備数
 * z: 効果を反映させる防具ID
 *
 * <setgear2:x,y,z> （別のタグを使用）
 * x: セット識別子
 * y: セット効果発動に必要な装備数
 * z: 効果を反映させる防具ID
 *
 * <setgear3:x,y,z> （別のタグを使用）
 * x: セット識別子
 * y: セット効果発動に必要な装備数
 * z: 効果を反映させる防具ID
 *
 * 例: <setgear1:1,2,41>
 * 武器A, 防具B, Cにこのタグをつけると
 * A+B, B+C, A+C, A+B+C で2セット効果が発動し、防具41の効果が適用される。
 *
 * <setgear2:2,3,42>
 * 別のセット効果に関しても同様に設定できます。
 *
 * <setgear3:3,4,43>
 * さらに別のセット効果に関しても設定できます。
 */
(function() {
    function getSetGearInfo(item, tagPrefix) {
        if (!item || !item.meta[tagPrefix]) return null;
        let params = item.meta[tagPrefix].split(',').map(Number);
        return { setId: params[0], requiredCount: params[1], armorId: params[2] };
    }

    Game_Actor.prototype.getEquippedSetCounts = function(tagPrefix) {
        let setCounts = {};
        this.equips().forEach(equip => {
            let info = getSetGearInfo(equip, tagPrefix);
            if (info) {
                setCounts[info.setId] = (setCounts[info.setId] || 0) + 1;
            }
        });
        return setCounts;
    };

    Game_Actor.prototype.hasSetEffect = function(tagPrefix) {
        let setCounts = this.getEquippedSetCounts(tagPrefix);
        let result = {};
        
        for (let setId in setCounts) {
            let count = setCounts[setId];
            let requiredCount = 0;
            let armorId = null;
            
            this.equips().forEach(equip => {
                let info = getSetGearInfo(equip, tagPrefix);
                if (info && info.setId === parseInt(setId)) {
                    requiredCount = info.requiredCount;
                    armorId = info.armorId;
                }
            });

            if (count >= requiredCount) {
                result[setId] = armorId;
            }
        }
        
        return result;
    };

    let _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        let value = _Game_Actor_paramPlus.call(this, paramId);
        let appliedSetEffects = {};

        ["setgear1", "setgear2", "setgear3"].forEach(tagPrefix => {
            let activeSets = this.hasSetEffect(tagPrefix);
            Object.values(activeSets).forEach(armorId => {
                if (!appliedSetEffects[armorId]) {
                    let armor = $dataArmors[armorId];
                    if (armor) {
                        value += armor.params[paramId];
                    }
                    appliedSetEffects[armorId] = true;
                }
            });
        });

        return value;
    };

    let _Game_Actor_traitObjects = Game_Actor.prototype.traitObjects;
    Game_Actor.prototype.traitObjects = function() {
        let objects = _Game_Actor_traitObjects.call(this);
        let appliedSetEffects = {};

        ["setgear1", "setgear2", "setgear3"].forEach(tagPrefix => {
            let activeSets = this.hasSetEffect(tagPrefix);
            Object.values(activeSets).forEach(armorId => {
                if (!appliedSetEffects[armorId]) {
                    let armor = $dataArmors[armorId];
                    if (armor) {
                        objects.push(armor);
                    }
                    appliedSetEffects[armorId] = true;
                }
            });
        });

        return objects;
    };
})();
