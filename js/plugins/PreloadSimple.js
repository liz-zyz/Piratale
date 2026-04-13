/*:
 * @plugindesc 指定した画像をゲーム開始時にプリロードするプラグイン
 * @author GPT
 */

(function () {
  const preloadList = [
    { folder: 'img/characters/', name: 'Enemy_Bee' },
    { folder: 'img/characters/', name: 'Enemy_Skeleton' },
    { folder: 'img/characters/', name: 'Enemy_Treant' },
    { folder: 'img/animations/', name: 'player_up_slash' }
  ];

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    console.log('画像のプリロードを開始します...');
    this.preloadImages(() => {
      console.log('全ての画像のプリロードが完了しました');
      _Scene_Boot_start.call(this);
    });
  };

  Scene_Boot.prototype.preloadImages = function (onComplete) {
    let loadedCount = 0;
    const total = preloadList.length;

    preloadList.forEach((entry, index) => {
      const img = new Image();
      img.src = entry.folder + entry.name + '.png';

      img.onload = () => {
        console.log(`✅ ${entry.folder}${entry.name} をプリロードしました`);
        if (++loadedCount >= total) {
          onComplete();
        }
      };

      img.onerror = () => {
        console.warn(`❌ ${entry.folder}${entry.name} のプリロードに失敗しました`);
        if (++loadedCount >= total) {
          onComplete();
        }
      };
    });
  };
})();
