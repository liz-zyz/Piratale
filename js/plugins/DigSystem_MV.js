//=============================================================================
// DigSystem_MV.js
// タイル破壊システム（TMJumpAction連携）
// B〜Eタイル専用版（範囲指定対応）
//=============================================================================

/*:
 * @plugindesc タイル破壊システム（TMJumpAction連携） B〜Eタイル専用版
 * @author YourName
 * @help
 * スキルのメモ欄:
 * <dig_tile>     - このスキルを採掘弾として扱う
 * <dig_tier:3>   - ツルハシの階級（この値以上のブロックを採掘可能）
 * <dig_power:5>  - 破壊力
 *
 * 【破壊可能タイルの設定方法】
 * プラグインパラメータ「破壊可能タイル」に1行ずつ入力してください。
 *
 * 書式:
 * 単一ID: タイルID:必要階級,耐久値,ドロップID,破壊後ID,途中ID1,途中ID2,途中ID3,ダメージSE,破壊SE
 * 範囲指定: 開始ID-終了ID:必要階級,耐久値,ドロップID,破壊後ID,途中ID1,途中ID2,途中ID3,ダメージSE,破壊SE
 *
 * 例:
 * 72:1,20,0,0,0,0,0,dig1,digbreak1
 * 8448-8703:1,20,0,0,0,0,0,dig1,digbreak1   (Bタイル全体)
 *
 * タイルID範囲:
 * B:   0-255   (デフォルトBタイル)
 * C:   256-511
 * D:   512-767
 * E:   768-1023
 * A5:  1536-1663
 *
 * 【マップごとの設定】
 * 破壊状態を保持したいマップのメモ欄に <dig_keep> と記入してください。
 *
 * @param diggableTiles
 * @text 破壊可能タイル
 * @desc タイルID:必要階級,耐久値,ドロップID,破壊後ID,途中ID1,途中ID2,途中ID3,ダメージSE,破壊SE
 * @type note
 * @default
 */

