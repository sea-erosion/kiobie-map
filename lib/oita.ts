// 大分県のおおよその範囲。これより外にはピンを立てられない
export const OITA = { south: 32.7, north: 33.8, west: 130.8, east: 132.2 };
export const OITA_CENTER: [number, number] = [33.2382, 131.6126];
import { OITA_RINGS } from "./oita-area";

// 点が輪っかの内側にあるか（レイキャスティング法：点から東へ線を伸ばし、輪郭と交わる回数が奇数なら内側）
function inRing(ring: [number, number][], lat: number, lng: number) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [latI, lngI] = ring[i], [latJ, lngJ] = ring[j];
    if ((latI > lat) !== (latJ > lat) && lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI) inside = !inside;
  }
  return inside;
}

// 大分県の形（自由形）の中にあるか。まず四角い範囲でざっくり除外してから、輪郭で判定する
export const inOita = (lat: number, lng: number) =>
  lat >= OITA.south && lat <= OITA.north && lng >= OITA.west && lng <= OITA.east &&
  OITA_RINGS.some((r) => inRing(r, lat, lng));

// 地図のスクロール範囲（県の輪郭の外側に少しだけ余白）
const lats = OITA_RINGS.flat().map((p) => p[0]), lngs = OITA_RINGS.flat().map((p) => p[1]);
export const OITA_MAX_BOUNDS: [[number, number], [number, number]] = [
  [Math.min(...lats) - 0.2, Math.min(...lngs) - 0.2],
  [Math.max(...lats) + 0.2, Math.max(...lngs) + 0.2],
];

export type Stage = "adult" | "larva" | "damage";
export const STAGES: Record<Stage, string> = { adult: "成虫（黒地に黄色い帯の蛾）", larva: "幼虫（シャクトリムシ）", damage: "食害（葉が食べられている）" };
export const STAGE_SHORT: Record<Stage, string> = { adult: "成虫", larva: "幼虫", damage: "食害" };

export type Sighting = { id: number; stage: Stage; lat: number; lng: number; memo: string | null; created_at: string };
