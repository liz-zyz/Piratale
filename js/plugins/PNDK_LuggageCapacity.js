// --------------------------------------------------------------------------
// 
// PNDK_LuggageCapacity
// Copyright (c) 2016 PANDAKO
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// 
// --------------------------------------------------------------------------
/*:
 * @plugindesc This plugin sets weights for items.
 * @author PANDAKO
 *
 * @help
 * Meta tag:
 *   <weight:10>
 * 
 * Plugin Command:
 *   PNDK_LC getSurplusWeights [variable ID]
 *   PNDK_LC getAllItemWeights [variable ID]
 * 
 * Disclaimer:
 *   I will not be responsible for any accident or injures.
 * 
 * @param Carry point
 * @desc Max weights.
 * @default 1000
 * 
 * @param Excess handling
 * @desc Weight excess of drop items.
 * Discard, Choice
 * @default Discard
 * 
 * @param Default weight
 * @desc Default weight.
 * @default 10
 * 
 * @param Unit
 * @desc Unit for weight.
 * @default W
 * 
 * @param Attribute name
 * @desc Name for attribute.
 * @default Weights
 * 
 * @param Window layout in menu
 * @desc Layout of the weights window in menu.
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * 
 * @param Window opacity in menu
 * @desc Opacity of the weights window in menu.
 * 0～255
 * @default 255
 * 
 * @param Window layout in item window
 * @desc Layout of the weights window in menu.
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * 
 * @param Window opacity in item window
 * @desc Opacity of the weights window in menu.
 * 0～255
 * @default 255
 * 
 * @param Window layout in shop
 * @desc Layout of the weights window in shop.
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * 
 * @param Window opacity in shop
 * @desc Opacity of the weights window in shop.
 * 0～255
 * @default 255
 * 
 */
