// 線アイコン（24x24の枠、線の太さ2、角は丸）の定義。絵文字の代わりに、ここから作る。
// 色は currentColor ＝ まわりの文字色に自動で合う。
const PATHS = {
  // 現在地（照準）
  locate: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
  // シャクトリムシ（体を弓なりに丸めた姿）
  caterpillar: '<circle cx="4" cy="18.5" r="2.1"/><circle cx="6.8" cy="12.8" r="2.1"/><circle cx="12" cy="10" r="2.1"/><circle cx="17.2" cy="12.8" r="2.1"/><circle cx="20" cy="18.5" r="2.1"/><path d="M19.2 16.2l-.7-2M21 16.3l1.2-1.8"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
} as const;

export type IconName = keyof typeof PATHS;

export const svgString = (name: IconName, size = 20) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]}</svg>`;
