(function() {
    const pluginName = "ShowStatus";

    let statusWindow = null;
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

    function createStatusWindow(x, y, w, h, actor) {
        const win = new W_Status(x, y, w, h);
        win.refresh(actor);
        SceneManager._scene.addChild(win);
        return win;
    }

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
    this.contents.fontSize = 22;

    if (actor) {
        let y = 0;
        const baseLineHeight = this.lineHeight();
        const lineSpacing = 21;
        const lineHeight = baseLineHeight - lineSpacing;
	const labelWidth = 180;
        this.drawText(`HP: ${actor.hp}/${actor.mhp}`, 4, y); y += lineHeight;
        this.drawText(`MANA: ${actor.mp}/${actor.mmp}`, 4, y); y += lineHeight;
        this.drawText(`SP: ${actor.tp}`, 4, y); y += lineHeight;
        this.drawText(`STR: ${actor.atk}`, 4, y); y += lineHeight;
        this.drawText(`INT: ${actor.mat}`, 4, y); y += lineHeight;
        this.drawText(`AGI: ${actor.agi}`, 4, y); y += lineHeight;
        this.drawText(`LUK: ${actor.luk}`, 4, y); y += lineHeight;
        this.drawText(`DEF: ${actor.def}`, 4, y); y += lineHeight;
        this.drawText(`MDEF: ${actor.mdf}`, 4, y); y += lineHeight;
        this.drawText(`CRI: ${actor.cri * 100}%`, 4, y); y += lineHeight;
        this.drawText(`CRITMULTI: ${$gameVariables.value(306)}%`, 4, y); y += lineHeight;

        // カラー設定
        const physicalColor = '#AAAAAA'; // グレー
        const fireColor = '#FF0000';   // 赤
        const coldColor = '#00FFFF';   // 水色
        const electroColor = '#FFF000'; // 黄色
        const evilColor = '#BB00BB';   // 紫

        // 物理耐性
        this.changeTextColor(physicalColor);
        this.drawText(`Physical  Resist:`, 4, y);
        this.resetTextColor();
        this.drawText(`${Math.round((actor.elementRate(1) * 100 - 100) * -1)}%`, 4 + labelWidth, y);
        y += lineHeight;


        // 火耐性
        this.changeTextColor(fireColor);
        this.drawText(`Fire  Resist:`, 4, y);
        this.resetTextColor();
        this.drawText(`${Math.round((actor.elementRate(2) * 100 - 100) * -1)}%`, 4 + labelWidth, y);
        y += lineHeight;

        // 冷気耐性
        this.changeTextColor(coldColor);
        this.drawText(`Cold  Resist:`, 4, y);
        this.resetTextColor();
        this.drawText(`${Math.round((actor.elementRate(3) * 100 - 100) * -1)}%`, 4 + labelWidth, y);
        y += lineHeight;

        // 電撃耐性
        this.changeTextColor(electroColor);
        this.drawText(`Electro  Resist:`, 4, y);
        this.resetTextColor();
        this.drawText(`${Math.round((actor.elementRate(4) * 100 - 100) * -1)}%`, 4 + labelWidth, y);
        y += lineHeight;

        // 闇耐性
        this.changeTextColor(evilColor);
        this.drawText(`Evil  Resist:`, 4, y);
        this.resetTextColor();
        this.drawText(`${Math.round((actor.elementRate(5) * 100 - 100) * -1)}%`, 4 + labelWidth, y);


    }
};


    function showStatus() {
        if (isVisible) return;

        const actor = $gameParty.leader();
        if (!actor) return;

        statusWindow = createStatusWindow(1224, 446, Graphics.width / 4, Graphics.height / 2, actor);
        lastEquipData = getCurrentEquipState();
        isVisible = true;

        equipCheckInterval = setInterval(() => {
            if (isVisible && hasEquipmentChanged()) {
                hideStatus();
                setTimeout(showStatus, 100);
            }
        }, 500);
    }

    function hideStatus() {
        if (!isVisible) return;

        if (statusWindow) {
            SceneManager._scene.removeChild(statusWindow);
            statusWindow = null;
        }

        isVisible = false;
    }

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);

        if (Input.isTriggered("")) {
            if (isVisible) {
                hideStatus();
            } else {
                showStatus();
            }
        }
    };
    window.showStatus = showStatus;
    window.hideStatus = hideStatus;

})();
