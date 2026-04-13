/*:
 * @plugindesc ショップで「売る」機能を削除し、即「買う」画面に入りキャンセルでショップを閉じます。
 * @author ChatGPT
 *
 * @help
 * このプラグインを導入すると：
 * - ショップを開いた瞬間「買う」画面が表示されます。
 * - 売却機能は完全に無効になります。
 * - 買う画面でキャンセルするとそのままショップを閉じます。
 *
 * プラグインコマンドなし。
 */

(function() {

    const _Scene_Shop_start = Scene_Shop.prototype.start;
    Scene_Shop.prototype.start = function() {
        _Scene_Shop_start.call(this);
        this.commandBuy(); // 自動で「買う」コマンドを実行
    };

    // 「売る」コマンド自体を消す
    Window_ShopCommand.prototype.makeCommandList = function() {
        this.addCommand(TextManager.buy,  'buy');
        // 売却は追加しない
        // キャンセルも追加しない（使わない）
    };

    // 「買う」ウィンドウでキャンセルしたときにショップを閉じるようにする
    const _Scene_Shop_onBuyCancel = Scene_Shop.prototype.onBuyCancel;
    Scene_Shop.prototype.onBuyCancel = function() {
        this.popScene(); // 即ショップを閉じる
    };

})();
