# noaa.jp 新サイト セットアップ手順（Cloudflare Pages版）

## 構成
- `public/` サイトの中身（すべてのページ・画像・CSS）
- `functions/api/contact.js` お問い合わせフォームの送信を受け取り、メール通知を送るPages Function
- `wrangler.toml` Cloudflareへの設定ファイル

Pagesプロジェクトの「ビルド出力ディレクトリ」を `public` に設定してください。
`functions/` はリポジトリのルート直下に置く必要があります（`public` の中ではありません）。

## 1. Cloudflare Pagesでの設定確認
- ビルドコマンド：空欄のままでOK（静的ファイルなのでビルド不要）
- ビルド出力ディレクトリ：`public`

## 2. お問い合わせのメール通知（Cloudflare Email Routing）
1. Cloudflareダッシュボード → 対象ドメイン → 「Email」→「Email Routing」を有効化
2. 通知を受け取りたいアドレス（例: `info@noaa.jp`）を「送信先アドレス」として登録・認証
3. Pagesプロジェクトの設定で、`send_email` バインディング（`SEND_EMAIL`）を追加
   （ダッシュボードの「Settings」→「Functions」→「Bindings」から追加できます。
   `wrangler.toml` に書いてある内容と同じ設定です）
4. `CONTACT_FROM_ADDRESS` / `CONTACT_TO_ADDRESS` は実際に使うアドレスに書き換える

## 3. lp.noaa.jp をカスタムドメインにする
Cloudflare Pagesのカスタムドメインは、ドメインのネームサーバーがCloudflareに
なくても、CNAMEレコード1本で設定できます。

1. Pagesプロジェクト → 「Custom domains」→「Set up a custom domain」で
   `lp.noaa.jp` を入力
2. Cloudflareが「このCNAMEを設定してください」という指示を出します
   （例：`lp` → `newnoaasite2.pages.dev`）
3. 今 noaa.jp を管理している会社（お名前.comなど）のDNS設定画面で、
   `lp` というホスト名にCNAMEレコードを追加し、指示された値を設定する
4. 反映後、Cloudflare側で自動的にSSL証明書が発行され、
   `https://lp.noaa.jp` でアクセスできるようになります

noaa.jp本体のネームサーバーには一切触れません。

## 4. お知らせ・ユーザーの声の編集画面（Decap CMS）
`/admin/` にアクセスすると編集画面が開きます。GitHubと直接連携する仕組みのため、
次の準備が必要です（担当者が決まってから進めればOKです）。

1. 編集担当者がGitHubアカウントを用意する
2. GitHub上でOAuth Appを作成する
3. Decap CMSのGitHub認証を仲介する小さなWorkerを別途用意する
4. `public/admin/config.yml` の `repo` と `base_url` を実際の値に書き換える
