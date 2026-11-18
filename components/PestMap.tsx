"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type {} from "leaflet.markercluster"; // 型だけ読み込む（本体はブラウザ側で読む）
import { OITA_RINGS } from "@/lib/oita-area";
import type { Map as LMap, Marker, LayerGroup } from "leaflet";
import { supabase } from "@/lib/supabase";
import { inOita, OITA_CENTER, OITA_MAX_BOUNDS, STAGES, STAGE_SHORT, type Sighting, type Stage } from "@/lib/oita";

type Leaflet = typeof import("leaflet");
type GeoHit = { title: string; lat: number; lng: number };

export default function PestMap() {
  // --- 画面の状態（stateが変わると画面が自動で描き直される） ---
  const [rows, setRows] = useState<Sighting[]>([]);
  const [days, setDays] = useState(30);
  const [stage, setStage] = useState<Stage>("larva");
  const [memo, setMemo] = useState("");
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<GeoHit[]>([]);
  const [msg, setMsg] = useState("");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(true); // 操作パネルの開閉（最初は開いている）

  // --- 地図まわりの部品（ref＝再描画しても保持される入れ物） ---
  const box = useRef<HTMLDivElement>(null);
  const L = useRef<Leaflet | null>(null);
  const map = useRef<LMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const draft = useRef<Marker | null>(null);
  const lastPost = useRef(0);

  const toast = useCallback((t: string) => { setMsg(t); setTimeout(() => setMsg(""), 3000); }, []);

  const icon = (cls: string, txt: string) =>
    L.current!.divIcon({ className: "", html: `<div class="pin ${cls}"><span>${txt}</span></div>`, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -34] });

  // 黒いピン（これから立てる場所）を置く
  const setDraft = useCallback((lat: number, lng: number, zoom?: number) => {
    if (!inOita(lat, lng)) return toast("大分県内（地図の明るい範囲）を指定してください");
    if (draft.current) draft.current.setLatLng([lat, lng]);
    else {
      draft.current = L.current!.marker([lat, lng], { draggable: true, icon: icon("draft", "＋") }).addTo(map.current!);
      draft.current.on("dragend", () => {
        const p = draft.current!.getLatLng();
        if (!inOita(p.lat, p.lng)) { toast("県外には置けません"); draft.current!.setLatLng([lat, lng]); }
      });
    }
    map.current!.setView([lat, lng], zoom ?? Math.max(map.current!.getZoom(), 15));
  }, [toast]); // eslint-disable-line react-hooks/exhaustive-deps

  // ① 最初の1回だけ：地図を作る（leafletはブラウザ専用なので、ここで読み込む）
  useEffect(() => {
    let dead = false;
    (async () => {
      const leaflet = (await import("leaflet")).default;
      // markercluster は window.L を探して自分を登録するので、先に渡してから読み込む
      (window as unknown as { L: typeof leaflet }).L = leaflet;
      await import("leaflet.markercluster");
      if (dead || !box.current) return;
      L.current = leaflet;
      const m = leaflet.map(box.current, { zoomControl: false, minZoom: 8, maxBounds: OITA_MAX_BOUNDS, maxBoundsViscosity: 1 }).setView(OITA_CENTER, 9);
      // 国土地理院タイル（無料・キー不要）
      leaflet.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
        maxZoom: 18, attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
      }).addTo(m);
      // 県外を暗くして、投稿できる範囲（大分県）だけ明るく見せる
      const world: [number, number][] = [[-85, -180], [-85, 180], [85, 180], [85, -180]];
      leaflet.polygon([world, ...OITA_RINGS], { stroke: false, fillColor: "#1b1a22", fillOpacity: 0.45, interactive: false }).addTo(m);
      leaflet.polygon(OITA_RINGS, { color: "#2d2140", weight: 2, dashArray: "6 4", fill: false, interactive: false }).addTo(m);
      leaflet.control.zoom({ position: "topright" }).addTo(m);
      // 近くのピン・同じ場所のピンを1つにまとめ、件数の数字を表示する
      layer.current = leaflet.markerClusterGroup({
        maxClusterRadius: 40,          // この距離（px）以内のピンをまとめる
        showCoverageOnHover: false,
        iconCreateFunction: (c) => {
          const n = c.getChildCount();
          return icon(n > 99 ? "count long" : "count", String(n));
        },
      }).addTo(m);
      m.on("click", (e) => setDraft(e.latlng.lat, e.latlng.lng, m.getZoom()));
      map.current = m;
      setReady(true);
    })();
    return () => { dead = true; map.current?.remove(); map.current = null; draft.current = null; };
  }, [setDraft]);

  // ② DBから投稿を読む
  const load = useCallback(async () => {
    const { data, error } = await supabase.from("sightings").select("*").order("created_at", { ascending: false }).limit(1000);
    if (error) { console.error(error); return toast(`ピンの読み込みに失敗しました（${error.code ?? ""} ${error.message}）`); }
    setRows(data as Sighting[]);
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  // ③ rows や期間が変わるたびに、ピンを描き直す
  useEffect(() => {
    if (!ready || !layer.current) return;
    layer.current.clearLayers();
    const since = days ? Date.now() - days * 86400000 : 0;
    rows.filter((r) => new Date(r.created_at).getTime() >= since).forEach((r) => {
      // メモ欄に変なHTMLを書かれても動かないよう、textContent で組み立てる
      const el = document.createElement("div");
      const h = document.createElement("strong"); h.textContent = `🐛 ${STAGE_SHORT[r.stage]}`;
      const d = document.createElement("div"); d.textContent = new Date(r.created_at).toLocaleString("ja-JP");
      el.append(h, d);
      if (r.memo) { const n = document.createElement("div"); n.textContent = r.memo; el.append(n); }
      L.current!.marker([r.lat, r.lng], { icon: icon("", "🐛") }).bindPopup(el).addTo(layer.current!);
    });
  }, [rows, days, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeOnMobile = () => { if (window.matchMedia("(max-width:760px)").matches) setOpen(false); };

  // 現在地
  const useGeo = () => {
    if (!navigator.geolocation) return toast("この端末は位置情報に対応していません");
    toast("現在地を取得中…");
    navigator.geolocation.getCurrentPosition(
      (p) => { setDraft(p.coords.latitude, p.coords.longitude); closeOnMobile(); },
      () => toast("現在地を取得できませんでした。位置情報を許可してください"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 住所検索（国土地理院API・無料・キー不要）
  const geocode = async (text: string): Promise<GeoHit[]> => {
    const res = await fetch("https://msearch.gsi.go.jp/address-search/AddressSearch?q=" + encodeURIComponent(text));
    const json: { properties: { title: string }; geometry: { coordinates: [number, number] } }[] = await res.json();
    return json.map((f) => ({ title: f.properties.title, lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] })).filter((h) => inOita(h.lat, h.lng));
  };
  const search = async () => {
    const t = q.trim();
    if (!t) return;
    try {
      let list = await geocode(t);
      if (!list.length && !t.includes("大分")) list = await geocode("大分県" + t); // 県名を補って再検索
      if (!list.length) return toast("大分県内で見つかりませんでした");
      setHits(list.slice(0, 5));
    } catch { toast("検索に失敗しました。時間をおいて再度お試しください"); }
  };

  // 投稿
  const post = async () => {
    if (!draft.current) return toast("先に場所を指定してください");
    if (Date.now() - lastPost.current < 10000) return toast("連続投稿はできません。少し待ってください");
    const p = draft.current.getLatLng();
    // 小数3桁＝約100m単位に丸めて保存（プライバシー対策）。丸めたあとの位置で範囲を判定する
    const lat = Math.round(p.lat * 1000) / 1000, lng = Math.round(p.lng * 1000) / 1000;
    if (!inOita(lat, lng)) return toast("県境に近すぎて登録できません。少し内側に動かしてください");
    const { error } = await supabase.from("sightings").insert({ stage, lat, lng, memo: memo.trim() || null });
    if (error) { console.error(error); return toast(`投稿に失敗しました（${error.code ?? ""} ${error.message}）`); }
    lastPost.current = Date.now();
    setMemo(""); draft.current.remove(); draft.current = null;
    toast("ピンを立てました");
    load();
  };

  const shown = rows.filter((r) => !days || new Date(r.created_at).getTime() >= Date.now() - days * 86400000).length;

  return (
    <div className="app">
      <aside id="panel" className={"side" + (open ? "" : " closed")}>
        <button className="toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="panel-body" aria-label={open ? "操作パネルを閉じる" : "操作パネルを開く"}>
          {open ? "◀" : "▶"}
        </button>
        {/* inert：閉じている間は、中の入力欄にキーボードやスクリーンリーダーで入れないようにする */}
        <div id="panel-body" className="side-body" inert={!open}>
        <h2>1. 場所を決める</h2>
        <button className="ghost wide" onClick={useGeo}>📍 現在地を使う</button>
        <label htmlFor="q">住所で探す</label>
        <div className="row">
          <input id="q" value={q} placeholder="例：大分市府内町" onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
          <button onClick={search} style={{ flex: "0 0 64px" }}>検索</button>
        </div>
        <ul className="results">
          {hits.map((h, i) => (
            <li key={i}><button onClick={() => { setDraft(h.lat, h.lng); setHits([]); closeOnMobile(); }}>{h.title}</button></li>
          ))}
        </ul>
        <p className="hint">地図をクリックしても指定できます。黒いピンはドラッグで微調整できます。地図の暗い部分（県外）には置けません。</p>

        <h2>2. 見かけたものを投稿</h2>
        <label htmlFor="stage">何を見かけた？</label>
        <select id="stage" value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
          {Object.entries(STAGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label htmlFor="memo">メモ（200字まで・任意）</label>
        <textarea id="memo" rows={3} maxLength={200} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="例：生垣のイヌマキに幼虫が多数" />
        <button className="wide" style={{ marginTop: 10 }} onClick={post}>この場所にピンを立てる</button>
        <p className="hint">位置は約100m単位に丸めて保存されます。個人名や詳しい住所はメモに書かないでください。</p>

        <h2>表示期間</h2>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="表示期間">
          <option value={7}>直近7日</option><option value={30}>直近30日</option><option value={90}>直近90日</option><option value={0}>すべて</option>
        </select>
        <p className="hint">表示中：{shown}件。数字のピンは、まとまっている件数です。タップすると拡大・展開できます。</p>
      </div>
      </aside>
      <div ref={box} className="map" />
      {msg && <div className="toast" role="status">{msg}</div>}
    </div>
  );
}
