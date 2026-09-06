// content/elastic.ts
import type { ElasticColorCode } from "@/types/config";

export interface ElasticColorDef {
  code: ElasticColorCode;
  name: string;
  hex: string;
  order: number;
}

export const elasticColors: Record<ElasticColorCode, ElasticColorDef> = {
  black:    { code: "black",    name: "Black",    hex: "#1C1917", order: 1 },
  brown:    { code: "brown",    name: "Brown",    hex: "#5C3A21", order: 2 },
  olive:    { code: "olive",    name: "Olive",    hex: "#4A4B32", order: 3 },
  burgundy: { code: "burgundy", name: "Burgundy", hex: "#5A222B", order: 4 },
};

export const elasticColorList: ElasticColorDef[] = Object.values(elasticColors).sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_ELASTIC_COLOR: ElasticColorCode = "black";
