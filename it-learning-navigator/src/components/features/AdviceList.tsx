import type { AdviceItem } from "@/types";

type Props = {
  items: AdviceItem[];
};

const PRIORITY_LABELS: Record<AdviceItem["priority"], string> = {
  high: "優先度 高",
  medium: "優先度 中",
  low: "優先度 低",
};

const PRIORITY_STYLES: Record<AdviceItem["priority"], string> = {
  high: "border-l-red-400 bg-red-50",
  medium: "border-l-yellow-400 bg-yellow-50",
  low: "border-l-green-400 bg-green-50",
};

const PRIORITY_LABEL_STYLES: Record<AdviceItem["priority"], string> = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-green-600",
};

export function AdviceList({ items }: Props) {
  return (
    <div className="flex flex-col gap-3" role="list" aria-label="学習アドバイス">
      {items.map((item, i) => (
        <div
          key={i}
          className={`rounded-lg border-l-4 px-4 py-3 ${PRIORITY_STYLES[item.priority]}`}
          role="listitem"
        >
          <p className={`text-xs font-semibold mb-1 ${PRIORITY_LABEL_STYLES[item.priority]}`}>
            【{PRIORITY_LABELS[item.priority]}】
          </p>
          <p className="text-sm font-medium">{item.topic}</p>
          <p className="text-xs text-muted-foreground mt-0.5">→ {item.comment}</p>
        </div>
      ))}
    </div>
  );
}
