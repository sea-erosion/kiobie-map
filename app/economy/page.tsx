import EconomyCharts from "@/components/EconomyCharts";
export const metadata = { title: "経済損失 | 大分 キオビエダシャクマップ" };

export default function Economy() {
  return (
    <main className="page">
      <h1>経済損失</h1>
      <p>キオビエダシャクの被害額について、大分県の公式な統計は確認できていません。そこで、このページでは<strong>投稿データの推移</strong>と、<strong>被害額の試算</strong>を示します。</p>
      <EconomyCharts />
    </main>
  );
}
