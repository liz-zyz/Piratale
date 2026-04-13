/*:
 * @plugindesc Plugin used to set basic parameters.
 * @author RM CoreScript team
 *
 * @help
 * This plugin provides plugin commands to change the screen size and toggle fullscreen or windowed mode.
 *
 * Plugin Commands:
 * 
 * - screen_resize 1280x720
 * - screen_resize 1600x900
 * - screen_resize 1920x1080
 * - screen_resize fullscreen  // Add this command to toggle fullscreen/windowed mode
 * 
 * @param cacheLimit
 * @desc For setting the upper limit of image memory cache. (MPix)
 * @default 10
 *
 * @param screenWidth
 * @desc For setting the screen width.
 * @default 816
 *
 * @param screenHeight
 * @desc For setting the screen height.
 * @default 624
 *
 * @param changeWindowWidthTo
 * @desc If set, change window width to this value
 *
 * @param changeWindowHeightTo
 * @desc If set, change window height to this value
 *
 * @param renderingMode
 * @desc Rendering mode (canvas/webgl/auto)
 * @default auto
 *
 * @param alwaysDash
 * @desc To set initial value as to whether the player always dashes. (on/off)
 * @default off
 */

/*:ja
 * @plugindesc 基本的なパラメーターを設定するプラグインです。
 * @author RM CoreScript team
 *
 * @help
 * このプラグインは、画面サイズを変更したり、フルスクリーンやウィンドウモードを切り替えるプラグインコマンドを提供します。
 *
 * プラグインコマンド:
 *
 * - screen_resize 1280x720
 * - screen_resize 1600x900
 * - screen_resize 1920x1080
 * - screen_resize fullscreen  // フルスクリーン/ウィンドウモードの切り替え
 * 
 * @param cacheLimit
 * @desc 画像のメモリへのキャッシュの上限値 (MPix)
 * @default 10
 *
 * @param screenWidth
 * @desc 画面サイズの幅
 * @default 1600
 *
 * @param screenHeight
 * @desc 画面サイズの高さ
 * @default 900
 *
 * @param changeWindowWidthTo
 * @desc 値が設定された場合、ウインドウの幅を指定した値に変更
 *
 * @param changeWindowHeightTo
 * @desc 値が設定された場合、ウインドウの高さを指定した値に変更
 *
 * @param renderingMode
 * @desc レンダリングモード (canvas/webgl/auto)
 * @default auto
 *
 * @param alwaysDash
 * @desc プレイヤーが常時ダッシュするかどうかの初期値 (on/off)
 * @default off
 */

(function() {
    function toNumber(str, def) {
        return isNaN(str) ? def : +(str || def);
    }

    var parameters = PluginManager.parameters('Community_Basic_ver3');
    var cacheLimit = toNumber(parameters['cacheLimit'], 10);
    var screenWidth = toNumber(parameters['screenWidth'], 1600);
    var screenHeight = toNumber(parameters['screenHeight'], 900);
    var renderingMode = parameters['renderingMode'].toLowerCase();
    var alwaysDash = parameters['alwaysDash'].toLowerCase() === 'on';
    var windowWidthTo = toNumber(parameters['changeWindowWidthTo'], 0);
    var windowHeightTo = toNumber(parameters['changeWindowHeightTo'], 0);

    var windowWidth;
    var windowHeight;

    if(windowWidthTo){
        windowWidth = windowWidthTo;
    }else if(screenWidth !== SceneManager._screenWidth){
        windowWidth = screenWidth;
    }

    if(windowHeightTo){
        windowHeight = windowHeightTo;
    }else if(screenHeight !== SceneManager._screenHeight){
        windowHeight = screenHeight;
    }

    ImageCache.limit = cacheLimit * 1000 * 1000;
    SceneManager._screenWidth = screenWidth;
    SceneManager._screenHeight = screenHeight;
    SceneManager._boxWidth = screenWidth;
    SceneManager._boxHeight = screenHeight;

    SceneManager.preferableRendererType = function() {
        if (Utils.isOptionValid('canvas')) {
            return 'canvas';
        } else if (Utils.isOptionValid('webgl')) {
            return 'webgl';
        } else if (renderingMode === 'canvas') {
            return 'canvas';
        } else if (renderingMode === 'webgl') {
            return 'webgl';
        } else {
            return 'auto';
        }
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        if (config['alwaysDash'] === undefined) {
            this.alwaysDash = alwaysDash;
        }
    };

    var _SceneManager_initNwjs = SceneManager.initNwjs;
    SceneManager.initNwjs = function() {
        _SceneManager_initNwjs.apply(this, arguments);

        if (Utils.isNwjs() && windowWidth && windowHeight) {
            var dw = windowWidth - window.innerWidth;
            var dh = windowHeight - window.innerHeight;
            window.moveBy(-dw / 2, -dh / 2);
            window.resizeBy(dw, dh);
        }
    };

    // Plugin Command - Register the command in Game_Interpreter
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        if (command === 'screen_resize') {
            var width = 0;
            var height = 0;
            var mode = args[0].toLowerCase();

            // Size adjustments: Manually adding correction values
            var correctionX = 16;  // Adjust this value to match the actual window size
            var correctionY = 16;  // Adjust this value to match the actual window size

            switch (mode) {
                case '1280x720':
                    width = 1280 + correctionX;  // Apply correction for width
                    height = 743 + correctionY;  // Apply correction for height
                    break;
                case '1600x900':
                    width = 1600 + correctionX;  // Apply correction for width
                    height = 923 + correctionY;  // Apply correction for height
                    break;
                case '1920x1080':
                    width = 1798 + correctionX;  // Apply correction for width
                    height = 1080 + correctionY;  // Apply correction for height
                    break;
                case 'fullscreen':  // フルスクリーンとウィンドウモードを切り替え
                    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
                        // フルスクリーン解除
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        }
                    } else {
                        // フルスクリーンに切り替え
                        var docElm = document.documentElement;
                        if (docElm.requestFullscreen) {
                            docElm.requestFullscreen();
                        } else if (docElm.mozRequestFullScreen) {
                            docElm.mozRequestFullScreen();
                        } else if (docElm.webkitRequestFullscreen) {
                            docElm.webkitRequestFullscreen();
                        } else if (docElm.msRequestFullscreen) {
                            docElm.msRequestFullscreen();
                        }
                    }
                    return;
                default:
                    console.log("Invalid screen_resize command.");d
                    return;
            }

            // ウィンドウリサイズ後に、表示領域のサイズを正確に設定
            window.resizeTo(width, height);

            SceneManager._screenWidth = width;
            SceneManager._screenHeight = height;
            SceneManager._boxWidth = width;
            SceneManager._boxHeight = height;
        }
    };

})();
