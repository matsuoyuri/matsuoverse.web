# MATSUOVERSE Catalog

GitHub Pages用のシンプルなカタログサイトです。

## 使い方

1. このフォルダの中身をGitHubリポジトリにアップロードします。
2. `images` フォルダに画像を入れます。
3. `script.js` の `catalogItems` を編集します。
4. GitHub Pagesを有効化します。

## 画像の差し替え

最初は仮のSVG画像が入っています。
本番画像に差し替える場合は、`images` フォルダに画像を入れて `script.js` の `image` を変更してください。

例:

```js
image: "images/simple-ribbon-stage.jpg"
```

## GitHub Pages

Repository Settings → Pages → Deploy from a branch → main / root → Save