/*:ja
 * @plugindesc アイテムや武器・防具の所持できる数を重量（ポイント）制にします。
 * @author パンダコ
 *
 * @help
 * このプラグインを有効にすると、個々のアイテムや武器・防具（以下アイテム）に
 * 重さが設定できるようになり、パーティーは決められた総重量までしかアイテムを
 * 所持できなくなります。
 * 
 * ■重さの設定方法
 * アイテムのメモ欄に以下のようなメタタグを記入してください。
 * <weight:10>
 * 上記の場合、重さが10に設定されます。
 * 重さが設定されていないものは、パラメータで設定された Default weight の
 * 重さになります。
 * 
 * ■持てる重さの上限をイベントで変更したい時
 * パラメータの Carry point には制御文字が利用できるので、\V[1] などと
 * 設定すれば変数で上限を管理できます。
 * 
 * ■敵のドロップアイテムによる重量超過について
 * 敵のドロップアイテムにより重量超過した場合は、破棄するかアイテム画面を
 * 表示するかをパラメータの Excess handling で設定できます。
 * 初期値の Discard は破棄です。
 * Choice に設定すると重量超過した場合にのみ、戦闘終了後にアイテム画面が
 * 表示されるようになります。
 * ただし、このプラグイン単体ではアイテム画面から「捨てる」は行なえないので、
 * 別途アイテム画面で「捨てる」を可能にするプラグインが必要です。
 * 
 * ★「捨てる」を可能にするプラグインについて
 * フトコロさんの FTKR_ItemSubCommand プラグインによる「捨てる」に、いちおう
 * 対応しています。
 * なお、FTKR_ItemSubCommand プラグインは、このプラグインよりも先に
 * （プラグイン管理画面で上に）読み込まれている必要があります。
 * 
 * ■プラグインコマンド
 * ・所持できる残りの重量を変数0001へ代入します。
 *   PNDK_LC getSurplusWeights 1
 * 
 * ・所持しているアイテムの総重量を変数0007へ代入します。
 *   PNDK_LC getAllItemWeights 7
 * 
 * ■総重量ウィンドウの位置について
 * パラメータ Window layout in ○○ を以下の値にすることで、
 * 総重量ウィンドウの位置を変更できます。
 * 
 * Default        #初期位置（所持金の上）
 * TopLeft        #画面の左上
 * TopRight       #画面の右上
 * BottomLeft     #画面の左下
 * BottomRight    #画面の右下
 * 
 * ■仕様
 * ・メニュー画面とアイテム画面とショップ画面に重量ウィンドウが追加されます。
 * ・ショップ画面の商品選択時に対象の重さが表示されます。
 * ・ショップ画面の数量選択時に重さの小計が表示されます。
 * ・アイテム画面とショプ画面ではアイテムの説明欄が小さくなるので文字数に
 * 　注意してください。
 * ・装備しているものも総重量に含まれます。
 * ・控えメンバーの装備も総重量に含まれます。
 * ・「大事なもの」の重さも総重量に含まれます。
 * ・重さなし <weight:0> も可能です。
 * ・システムで定められた上限（通常は99個）以上には所持できません。
 * ・イベントでアイテムを入手した際、持ちきれないものは破棄されるので、
 * 　事前に残りの重量をチェックするなどして対応してください。
 * ・重量超過しているとアイテム画面を閉じることができなくなります。
 * 
 * ■更新履歴
 * Version:1.2.0［2017/10/15］
 * 敵ドロップアイテムにより重量オーバーした場合の処理を
 * 破棄か整理かを選択できる機能の追加。
 * 
 * Version:1.1.2［2017/10/14］
 * フトコロさんの FTKR_ItemSubCommand プラグインによる「捨てる」に対応。
 * 
 * Version:1.1.1［2017/10/14］
 * 装備をはずすと消えてしまうことがあるバグを修正。
 * アイテム画面に重量ウィンドウを追加。
 * 
 * Version:1.1.0［2016/11/11］
 * 総重量ウィンドウの位置と不透明度を選択できる機能を追加。
 * 
 * Version:1.0.0［2016/11/10］
 * 初版
 * 
 * ■ライセンス
 * Copyright (c) 2016 PANDAKO
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * 
 * [Blog : http://note.pandako.com/]
 * 
 * ■免責事項
 * このプラグインの利用により利用者または第三者に生じたいかなる損害や
 * 不利益も、このプラグインの開発者はその責任を負いません。
 * 
 * 
 * @param Carry point
 * @desc 所持できる総重量の上限。
 * 制御文字が利用できます。
 * @default 1000
 * 
 * @param Excess handling
 * @desc 敵ドロップアイテムにより重量超過した際の対応方法。
 * Discard, Choice
 * @default Discard
 * 
 * @param Default weight
 * @desc 重さの初期値。weight を設定していないアイテムや武器・防具はこの重さになります。
 * @default 10
 * 
 * @param Unit
 * @desc 重さの単位。
 * @default Ｗ
 * 
 * @param Attribute name
 * @desc 重さの用語。
 * @default 重さ
 * 
 * @param Window layout in menu
 * @desc メニュー画面での総重量ウィンドウの位置
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * 
 * @param Window opacity in menu
 * @desc メニュー画面での総重量ウィンドウの不透明度
 * 0～255（0 透明 ⇔ 255 不透明）
 * @default 255
 * 
 * @param Window layout in item
 * @desc アイテム画面での総重量ウィンドウの位置
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * 
 * @param Window opacity in item
 * @desc アイテム画面での総重量ウィンドウの不透明度
 * 0～255（0 透明 ⇔ 255 不透明）
 * @default 255
 * 
 * @param Window layout in shop
 * @desc ショップ画面での総重量ウィンドウの位置
 * Default, TopLeft, TopRight, BottomLeft, BottomRight
 * @default Default
 * 
 * @param Window opacity in shop
 * @desc ショップ画面での総重量ウィンドウの不透明度
 * 0～255（0 透明 ⇔ 255 不透明）
 * @default 255
 * 
 */

