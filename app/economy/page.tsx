import EconomyCharts from "@/components/EconomyCharts";
import { pageMeta } from "@/lib/site";
export const metadata = pageMeta("経済損失", "キオビエダシャクによるイヌマキ被害の投稿件数の推移と、植え替え費用をもとにした被害額の試算を見られます。", "/economy");

export default function Economy() {
  return (
    <main className="page">
      <h1>経済損失</h1>
      <p>キオビエダシャクの被害額について、大分県の公式な統計は確認できていません。そこで、このページでは<strong>投稿データの推移</strong>と、<strong>被害額の試算</strong>を示します。</p>
      <EconomyCharts />
    </main>
  );
}
