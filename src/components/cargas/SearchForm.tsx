import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ESTADOS, TIPOS_VEICULO } from "@/lib/brazil";

interface Props {
  defaults?: { origem?: string; destino?: string; veiculo?: string };
  compact?: boolean;
}

export function SearchForm({ defaults, compact }: Props) {
  const navigate = useNavigate();
  const [origem, setOrigem] = useState(defaults?.origem ?? "");
  const [destino, setDestino] = useState(defaults?.destino ?? "");
  const [veiculo, setVeiculo] = useState(defaults?.veiculo ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/buscar-cargas",
      search: {
        origem: origem || undefined,
        destino: destino || undefined,
        veiculo: veiculo || undefined,
      },
    });
  };

  return (
    <form
      onSubmit={submit}
      className={`grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-elegant)] md:grid-cols-[1fr_1fr_1fr_auto] ${compact ? "" : "md:p-5"}`}
    >
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Origem (UF)</label>
        <Select value={origem} onValueChange={setOrigem}>
          <SelectTrigger className="bg-background"><SelectValue placeholder="Todos os estados" /></SelectTrigger>
          <SelectContent>
            {ESTADOS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Destino (UF)</label>
        <Select value={destino} onValueChange={setDestino}>
          <SelectTrigger className="bg-background"><SelectValue placeholder="Todos os estados" /></SelectTrigger>
          <SelectContent>
            {ESTADOS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Truck className="h-3 w-3" /> Veículo</label>
        <Select value={veiculo} onValueChange={setVeiculo}>
          <SelectTrigger className="bg-background"><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            {TIPOS_VEICULO.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" size="lg" className="self-end h-11">
        <Search className="mr-2 h-4 w-4" /> Buscar
      </Button>
    </form>
  );
}
