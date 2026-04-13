(function() {
    const pluginName = "ShowEquip";

    let equipWindows = [];
    let lastEquipData = [];
    let equipCheckInterval = null;
    let isVisible = false;
    let detailWindow = null;

    function getCurrentEquipState() {
        const actor = $gameParty.leader();
        if (!actor) return [];
        return actor.equips().map(eq => eq ? eq.id : null);
    }

    function hasEquipmentChanged() {
        const currentEquip = getCurrentEquipState();
        if (JSON.stringify(lastEquipData) !== JSON.stringify(currentEquip)) {
            lastEquipData = currentEquip;
            return true;
        }
        return false;
    }

    function createEquipWindow(x, y, w, h, equip, slotId) {
        const win = new W_EI(x, y, w, h, slotId);
        win.refresh(equip);
        SceneManager._scene.addChild(win);
        return win;
    }

    function W_EI() {
        this.initialize.apply(this, arguments);
    }
    W_EI.prototype = Object.create(Window_Base.prototype);
    W_EI.prototype.constructor = W_EI;
    W_EI.prototype.initialize = function(x, y, w, h, slotId) {
        Window_Base.prototype.initialize.call(this, x, y, w, h);
        this.opacity = 0;
        this._equip = null;
        this._slotId = slotId;
    };

W_EI.prototype.refresh = function(eq) {
    this.contents.clear();
    this._equip = eq;
    if (eq) {
        const itemRareMatch = eq.meta.itemRare;
        if (itemRareMatch) {
            const rarity = Number(itemRareMatch);
            if (rarity >= 1 && rarity <= 6) {
                const bitmap = ImageManager.loadSystem(`itemRare${rarity}`);
                if (!bitmap.isReady()) {
                    bitmap.addLoadListener(() => {
                        this.contents.clear();
                        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 4 - 2, 4 - 2);
                        this.drawIcon(eq.iconIndex, 4, 4);
                    });
                } else {
                    this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 4 - 2, 4 - 2);
                }
            }
        }
        this.drawIcon(eq.iconIndex, 4, 4);
    }
};




    W_EI.prototype.isMouseOverIcon = function() {
        if (!this._equip) return false;
        const mouseX = TouchInput.x;
        const mouseY = TouchInput.y;
        const iconX = this.x + this.padding + 4;
        const iconY = this.y + this.padding + 4;
        const iconSize = 32;
        return (
            mouseX >= iconX && mouseX <= iconX + iconSize &&
            mouseY >= iconY && mouseY <= iconY + iconSize
        );
    };

    W_EI.prototype.onClick = function() {
        if (this._equip && this._slotId !== undefined) {
            const actor = $gameParty.leader();
            if (actor) {
                actor.changeEquip(this._slotId, null);
                SoundManager.playEquip();
                showEquip();
            }
        }
    };

    function showEquip() {
        if (isVisible) return;

        createEquipWindows();
        lastEquipData = getCurrentEquipState();
        isVisible = true;

        equipCheckInterval = setInterval(() => {
            if (isVisible && hasEquipmentChanged()) {
                hideEquip();
                setTimeout(showEquip, 100);
            }
        }, 500);
    }

    function createEquipWindows() {
        const actor = $gameParty.leader();
        if (!actor) return;

        const equips = actor.equips();
        let windowWidth = Graphics.width / 6;
        let windowHeight = Graphics.height / 6;

        equips.forEach((equip, slotId) => {
            if (equip) {
                let x = 0;
                let y = 0;

                switch (slotId) {
                  case 0:
                      x = 1278;
                      y = 360;
                      break;
                  case 1:
                      x = 1278;
                      y = 240;
                      break;
                  case 2:
                      x = 1278;
                      y = 280;
                      break;
                  case 3:
                      x = 1278;
                      y = 320;
                      break;
                  case 4:
                      x = 1356;
                      y = 280;
                      break;
                  case 5:
                      x = 1356;
                      y = 240;
                      break;
                  case 6:
                      x = 1356;
                      y = 320;
                      break;
                  case 7:
                      x = 1356;
                      y = 360;
                      break;
              }


                const win = createEquipWindow(x, y, windowWidth, windowHeight, equip, slotId);
                equipWindows.push(win);
            }
        });
    }



    function hideEquip() {
        if (!isVisible) return;

        equipWindows.forEach(win => SceneManager._scene.removeChild(win));
        equipWindows = [];
        if (detailWindow) {
            SceneManager._scene.removeChild(detailWindow);
            detailWindow = null;
        }
        isVisible = false;
    }


