export const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
] as const;

export const TIPOS_VEICULO = [
  "Truck", "Toco", "Carreta", "Bitrem", "Rodotrem", "VUC", "3/4", "Vanderléia", "Bitruck",
] as const;

export const TIPOS_CARROCERIA = [
  "Baú", "Sider", "Graneleira", "Tanque", "Frigorífica", "Caçamba", "Prancha", "Plataforma",
] as const;

export const TIPOS_CARGA = [
  "Carga geral", "Granel sólido", "Granel líquido", "Refrigerada", "Perigosa",
  "Frágil", "Containerizada", "Madeira", "Veículos", "Bebidas", "Açúcar", "Soja",
] as const;

export function brl(v: number | null | undefined) {
  if (v == null) return "A combinar";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
