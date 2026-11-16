// 大分県のおおよその範囲。これより外にはピンを立てられない
export const OITA = { south: 32.7, north: 33.8, west: 130.8, east: 132.2 };
export const OITA_CENTER: [number, number] = [33.2382, 131.6126];
export const inOita = (lat: number, lng: number) =>
  lat >= OITA.south && lat <= OITA.north && lng >= OITA.west && lng <= OITA.east;

export type Stage = "adult" | "larva" | "damage";
export const STAGES: Record<Stage, string> = { adult: "成虫（黒地に黄色い帯の蛾）", larva: "幼虫（シャクトリムシ）", damage: "食害（葉が食べられている）" };
export const STAGE_SHORT: Record<Stage, string> = { adult: "成虫", larva: "幼虫", damage: "食害" };

export type Sighting = { id: number; stage: Stage; lat: number; lng: number; memo: string | null; created_at: string };