function W_EquipDetail() {
    this.initialize.apply(this, arguments);
}

W_EquipDetail.prototype = Object.create(Window_Base.prototype);
W_EquipDetail.prototype.constructor = W_EquipDetail;

W_EquipDetail.prototype.initialize = function(x, y, w, h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
    this.opacity = 0;
    this._backgroundBitmap = ImageManager.loadSystem('showEquip_bg');
};

W_EquipDetail.prototype.drawBackground = function() {
    if (this._backgroundBitmap) {
        this.contents.blt(this._backgroundBitmap, 0, 0, this._backgroundBitmap.width, this._backgroundBitmap.height, 0, 0, this.width, this.height);
    }
};

W_EquipDetail.prototype.refresh = function(eq) {
    this.contents.clear();
    this.drawBackground();
    this._equip = eq;




if (eq) {
    this.contents.fontSize = 22;
    let y = 4;
    this.drawText(eq.name, 4, y, this.contents.width);
    y += 24;

    // ステータス表示（指定された順番に並べ替え）
    let paramNames = ["HP", "MANA", "STR", "INT", "AGI", "LUK", "DEF", "MDEF"];

    // eq.params の順番を並べ替え
    let reorderedParams = [
        eq.params[0], // HP
        eq.params[1], // MP
        eq.params[2], // ATK
        eq.params[4], // MAT
        eq.params[6], // AGI
        eq.params[7], // LUK
        eq.params[3], // DEF
        eq.params[5]  // MDEF
    ];

    for (let i = 0; i < 8; i++) {
        if (reorderedParams[i] !== 0) {
            this.drawText(paramNames[i] + ": " + reorderedParams[i], 4, y);
            y += 22;
        }
    }


        // 特徴の表示
        let traitsText = [];
        if (eq.traits && eq.traits.length > 0) {
            eq.traits.forEach(trait => {
                let traitText = convertTraitToText(trait);
                if (traitText) {
                    traitsText.push(traitText);
                }
            });

            if (traitsText.length > 0) {
                y += 10;
                traitsText.forEach(text => {
                    this.drawText(text, 4, y);
                    y += 22;
                });
            }
        }

        // 説明文
        if (eq.description) {
            y += 10;
            this.contents.fontSize = 22;
            this.drawText(eq.description, 4, y, this.contents.width);
        }
    }
};

// 特徴を適切に判別して表示する関数
function convertTraitToText(trait) {
    const code = trait.code;
    const dataId = trait.dataId;
    const value = trait.value;


    switch (code) {
        case 21:
            return ["HP", "MP", "ATK", "DEF", "MAT", "MDF", "AGI", "LUK"][dataId] + " +" + Math.round(value * 100) + "%";

        case 22: // Hit,Dodge,Crit
            return dataId === 0 ? "命中率 +" + Math.round(value * 100) + "%" :
                   dataId === 1 ? "DodgeRate +" + Math.round(value * 100) + "%" :
                   dataId === 2 ? "CritRate +" + Math.round(value * 100) + "%" : null;

        default:
            return null; // 他の特徴は表示しない
    }
}






function showEquipDetail(equip) {
    if (detailWindow) {
        SceneManager._scene.removeChild(detailWindow);
    }
    detailWindow = new W_EquipDetail(TouchInput.x + 10, TouchInput.y + 10, 480, 550);
    detailWindow.refresh(equip);
    SceneManager._scene.addChild(detailWindow);
}










    function hideEquipDetail() {
        if (detailWindow) {
            SceneManager._scene.removeChild(detailWindow);
            detailWindow = null;
        }
    }

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);

        if (Input.isTriggered("")) {
            if (isVisible) {
                hideEquip();
            } else {
                showEquip();
            }
        }

        let hoveredEquip = null;

        equipWindows.forEach(win => {
            if (win.isMouseOverIcon()) {
                hoveredEquip = win._equip;
            }
        });

        if (hoveredEquip) {
            showEquipDetail(hoveredEquip);
        } else {
            hideEquipDetail();
        }

        if (TouchInput.isTriggered()) {
            equipWindows.forEach(win => {
                if (win.isMouseOverIcon()) {
                    win.onClick();OpenMapInventory();
                }
            });
        }
    };

    window.showEquip = showEquip;
    window.hideEquip = hideEquip;

})();
