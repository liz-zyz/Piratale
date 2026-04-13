(function() {
  let triggered = false;

  function isOverTerrainTag(tag) {
    const rx = $gamePlayer._realX;
    const ry = $gamePlayer._realY;
    const tiles = [
      [Math.floor(rx), Math.floor(ry)],
      [Math.ceil(rx), Math.floor(ry)],
      [Math.floor(rx), Math.ceil(ry)],
      [Math.ceil(rx), Math.ceil(ry)]
    ];
    return tiles.some(([x, y]) => $gameMap.terrainTag(x, y) === tag);
  }

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);

    if (Input.isPressed('down')) {
      if (isOverTerrainTag(5)) {
        if (!triggered) {
          triggered = true;
          $gamePlayer._through = true;
          
          // 30フレーム後に通行戻す
          setTimeout(() => {
            $gamePlayer._through = false;
          }, 100);
        }
      }
    } else {
      triggered = false; // 下が押されていないときにフラグリセット
    }
  };
})();
