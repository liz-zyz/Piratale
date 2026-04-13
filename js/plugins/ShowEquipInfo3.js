(function() {
    const pluginName = "ShowEquipAndStatus";

    let equipWindows = [];
    let statusWindow = null;
    let detailWindow = null;
    let isVisible = false;
    let lastEquipData = [];
    let equipCheckInterval = null;

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

    function createStatusWindow(x, y, w, h, actor) {
        const win = new W_Status(x, y, w, h);
        win.refresh(actor);
        SceneManager._scene.addChild(win);
        return win;
    }

    function createDetailWindow(x, y, w, h) {
        const win = new W_Detail(x, y, w, h);
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
            this.drawIcon(eq.iconIndex, 4, 4); 
        }
    };

    // アイコンにカーソルを重ねたかどうか
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

    // クリックで装備を外す
    W_EI.prototype.onClick = function() {
        if (this._equip && this._slotId !== undefined) {
            console.log(`Clicked on slot ${this._slotId}, unequipping item:`, this._equip);
            const actor = $gameParty.leader();
            if (actor) {
                actor.changeEquip(this._slotId, null);
                SoundManager.playEquip();
                showEquipAndStatus();
                
                // OpenMapInventory() を実行（定義されている場合のみ）
                if (typeof OpenMapInventory === "function") {
                    OpenMapInventory();
                }
            }
        }
    };

    function W_Status() {
        this.initialize.apply(this, arguments);
    }
    W_Status.prototype = Object.create(Window_Base.prototype);
    W_Status.prototype.constructor = W_Status;
    W_Status.prototype.initialize = function(x, y, w, h) {
        Window_Base.prototype.initialize.call(this, x, y, w, h);
        this.opacity = 0;
    };
    W_Status.prototype.refresh = function(actor) {
        this.contents.clear();
        if (actor) {
            let y = 0;
            const lineHeight = this.lineHeight();
            this.drawText(`HP: ${actor.hp}/${actor.mhp}`, 4, y); y += lineHeight;
            this.drawText(`MANA: ${actor.mp}/${actor.mmp}`, 4, y); y += lineHeight;
            this.drawText(`SP: ${actor.tp}`, 4, y); y += lineHeight;
            this.drawText(`STR: ${actor.atk}`, 4, y); y += lineHeight;
            this.drawText(`INT: ${actor.mat}`, 4, y); y += lineHeight;
            this.drawText(`AGI: ${actor.agi}`, 4, y); y += lineHeight;
            this.drawText(`LUK: ${actor.luk}`, 4, y); y += lineHeight;
            this.drawText(`DEF: ${actor.def}`, 4, y); y += lineHeight;
            this.drawText(`MDEF: ${actor.mdf}`, 4, y);
        }
    };

    function W_Detail() {
        this.initialize.apply(this, arguments);
    }
    W_Detail.prototype = Object.create(Window_Base.prototype);
    W_Detail.prototype.constructor = W_Detail;
    W_Detail.prototype.initialize = function(x, y, w, h) {
        Window_Base.prototype.initialize.call(this, x, y, w, h);
        this.opacity = 255;
        this._equip = null;
    };
    W_Detail.prototype.refresh = function(eq) {
        this.contents.clear();
        if (eq) {
            this.drawTextEx(eq.name, 4, 4);
            this.drawTextEx(eq.description || "説明なし", 4, 36);
        }
    };

    function showEquipAndStatus() {
        if (isVisible) return;

        createEquipAndStatusWindows();
        lastEquipData = getCurrentEquipState();
        isVisible = true;

        equipCheckInterval = setInterval(() => {
            if (isVisible && hasEquipmentChanged()) {
                hideEquipAndStatus();
                setTimeout(showEquipAndStatus, 100);
            }
        }, 500);
    }

    function createEquipAndStatusWindows() {
        const actor = $gameParty.leader();
        if (!actor) return;

        const equips = actor.equips();
        let offsetY = 80;
        const windowWidth = Graphics.width / 2;
        const windowHeight = Graphics.height / 6;

        equips.forEach((equip, slotId) => {
            if (equip) {
                const win = createEquipWindow(1000, offsetY, windowWidth, windowHeight, equip, slotId);
                equipWindows.push(win);
                offsetY += windowHeight + 10;
            }
        });

        statusWindow = createStatusWindow(10, 80, Graphics.width / 4, Graphics.height / 2, actor);
        detailWindow = createDetailWindow(1000, 80 + 100, 280, 100);
        detailWindow.hide();
    }

    function hideEquipAndStatus() {
        if (!isVisible) return;

        equipWindows.forEach(win => SceneManager._scene.removeChild(win));
        equipWindows = [];

        if (statusWindow) {
            SceneManager._scene.removeChild(statusWindow);
            statusWindow = null;
        }

        if (detailWindow) {
            SceneManager._scene.removeChild(detailWindow);
            detailWindow = null;
        }

        isVisible = false;
    }

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);

        if (Input.isTriggered("")) {
            if (isVisible) {
                hideEquipAndStatus();
            } else {
                showEquipAndStatus();
            }
        }

        if (isVisible && detailWindow) {
            let found = false;
            equipWindows.forEach(win => {
                if (win.isMouseOverIcon && win.isMouseOverIcon()) {
                    detailWindow.x = win.x + win.padding + 4;
                    detailWindow.y = win.y + win.padding + 36;
                    detailWindow.refresh(win._equip);
                    detailWindow.show();
                    found = true;
                }
            });
            if (!found) {
                detailWindow.hide();
            }
        }

        if (TouchInput.isTriggered()) {
            equipWindows.forEach(win => {
                if (win.isMouseOverIcon()) {
                    win.onClick();
                }
            });
        }
    };
    window.showEquipAndStatus = showEquipAndStatus;
    window.hideEquipAndStatus = hideEquipAndStatus;

})();
