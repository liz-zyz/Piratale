/*:
 * @plugindesc RPGツクールMVのTabキーのデフォルト動作を完全無効化する
 * @author あなたの名前
 *
 * @help
 * このプラグインを導入すると、Tabキーのデフォルト機能（ページ切り替えなど）が完全に無効になります。
 * 他のプラグインやスクリプトでTabキーを自由に使用できるようになります。
 */

(function() {
    // Tabキー (keycode 9) のデフォルト動作を削除
    Input.keyMapper[9] = "tab";

    // キーイベントを監視し、Tabキーのデフォルト処理をブロック
    document.addEventListener('keydown', function(event) {
        if (event.key === "Tab") {
            event.preventDefault(); // デフォルト動作をキャンセル
        }
    }, true);
})();
