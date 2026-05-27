import { Link } from "@tanstack/react-router";
import { MapPin, Calendar, Package, Truck, ArrowRight } from "lucide-react";
import { brl } from "@/lib/brazil";
import { Badge } from "@/components/ui/badge";

export interface Carga {
  id: string;
  origem_cidade: string;
  origem_estado: string;
  destino_cidade: string;
  destino_estado: string;
  data_coleta: string;
  tipo_carga: string;
  peso_kg: number;
  valor_frete: number | null;
  tipo_veiculo: string;
  tipo_carroceria: string | null;
  status: string;
  created_at: string;
}

export function CargaCard({ carga }: { carga: Carga }) {
  return (
    <Link
      to="/carga/$id"
      params={{ id: carga.id }}
      className="group block rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[var(--shadow-elegant)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 text-base font-semibold text-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-accent" />
            {carga.origem_cidade}/{carga.origem_estado}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            {carga.destino_cidade}/{carga.destino_estado}
          </span>
        </div>
        <Badge variant="secondary" className="bg-success/10 text-success">{carga.status}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground md:grid-cols-4">
        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(carga.data_coleta).toLocaleDateString("pt-BR")}</div>
        <div className="flex items-center gap-2"><Package className="h-4 w-4" />{carga.tipo_carga}</div>
        <div className="flex items-center gap-2"><Truck className="h-4 w-4" />{carga.tipo_veiculo}</div>
        <div className="flex items-center gap-2 font-medium text-foreground">{(carga.peso_kg / 1000).toFixed(1)}t</div>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Valor do frete</div>
          <div className="font-display text-2xl font-bold text-primary">{brl(carga.valor_frete)}</div>
        </div>
        <span className="text-sm font-medium text-accent group-hover:underline">Ver detalhes →</span>
      </div>
    </Link>
  );
}
