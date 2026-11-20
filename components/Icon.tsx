import { svgString, type IconName } from "@/lib/icons";

// 線アイコンを表示する部品。例：<Icon name="locate" size={20} />
// 中身は自分で用意した固定のSVGだけなので、dangerouslySetInnerHTML でも安全
export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <span className="icon" dangerouslySetInnerHTML={{ __html: svgString(name, size) }} />;
}
