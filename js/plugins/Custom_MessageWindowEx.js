/*:
 * @target MV
 * @plugindesc メッセージウィンドウのサイズ・位置・透過・フォント変更 + \CT 中央寄せ（完全修正版）
 *
 * @param Message Width
 * @type number
 * @default 0
 *
 * @param Message Height
 * @type number
 * @default 0
 *
 * @param Message X
 * @type number
 * @default
 *
 * @param Message Y
 * @type number
 * @default
 *
 * @param Message Opacity
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param Message Font Size
 * @type number
 * @default 0
 *
 * @param Message Font Face
 * @type string
 * @default
 */

(function() {

    const p = PluginManager.parameters('Custom_MessageWindowEx');
    const W  = Number(p['Message Width']  || 0);
    const H  = Number(p['Message Height'] || 0);
    const PX = p['Message X'];
    const PY = p['Message Y'];
    const OPA = Number(p['Message Opacity'] || 255);
    const FS  = Number(p['Message Font Size'] || 0);
    const FF  = String(p['Message Font Face'] || "");

    const hasX = PX !== "";
    const hasY = PY !== "";

    //--------------------------------------------------
    // Window_Message サイズ・位置・透過
    //--------------------------------------------------
    const _place = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _place.call(this);

        if (W > 0) this.width  = W;
        if (H > 0) this.height = H;
        this.createContents();

        if (hasX) this.x = Number(PX);
        else this.x = (Graphics.boxWidth - this.width) / 2;

        if (hasY) this.y = Number(PY);

        this.opacity = this.contentsOpacity = this.backOpacity = OPA;
    };

    //--------------------------------------------------
    // フォント設定
    //--------------------------------------------------
    const _resetFont = Window_Message.prototype.resetFontSettings;
    Window_Message.prototype.resetFontSettings = function() {
        _resetFont.call(this);
        if (FS > 0) this.contents.fontSize = FS;
        if (FF)     this.contents.fontFace = FF;
    };

    //--------------------------------------------------
    // \CT フラグ
    //--------------------------------------------------
    const _esc = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (code === 'CT') {
            textState._centerThisLine = true;
            return;
        }
        _esc.call(this, code, textState);
    };

    //--------------------------------------------------
    // 行開始時に中央寄せを実行
    //--------------------------------------------------
    const _newLine = Window_Message.prototype.processNewLine;
    Window_Message.prototype.processNewLine = function(textState) {

        _newLine.call(this, textState);

        if (!textState._centerThisLine) return;

        const full = this._getFullLineText(textState);
        const pure = full.replace(/\\CT/g, "");
        const w = this.textWidth(pure);

        textState.x = (this.contentsWidth() - w) / 2;

        textState._centerThisLine = false;
    };

    //--------------------------------------------------
    // 行全体のテキストを取得
    //--------------------------------------------------
    Window_Message.prototype._getFullLineText = function(textState) {
        const text = textState.text;
        let i = textState.index;

        while (i > 0 && text[i - 1] !== '\n') i--;
        let j = i;
        while (j < text.length && text[j] !== '\n') j++;

        return text.slice(i, j);
    };

    //--------------------------------------------------
    // drawTextEx の修正
    //--------------------------------------------------
    const _drawTextEx = Window_Message.prototype.drawTextEx;
    Window_Message.prototype.drawTextEx = function(text, x, y) {
        const pure = text.replace(/^\\CT/, "");
        return _drawTextEx.call(this, pure, x, y);
    };

    //--------------------------------------------------
    // 選択肢ウィンドウに透明度とフォントを適用
    //--------------------------------------------------
    const _choiceUpdatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        _choiceUpdatePlacement.call(this);
        this.opacity = this.contentsOpacity = this.backOpacity = OPA;
    };

    const _choiceResetFont = Window_ChoiceList.prototype.resetFontSettings;
    Window_ChoiceList.prototype.resetFontSettings = function() {
        if (_choiceResetFont) _choiceResetFont.call(this);
        if (FS > 0 && this.contents) this.contents.fontSize = FS;
        if (FF && this.contents)     this.contents.fontFace = FF;
    };

})();