(function() {

    console.log('DigSystem_MV: 起動（B〜Eタイル専用版）');

    var p = PluginManager.parameters('DigSystem_MV');
    var DiggableTiles = {};

    var raw = p['diggableTiles'] || '';

    // 引用符を除去
    var cleaned = raw;
    if (cleaned.charAt(0) === '"') cleaned = cleaned.substring(1);
    if (cleaned.charAt(cleaned.length - 1) === '"') cleaned = cleaned.substring(0, cleaned.length - 1);

    var converted = cleaned.replace(/\\n/g, '\n');
    converted = converted.trim();
    var lines = converted.split(/\r?\n/);

    // パラメータ解析（範囲指定対応）
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '') continue;

        var parts = line.split(':');
        if (parts.length !== 2) continue;

        var idPart = parts[0];
        var values = parts[1].split(',').map(function(v) {
            return v.trim().replace(/^"|"$/g, '');
        });

        if (values.length < 2) continue;

        var requiredTier = parseInt(values[0], 10) || 1;
        var maxHp = parseInt(values[1], 10) || 1;
        var dropItemId = parseInt(values[2], 10) || 0;
        var replaceTileId = parseInt(values[3], 10) || 0;
        var midTile1 = parseInt(values[4], 10) || 0;
        var midTile2 = parseInt(values[5], 10) || 0;
        var midTile3 = parseInt(values[6], 10) || 0;
        var damageSe = values[7] ? values[7].trim() : '';
        var breakSe = values[8] ? values[8].trim() : '';

        // 範囲指定
        if (idPart.indexOf('-') !== -1) {
            var range = idPart.split('-');
            var startId = parseInt(range[0], 10);
            var endId = parseInt(range[1], 10);
            for (var id = startId; id <= endId; id++) {
                DiggableTiles[id] = {
                    requiredTier: requiredTier,
                    maxHp: maxHp,
                    dropItemId: dropItemId,
                    replaceTileId: replaceTileId,
                    midTile1: midTile1,
                    midTile2: midTile2,
                    midTile3: midTile3,
                    damageSe: damageSe,
                    breakSe: breakSe
                };
            }
            console.log('範囲設定: ' + startId + '-' + endId);
        } else {
            // 単一ID
            var tileId = parseInt(idPart, 10);
            if (!isNaN(tileId) && tileId > 0) {
                DiggableTiles[tileId] = {
                    requiredTier: requiredTier,
                    maxHp: maxHp,
                    dropItemId: dropItemId,
                    replaceTileId: replaceTileId,
                    midTile1: midTile1,
                    midTile2: midTile2,
                    midTile3: midTile3,
                    damageSe: damageSe,
                    breakSe: breakSe
                };
                console.log('単一設定: ID' + tileId);
            }
        }
    }

    // 途中IDも自動登録
    var additionalTiles = {};
    for (var tid in DiggableTiles) {
        var cfg = DiggableTiles[tid];
        var midIds = [cfg.midTile1, cfg.midTile2, cfg.midTile3];
        for (var j = 0; j < midIds.length; j++) {
            var midId = midIds[j];
            if (midId > 0 && !DiggableTiles[midId] && !additionalTiles[midId]) {
                additionalTiles[midId] = {
                    requiredTier: cfg.requiredTier,
                    maxHp: cfg.maxHp,
                    dropItemId: cfg.dropItemId,
                    replaceTileId: cfg.replaceTileId,
                    midTile1: 0,
                    midTile2: 0,
                    midTile3: 0,
                    damageSe: cfg.damageSe,
                    breakSe: cfg.breakSe
                };
                console.log('途中ID自動登録: ID' + midId);
            }
        }
    }
    for (var aid in additionalTiles) {
        DiggableTiles[aid] = additionalTiles[aid];
    }

    console.log('最終設定:', DiggableTiles);

    //=========================================================================
    // セーブデータ管理
    //=========================================================================

    function ensureTileData() {
        if (!$gameSystem._digTiles) $gameSystem._digTiles = [];
        if (!$gameSystem._digTileHp) $gameSystem._digTileHp = [];
    }

    function saveTileChange(mapId, x, y, layer, tileId) {
        ensureTileData();
        var existing = $gameSystem._digTiles.find(function(t) {
            return t.mapId === mapId && t.x === x && t.y === y && t.layer === layer;
        });
        if (existing) {
            existing.tileId = tileId;
        } else {
            $gameSystem._digTiles.push({ mapId: mapId, x: x, y: y, layer: layer, tileId: tileId });
        }
    }

    function saveTileHp(mapId, x, y, layer, hp) {
        ensureTileData();
        var existing = $gameSystem._digTileHp.find(function(t) {
            return t.mapId === mapId && t.x === x && t.y === y && t.layer === layer;
        });
        if (existing) {
            existing.hp = hp;
        } else {
            $gameSystem._digTileHp.push({ mapId: mapId, x: x, y: y, layer: layer, hp: hp });
        }
    }

    function applyTileChanges(mapId) {
        ensureTileData();
        $gameSystem._digTiles.forEach(function(tile) {
            if (tile.mapId === mapId) {
                var w = $dataMap.width, h = $dataMap.height;
                var idx = (tile.layer * w * h) + (tile.y * w) + tile.x;
                $dataMap.data[idx] = tile.tileId;
            }
        });
        $gameSystem._digTileHp.forEach(function(tile) {
            if (tile.mapId === mapId) {
                var key = mapId + ',' + tile.x + ',' + tile.y + ',' + tile.layer;
                CurrentHp[key] = tile.hp;
            }
        });
        if ($gameTemp) $gameTemp._needMapRefresh = true;
    }

    function shouldKeepMapChanges(mapId) {
        var map = $dataMap;
        if (!map) return false;
        return map.meta && map.meta.dig_keep === true;
    }

    var CurrentHp = {};

    function getKey(mapId, x, y, layer) {
        return mapId + ',' + x + ',' + y + ',' + layer;
    }

    function getCurrentTileId(config, currentHp) {
        if (currentHp <= 0) return config.replaceTileId;
        var ratio = currentHp / config.maxHp;
        if (config.midTile3 && ratio <= 0.3) return config.midTile3;
        if (config.midTile2 && ratio <= 0.6) return config.midTile2;
        if (config.midTile1 && ratio <= 0.9) return config.midTile1;
        return 0;
    }

    function setTileDirect(x, y, layer, tileId, save) {
        if (save === undefined) save = true;
        var w = $dataMap.width, h = $dataMap.height;
        var idx = (layer * w * h) + (y * w) + x;
        $dataMap.data[idx] = tileId;
        var mapId = $gameMap.mapId();
        if (save && shouldKeepMapChanges(mapId)) {
            saveTileChange(mapId, x, y, layer, tileId);
        }
        if ($gameTemp) $gameTemp._needMapRefresh = true;
    }

    function playSe(seName) {
        if (seName && seName !== '0' && seName !== '' && seName !== 'undefined') {
            var cleanName = seName.replace(/\.ogg$/i, '').replace(/\.wav$/i, '').replace(/^"|"$/g, '');
            try {
                AudioManager.playSe({ name: cleanName, volume: 90, pitch: 100, pan: 0 });
            } catch(e) {}
        }
    }

    if (typeof Game_Bullet === 'undefined') {
        console.error('DigSystem_MV: TMJumpAction.js が必要です');
        return;
    }

    //=========================================================================
    // セーブデータの拡張
    //=========================================================================

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        ensureTileData();
        setTimeout(function() {
            if ($gameMap) {
                var mapId = $gameMap.mapId();
                if (shouldKeepMapChanges(mapId)) {
                    applyTileChanges(mapId);
                }
            }
        }, 100);
    };

    //=========================================================================
    // マップ移動時の処理
    //=========================================================================

    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);

        if (!shouldKeepMapChanges(mapId)) {
            for (var key in CurrentHp) {
                if (key.indexOf(mapId + ',') === 0) {
                    delete CurrentHp[key];
                }
            }
        }

        if (shouldKeepMapChanges(mapId)) {
            setTimeout(function() {
                applyTileChanges(mapId);
            }, 0);
        }
    };

    //=========================================================================
    // 弾の衝突判定
    //=========================================================================

    var _update = Game_Bullet.prototype.updateCollide;
    Game_Bullet.prototype.updateCollide = function() {
        var skill = $dataSkills[this._skillId];
        if (skill && skill.meta && skill.meta['dig_tile']) {
            var x = Math.floor(this._x);
            var y = Math.floor(this._y);
            if (x >= 0 && x < $gameMap.width() && y >= 0 && y < $gameMap.height()) {
                for (var layer = 0; layer <= 5; layer++) {
                    var tid = $gameMap.tileId(x, y, layer);
                    var cfg = DiggableTiles[tid];
                    if (cfg) {
                        var digTier = skill.meta['dig_tier'] ? Number(skill.meta['dig_tier']) : 1;
                        if (digTier < cfg.requiredTier) {
                            return false;
                        }

                        var digPower = skill.meta['dig_power'] ? Number(skill.meta['dig_power']) : 1;
                        var mapId = $gameMap.mapId();
                        var key = getKey(mapId, x, y, layer);
                        var cur = CurrentHp[key];
                        if (cur === undefined) cur = cfg.maxHp;
                        var newHp = cur - digPower;

                        if (newHp <= 0) {
                            setTileDirect(x, y, layer, cfg.replaceTileId);
                            if (cfg.dropItemId > 0) {
                                $gameParty.gainItem($dataItems[cfg.dropItemId], 1);
                            }
                            playSe(cfg.breakSe);
                            delete CurrentHp[key];
                            if (shouldKeepMapChanges(mapId)) {
                                var hpIndex = $gameSystem._digTileHp.findIndex(function(t) {
                                    return t.mapId === mapId && t.x === x && t.y === y && t.layer === layer;
                                });
                                if (hpIndex >= 0) $gameSystem._digTileHp.splice(hpIndex, 1);
                            }
                        } else {
                            CurrentHp[key] = newHp;
                            if (shouldKeepMapChanges(mapId)) {
                                saveTileHp(mapId, x, y, layer, newHp);
                            }
                            var newTileId = getCurrentTileId(cfg, newHp);
                            if (newTileId !== 0 && newTileId !== tid) {
                                setTileDirect(x, y, layer, newTileId);
                            }
                            playSe(cfg.damageSe);
                        }
                        return true;
                    }
                }
            }
            return false;
        }
        return _update.call(this);
    };

    //=========================================================================
    // マップ再描画処理
    //=========================================================================

    var _refresh = Spriteset_Map.prototype.updateTilemap;
    Spriteset_Map.prototype.updateTilemap = function() {
        _refresh.call(this);
        if ($gameTemp && $gameTemp._needMapRefresh) {
            this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
            this._tilemap.refresh();
            $gameTemp._needMapRefresh = false;
        }
    };

    var _temp = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _temp.call(this);
        this._needMapRefresh = false;
    };

    console.log('DigSystem_MV: 読み込み完了（B〜Eタイル専用版）');

})();