(function() {
	//プラグインマネージャーで設定されたパラメータを取得
	var parameters = PluginManager.parameters('PNDK_LuggageCapacity');
	
	//パラメータを変数へ
	var cp = parameters['Carry point'];
	var isChoice = parameters['Excess handling'] == "Choice";
	var defW = Number(parameters['Default weight']);
	var wUnit = parameters['Unit'];
	var wText = parameters['Attribute name'];
	var layoutMenu = parameters['Window layout in menu'];
	var opacityMenu = parseInt(parameters['Window opacity in menu'], 10);
	var layoutItem = parameters['Window layout in item'];
	var opacityItem = parseInt(parameters['Window opacity in item'], 10);
	var layoutShop = parameters['Window layout in shop'];
	var opacityShop = parseInt(parameters['Window opacity in shop'], 10);
	
	//最大積載量の取得
	function getCP() {
		return Number(Window_Base.prototype.convertEscapeCharacters(cp));
	}
	
	//それの重量
	function getWeight(item, amount){
		if (item) {
			return item.meta.weight !== undefined ? (item.meta.weight * amount) : defW * amount;
		}
		//itemがnullの場合もある（装備していない時や全部解除したときなど）
		return 0;
	}
	
	//総重量取得
	function getAllItemWeights() {
		var w = 0;
		//アイテム・武器・防具
		$gameParty.allItems().forEach(function(item){
			var n = $gameParty.numItems(item);
			w += getWeight(item, n);
		});
		//全アクターの装備品
		$gameParty.allMembers().forEach(function(actor) {
			actor.equips().forEach(function(item){
				w += getWeight(item, 1);
			});
    });
		return w;
	}
	
	//持てるかチェック
	function canHaveItem(item, amount) {
		return getCP() >= (getAllItemWeights() + getWeight(item, amount));
	}
	
	//余剰積載量
	function getSurplusCP() {
		return getCP() - getAllItemWeights();
	}
	
	//CPウィンドウ=====================================================================
	function Window_CP() {
		this.initialize.apply(this, arguments);
	}
	
	Window_CP.prototype = Object.create(Window_Base.prototype);
	Window_CP.prototype.constructor = Window_CP;
	
	Window_CP.prototype.initialize = function(x, y, w, h) {
		Window_Base.prototype.initialize.call(this, x, y, w, h);
		this.refresh();
	};

	Window_CP.prototype.refresh = function() {
		var x = this.textPadding();
		var width = this.contents.width - this.textPadding() * 2;
		this.contents.clear();
		this.drawCpValue(getAllItemWeights(), x, 0, width);
	};
	
	Window_Base.prototype.drawCpValue = function(value, x, y, width) {
		var unitWidth = this.textWidth(wUnit) + this.textPadding();
		var cpWidth = this.textWidth(getCP());
		var slashWidth = this.textWidth("／");
		var sCpWidth = width - (slashWidth + cpWidth + unitWidth);
		//
		this.resetFontSettings();
		//this.makeFontSmaller();
		this.drawText(value, x, y, sCpWidth, 'right');
		//
		this.changeTextColor(this.systemColor());
		this.drawText("／", (x + sCpWidth), y, slashWidth, 'right');
		//
		this.resetTextColor();
		this.drawText(getCP(), (x + sCpWidth + slashWidth), y, cpWidth, 'right');
		//
		this.changeTextColor(this.systemColor());
		this.drawText(wUnit, (x + sCpWidth + slashWidth + cpWidth), y, unitWidth, 'right');
	};
	
	//メニュー画面にCPウィンドウを追加---------------------------------------------------------------
	var _Scene_Menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		_Scene_Menu_create.call(this);
		//
		this.createCpWindow(layoutMenu, opacityMenu);
	};
	
	Scene_MenuBase.prototype.createCpWindow = function(layout, opacity) {
		var x = 0;
		var y = 0;
		var w = 240;
		var h = 240;
		//
		if (this._goldWindow) {
			//既に所持金ウィンドウがある場合はそれを基準とする
			x = this._goldWindow.x;
			y = this._goldWindow.y - this._goldWindow.height;
			w = this._goldWindow.width;
			h = this._goldWindow.height;
		} else {
			//所持金ウィンドウがない場合（item画面）はヘルプウィンドウを利用
			x = this._helpWindow.width;
			w = Graphics.boxWidth - this._helpWindow.width;
			h = this._helpWindow.fittingHeight(1);
			y = this._helpWindow.height - h;
		}
		//設定により書き換え
		if (layout == "TopLeft") {
			x = 0;
			y = 0;
		} else if (layout == "TopRight") {
			x = Graphics.boxWidth - w;
			y = 0;
		} else if (layout == "BottomLeft") {
			x = 0;
			y = Graphics.boxHeight - h;
		} else if (layout == "BottomRight") {
			x = Graphics.boxWidth - w;
			y = Graphics.boxHeight - h;
		}
		this._cpWindow = new Window_CP(x, y, w, h);
		this._cpWindow.opacity = opacity;
		this.addWindow(this._cpWindow);
	};
	
	//小さなヘルプウィンドウを作れるようにする---------------------------------------------------------------
	var _Window_Help_initialize = Window_Help.prototype.initialize;
	Window_Help.prototype.initialize = function(numLines, isShort) {
		if (isShort) {
			var width = Graphics.boxWidth - Window_Gold.prototype.windowWidth();
			var height = this.fittingHeight(numLines || 2);
			Window_Base.prototype.initialize.call(this, 0, 0, width, height);
			this._text = '';
		} else {
			_Window_Help_initialize.call(this, numLines);
		}
	};
	
	//shop画面のヘルプウィンドウを小さくする---------------------------------------------------------------
	Scene_Shop.prototype.createHelpWindow = function() {
		this._helpWindow = new Window_Help(2, true);
		this.addWindow(this._helpWindow);
	};

	//shop画面にCPウィンドウを追加---------------------------------------------------------------
	var _Scene_Shop_create = Scene_Shop.prototype.create;
	Scene_Shop.prototype.create = function() {
		_Scene_Shop_create.call(this);
		//
		this.createCpWindow(layoutShop, opacityShop);
	};
	
	//商品購入時の購入可能最大数取得を書き換え---------------------------------------------------------------
	var _Scene_Shop_maxBuy = Scene_Shop.prototype.maxBuy;
	Scene_Shop.prototype.maxBuy = function() {
		var r = _Scene_Shop_maxBuy.call(this);
		var w = getWeight(this._item, 1);
		if (w === 0) {
			return r;
		} else {
			return Math.min(r, Math.floor(getSurplusCP() / w));
		}
	};
	
	//商品選択時の購入可否判定を書き換え---------------------------------------------------------------
	var _Window_ShopBuy_isEnabled = Window_ShopBuy.prototype.isEnabled;
	Window_ShopBuy.prototype.isEnabled = function(item) {
		return _Window_ShopBuy_isEnabled.call(this, item) && canHaveItem(item, 1);
	};
	
	//売買時にCPウィンドウを更新するよう書き換え---------------------------------------------------------------
	var _Scene_Shop_onNumberOk = Scene_Shop.prototype.onNumberOk;
	Scene_Shop.prototype.onNumberOk = function() {
		_Scene_Shop_onNumberOk.call(this);
		//
		this._cpWindow.refresh();
	};
	
	//数量選択画面に重さを追加---------------------------------------------------------------
	var _Window_ShopNumber_refresh = Window_ShopNumber.prototype.refresh;
	Window_ShopNumber.prototype.refresh = function() {
		_Window_ShopNumber_refresh.call(this);
		//
		this.drawWeight();
	};
	
	Window_ShopNumber.prototype.drawWeight = function() {
		var total = getWeight(this._item, this._number);
		var width = this.contentsWidth() - this.textPadding();
		//drawCurrencyValue を代用
		this.drawCurrencyValue(total, wUnit, 0, this.weightY(), width);
	};
	
	Window_ShopNumber.prototype.weightY = function() {
		return Math.round(this.contentsHeight() / 2 - this.lineHeight() * 0.5);
	};
	
	//shopのステータスウィンドウに重さを追加---------------------------------------------------------------
	var _Window_ShopStatus_drawPossession = Window_ShopStatus.prototype.drawPossession;
	Window_ShopStatus.prototype.drawPossession = function(x, y) {
		_Window_ShopStatus_drawPossession.call(this, x, y);
		//
		var width = this.contents.width - (this.textPadding() + x);
		var wTextWidth = this.textWidth(wText);
		var wY = this.lineHeight();
		this.changeTextColor(this.systemColor());
		this.drawText(wText, x, wY, wTextWidth);
		this.resetTextColor();
		this.drawText(getWeight(this._item, 1), (x + wTextWidth), wY, (width - wTextWidth), 'right');
	};
	
	//item画面のヘルプウィンドウを小さくする---------------------------------------------------------------
	Scene_Item.prototype.createHelpWindow = function() {
		this._helpWindow = new Window_Help(2, true);
		this.addWindow(this._helpWindow);
	};

	//item画面にCPウィンドウを追加---------------------------------------------------------------
	//Itemウィンドウの次にCPウィンドウを追加したいのでここで実行
	var _Scene_Item_createItemWindow = Scene_Item.prototype.createItemWindow;
	Scene_Item.prototype.createItemWindow = function() {
		_Scene_Item_createItemWindow.call(this);
		//
		this.createCpWindow(layoutItem, opacityItem);
	}
	
	//アイテム使用時にCPウィンドウを更新---------------------------------------------------------------
	var _Scene_Item_useItem = Scene_Item.prototype.useItem;
	Scene_Item.prototype.useItem = function() {
		_Scene_Item_useItem.call(this);
		//
		this._cpWindow.refresh();
	};
	
	//重量オーバー時にはitem画面を閉じられないようにする---------------------------------------------------------------
	Window_ItemCategory.prototype.processCancel = function() {
		if (getSurplusCP() < 0) {
			//ブザー
			SoundManager.playBuzzer();
		} else {
			Window_Selectable.prototype.processCancel.call(this);
		}
	};
	
	//アイテム増減処理の書き換え---------------------------------------------------------------
	var _Game_Party_gainItem = Game_Party.prototype.gainItem;
	Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
		if (amount > 0) {
			if (canHaveItem(item, amount)) {
				//増減可能
				_Game_Party_gainItem.call(this, item, amount, includeEquip);
			}
		} else {
			_Game_Party_gainItem.call(this, item, amount, includeEquip);
		}
	};
	
	//装備変更時に不正に重量オーバーするのを回避---------------------------------------------------------------
	var _Game_Actor_tradeItemWithParty = Game_Actor.prototype.tradeItemWithParty;
	Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
		if (newItem && !$gameParty.hasItem(newItem)) {
			return false;
		} else {
			//パーティー内トレード時には重量判定を行わない
			_Game_Party_gainItem.call($gameParty, oldItem, 1);
			//$gameParty.gainItem(oldItem, 1);
			$gameParty.loseItem(newItem, 1);
			return true;
		}
	};
	
	//設定によっては戦闘によるドロップアイテムには重量判定を行わなず強制取得する---------------------------------------------------------------
	BattleManager.gainDropItems = function() {
		var items = this._rewards.items;
		items.forEach(function(item) {
			if (isChoice) {
				_Game_Party_gainItem.call($gameParty, item, 1);
			} else {
				$gameParty.gainItem(item, 1);
			}
		});
	};
	
	//戦闘終了時に重量オーバーしていたらアイテムウィンドウを表示---------------------------------------------------------------
	BattleManager.updateBattleEnd = function() {
		if (this.isBattleTest()) {
			AudioManager.stopBgm();
			SceneManager.exit();
		} else if (!this._escaped && $gameParty.isAllDead()) {
			if (this._canLose) {
				$gameParty.reviveBattleMembers();
				SceneManager.pop();
			} else {
				SceneManager.goto(Scene_Gameover);
			}
		} else {
			//重量オーバー時のみアイテムウィンドウを表示
			if (getSurplusCP() < 0) {
				SceneManager.goto(Scene_Item);
			} else {
				SceneManager.pop();
			}
		}
		this._phase = null;
	};
	
	//フトコロさんのプラグイン FTKR_ItemSubCommand.js がある場合の処理===================================================================
	//捨てた時にもCPウィンドウを更新
	var FTKR_parameters = PluginManager.parameters('FTKR_ItemSubCommand');
	if (FTKR_parameters['Command List']) {
		var _Scene_Item_itemDiscard = Scene_Item.prototype.itemDiscard;
		Scene_Item.prototype.itemDiscard = function() {
			_Scene_Item_itemDiscard.call(this);
			//
			this._cpWindow.refresh();
		};
	}
	
	//プラグインコマンドの追加===================================================================
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		//
		if (command === 'PNDK_LC') {
			switch (args[0]) {
				case 'getSurplusWeights':
					$gameVariables.setValue(parseInt(args[1], 10), getSurplusCP());
					break;
				case 'getAllItemWeights':
					$gameVariables.setValue(parseInt(args[1], 10), getAllItemWeights());
					break;
			}
		}
	};
	
})();