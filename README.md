# browser-vim
ブラウザ上でVimを再現しながらフロントエンドを学習するプロジェクト

## 特徴
ブラウザ上で動作する、Vim ライクなテキストエディタのサブセット実装。
ローカルサーバーを必要とせず、ファイルを直接開くだけで動作する軽量な設計を特徴としています。

- Server-less: HTML ファイルをダブルクリックするだけで即座に起動
- Modal Editing: NORMAL, INSERT, VISUAL モードの切り替えをサポート
- Vim-like Display: ハイブリッド行番号表示（number + relativenumber）の実装
- Readable Code: 全関数に JSDoc を付与し、役割ごとにファイルを分離

## ディレクトリ構成

```text
browser-vim/
├── index.html     # エントリポイント
├── css/
│   ├── reset.css  # スタイルリセット
│   └── style.css  # エディタのメインスタイル
└── src/
    ├── state.js    # 共有状態（データ）の管理
    ├── helper.js   # 計算および補正ロジック
    ├── render.js   # DOM 描画制御
    ├── keyboard.js # キー入力およびモード制御
    └── main.js     # イベント登録・初期化
```

## 使い方
1. 本リポジトリをダウンロード
2. `index.html` をブラウザで開く
