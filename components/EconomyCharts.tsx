"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { supabase } from "@/lib/supabase";

// 棒グラフを描く小さな部品（データが変わったら描き直す）
function Bar({ labels, data, label, color }: { labels: string[]; data: number[]; label: string; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = new Chart(ref.current!, {
      type: "bar",
      data: { labels, datasets: [{ label, data, backgroundColor: color }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
    });
    return () => c.destroy();
  }, [labels.join(), data.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  return <canvas ref={ref} height={130} aria-label={label} />;
}

export default function EconomyCharts() {
  // ① 投稿数の月別推移（本物のデータ）
  const [monthly, setMonthly] = useState<Record<string, number>>({});
  useEffect(() => {
    supabase.from("sightings").select("created_at").then(({ data }) => {
      const m: Record<string, number> = {};
      (data ?? []).forEach((r) => { const k = r.created_at.slice(0, 7); m[k] = (m[k] ?? 0) + 1; });
      setMonthly(m);
    });
  }, []);
  const months = Object.keys(monthly).sort();

  // ② 被害額の試算（数値は仮置き。自分で変えられる）
  const [trees, setTrees] = useState(100);      // 被害にあう可能性のある木の本数
  const [cost, setCost] = useState(30000);      // 1本を植え替えるのにかかる費用（円）
  const [rate, setRate] = useState(20);         // 枯死する割合（%）
  const total = Math.round(trees * cost * (rate / 100));
  const rates = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <>
      <section className="chartbox">
        <h2>投稿件数の月別推移（このサイトの実データ）</h2>
        {months.length ? <Bar labels={months} data={months.map((k) => monthly[k])} label="投稿件数" color="#f2b705" /> : <p>まだ投稿がありません。</p>}
        <p className="hint">投稿の多さは、発生の多さそのものではなく「気づいて投稿した人の数」でもあります。</p>
      </section>

      <section className="chartbox">
        <h2>被害額の試算（植え替え費用ベース）</h2>
        <p className="warn">下の初期値は<strong>仮の数字</strong>です。実際の見積りや調査に合わせて変えてください。</p>
        <div className="sliders">
          <label>対象の本数：{trees}本<input type="range" min={1} max={2000} value={trees} onChange={(e) => setTrees(+e.target.value)} /></label>
          <label>1本あたりの植え替え費用：{cost.toLocaleString()}円<input type="range" min={5000} max={200000} step={5000} value={cost} onChange={(e) => setCost(+e.target.value)} /></label>
          <label>枯死する割合：{rate}%<input type="range" min={0} max={100} value={rate} onChange={(e) => setRate(+e.target.value)} /></label>
        </div>
        <p className="big">試算：約 {total.toLocaleString()} 円</p>
        <Bar labels={rates.map((r) => r + "%")} data={rates.map((r) => Math.round(trees * cost * r / 100))} label="枯死割合ごとの被害額（円）" color="#2d2140" />
      </section>
    </>
  );
}
