import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/brazil";
import { ArrowRight, MapPin, Calendar, Package, Truck, Phone, Building2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/carga/$id")({
  head: () => ({ meta: [{ title: "Detalhes da carga — FreteBR" }] }),
  component: CargaDetalhe,
});

function CargaDetalhe() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["carga", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cargas")
        .select("*, profiles!cargas_user_id_fkey(nome_completo, telefone, empresa, tipo)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <SiteLayout><div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Carregando...</div></SiteLayout>;
  if (error || !data) return <SiteLayout><div className="container mx-auto px-4 py-20 text-center">Carga não encontrada.</div></SiteLayout>;

  const c: any = data;
  const profile = c.profiles;

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link to="/buscar-cargas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar para cargas
        </Link>

        <div className="mt-6 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <Badge className="bg-success/10 text-success hover:bg-success/15">{c.status}</Badge>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-2xl font-display font-bold">
            <span className="flex items-center gap-2"><MapPin className="h-6 w-6 text-accent" />{c.origem_cidade}/{c.origem_estado}</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <span className="flex items-center gap-2"><MapPin className="h-6 w-6 text-primary" />{c.destino_cidade}/{c.destino_estado}</span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Info icon={Calendar} label="Data de coleta" value={new Date(c.data_coleta).toLocaleDateString("pt-BR")} />
            <Info icon={Package} label="Tipo de carga" value={c.tipo_carga} />
            <Info icon={Truck} label="Veículo / Carroceria" value={`${c.tipo_veiculo}${c.tipo_carroceria ? ` · ${c.tipo_carroceria}` : ""}`} />
            <Info icon={Package} label="Peso" value={`${(c.peso_kg / 1000).toFixed(2)} t`} />
          </div>

          {c.observacoes && (
            <div className="mt-8 rounded-xl bg-secondary p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Observações</div>
              <p className="mt-2 whitespace-pre-line text-sm">{c.observacoes}</p>
            </div>
          )}

          <div className="mt-8 flex items-end justify-between border-t border-border pt-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Valor do frete</div>
              <div className="font-display text-3xl font-bold text-primary">{brl(c.valor_frete)}</div>
            </div>
          </div>
        </div>

        {profile && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
            <h3 className="font-display text-lg font-semibold">Contato</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /> {profile.empresa || profile.nome_completo} <span className="text-muted-foreground">({profile.tipo})</span></div>
              {profile.telefone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${profile.telefone}`} className="text-primary hover:underline">{profile.telefone}</a>
                </div>
              )}
            </div>
            {profile.telefone && (
              <Button asChild className="mt-5">
                <a href={`https://wa.me/55${profile.telefone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  Chamar no WhatsApp
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-base font-medium">{value}</div>
    </div>
  );
}
