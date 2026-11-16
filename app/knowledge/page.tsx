// サーバー側で描画される普通のページ（状態もJSも不要）
import { pageMeta } from "@/lib/site";
export const metadata = pageMeta("キオビエダシャクとは", "キオビエダシャクの見分け方（黒紫に黄色い帯の蛾・オレンジ色の幼虫）、イヌマキへの被害、見つけたときの対処法をまとめています。", "/knowledge");

export default function Knowledge() {
  return (
    <main className="page">
      <h1>キオビエダシャクとは</h1>
      <p>東南アジア原産のガの一種で、庭木や生垣に使われる<strong>イヌマキ・ナギ・ラカンマキ</strong>の葉を食べる害虫です。大分県内でも目撃が相次いでいると報じられています。</p>

      <h2>見分け方</h2>
      <div className="box"><strong>成虫</strong>：光沢のある黒紫色の羽に、太い黄色の帯。昼間に飛びます。開いた羽の幅は5cmほど。</div>
      <div className="box"><strong>幼虫</strong>：体長約5cmのシャクトリムシ。オレンジ・黒（灰）・黄色の模様があります。</div>

      <h2>どんな被害？</h2>
      <p>幼虫は食欲が旺盛で、大量発生するとイヌマキの葉を食べ尽くし、丸坊主にして枯らしてしまうことがあります。年に複数回発生するとされますが、時期は毎年決まっておらず、突発的に発生します。</p>

      <h2>見つけたら</h2>
      <div className="box"><strong>少数のとき</strong>：木を揺すって落ちた幼虫を拾い集めて捕殺します。</div>
      <div className="box"><strong>大発生のとき</strong>：登録のある薬剤を幼虫に散布します（成虫・卵・サナギには効きません）。使える薬剤は変わることがあるので、販売店や自治体で最新の登録情報とラベルを確認してください。散布前に近所へ声をかけ、風のない朝夕に行いましょう。</div>
      <p className="warn">このページは自治体などの公開情報をもとにした一般的な説明です。防除は自治体・専門業者・農業関係の窓口にも相談してください。</p>

      <h2>参考にした情報</h2>
      <ul>
        <li><a href="https://www.pref.kagoshima.jp/ad07/sangyo-rodo/rinsui/shinrin/hogo/kiobi.html">鹿児島県「キオビエダシャク」</a></li>
        <li><a href="https://www.city.kagoshima.lg.jp/faq-sangyo/seisanryutu/q6.html">鹿児島市 よくある質問</a></li>
        <li><a href="https://www.pref.okinawa.jp/_res/projects/default_project/_page_/001/010/958/02-02.pdf">沖縄県 病害虫資料（PDF）</a></li>
        <li><a href="https://www.oita-press.co.jp/1010000000/2026/07/24/JDC2026071602089">大分合同新聞「目撃相次ぐキオビエダシャク」</a></li>
      </ul>
    </main>
  );
}
