# TCSAS 公式ミニプログラム・デモ

[English](README.md) | 日本語

Tencent Cloud Super App as a Service（TCSAS）は、ミニプログラムの**開発・テスト・デプロイ・運用**と**コンテナ技術**の知見を統合し、企業のお客様にライフサイクル全体を支える総合プラットフォームを提供します。

主なサービスには、**開発者向け IDE**、**プレビュー・デバッグ用アプリ**、**Android/iOS コンテナ SDK**、および**ミニプログラムのリリース・管理プラットフォーム**が含まれます。これにより、企業や団体は**低コストかつ高効率**でミニプログラムサービスを構築・運用できます。

TCSAS は Tencent のミニプログラム技術フレームワークに基づき、WeChat ミニプログラムの開発仕様・標準に完全準拠しており、自社アプリへミニプログラムを組み込むだけでなく、自社エコシステム内で独自のミニプログラム環境を構築することも可能です。

## 💻 IDE ダウンロード

Windows 向けの TCSAS Devtools（IDE）は GitHub Releases から取得できます：

➡️ https://github.com/yuejiangli/mini-programs/releases

`.exe` をリポジトリに直接コミットしない理由：
* clone サイズが肥大化する
* 履歴に残り続け削除できない
* リリース資産 (Release Asset) の方が配布・バージョン管理が簡単

各リリースには以下のファイルが含まれる場合があります：
* `TCSAS-Devtools_x64_<version>.exe`
* `TCSAS-Devtools_x64_<version>.exe.sha256`（整合性検証用ハッシュ）

ダウンロード後の検証（任意）：
```
sha256sum TCSAS-Devtools_x64_<version>.exe
```
出力結果と `.sha256` ファイル内容を比較してください。

---

## 📦 公式デモの内容

* **miniprogram**: API とコンポーネントを多数含む公式サンプルデモ

---

## 📂 ディレクトリ構成

| パス                                         | 説明                  |
| ------------------------------------------ | ------------------- |
| [miniprogram/](miniprogram/)               | メインデモ（公式デモ）         |
| [e-commerce/](e-commerce/)                 | EC（電子商取引）ミニプログラム    |
| [calendar-todo-list/](calendar-todo-list/) | カレンダー ToDo リスト      |
| [taxi/](taxi/)                             | タクシー配車ミニプログラム       |
| [coffee/](coffee/)                         | コーヒー注文ミニプログラム       |
| [hotel/](hotel/)                           | ホテル予約ミニプログラム        |
| [MPFeatureDemos/](MPFeatureDemos/)         | 各種ミニプログラム機能のデモ      |
| [README.md](README.md)                     | 英語版 README          |
| [README.ja.md](README.ja.md)               | 日本語版 README（このファイル） |

---

## 📖 ドキュメント・サポート

* [TCSAS公式ドキュメント](https://www.tencentcloud.com/document/product/1219/57614)
* サンプルコードに不具合があれば [Issue](../../issues) での報告を歓迎します

---
