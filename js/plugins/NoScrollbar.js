/*:
 * @plugindesc スクロールバーを強制非表示にします
 * @author Custom
 *
 * @help
 * ゲーム画面にスクロールバーが表示されないようにします。
 * インベントリなど画面サイズに影響するUIを使用する際に有効です。
 * プラグインリストの一番上に配置することを推奨します。
 * パラメータ・プラグインコマンドはありません。
 */

(function() {
    var style = document.createElement('style');
    style.innerHTML = [
        'body, html {',
        '    overflow: hidden !important;',
        '    margin: 0 !important;',
        '    padding: 0 !important;',
        '}'
    ].join('\n');
    document.head.appendChild(style);
})();
