/*:
 * @plugindesc <click> / <clickx> シンプル版：ホバーで向き変更＋クリック起動のみ
 *
 * @help
 * <click>   クリックで起動
 * <clickx>  ホバーで向き変更（ホバー中は上、非ホバーは下）＋クリックで起動
 *
 * ※イベント中の向き制御は一切行いません。
 *   必要な場合はイベントコマンド側で実装してください。
 */

(function() {

    function getClickOffset(ev, tag) {
        if (!ev || !ev.event() || !ev.event().meta) return 0;
        const meta = ev.event().meta;
        if (meta[tag]) {
            const v = Number(meta[tag]);
            return isNaN(v) ? 0 : v;
        }
        return 0;
    }

    // ===============================
    // クリックでイベント起動
    // ===============================
    document.addEventListener("mousedown", function(event) {
        if (!$gameMap || !$dataMap) return;

        const zoomScale = $gameScreen.zoomScale();
        const zoomX = $gameScreen.zoomX();
        const zoomY = $gameScreen.zoomY();

        const adjustedX = (TouchInput.x - Graphics.width / 2) / zoomScale + zoomX;
        const adjustedY = (TouchInput.y - Graphics.height / 2) / zoomScale + zoomY;

        const x = $gameMap.canvasToMapX(adjustedX);
        const y = $gameMap.canvasToMapY(adjustedY);

        $gameMap.events().forEach(ev => {
            if (!ev || !ev.event()) return;

            if (ev.event().meta.click || ev.event().meta.clickx) {

                const offset = ev.event().meta.click
                    ? getClickOffset(ev, "click")
                    : getClickOffset(ev, "clickx");

                if (ev.x === x && ev.y === y + offset) {
                    ev.start(); // ← 起動するだけ。向きは一切触らない
                }
            }
        });
    });

    // ===============================
    // ホバー処理（シンプル版）
    // ===============================
    document.addEventListener("mousemove", function(event) {
        if (!$gameMap || !$dataMap) return;

        const zoomScale = $gameScreen.zoomScale();
        const zoomX = $gameScreen.zoomX();
        const zoomY = $gameScreen.zoomY();

        const adjustedX = (TouchInput.x - Graphics.width / 2) / zoomScale + zoomX;
        const adjustedY = (TouchInput.y - Graphics.height / 2) / zoomScale + zoomY;

        const x = $gameMap.canvasToMapX(adjustedX);
        const y = $gameMap.canvasToMapY(adjustedY);

        $gameMap.events().forEach(ev => {
            if (!ev || !ev.event() || !ev.event().meta.clickx) return;

            const offset = getClickOffset(ev, "clickx");
            const hovered = (ev.x === x && ev.y === y + offset);

            // ★ シンプル仕様：ホバー中は上、非ホバーは下
            if (hovered) {
                ev.setDirection(8);
            } else {
                ev.setDirection(2);
            }
        });
    });

})();
