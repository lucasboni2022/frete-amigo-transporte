import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SearchForm } from "@/components/cargas/SearchForm";
import { CargaCard, type Carga } from "@/components/cargas/CargaCard";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const searchSchema = z.object({
  origem: z.string().optional(),
  destino: z.string().optional(),
  veiculo: z.string().optional(),
});

export const Route = createFileRoute("/buscar-cargas")({
  head: () => ({
    meta: [
      { title: "Buscar cargas — FreteBR" },
      { name: "description", content: "Encontre cargas disponíveis em todo o Brasil. Filtre por origem, destino e tipo de veículo." },
    ],
  }),
  validateSearch: searchSchema,
  component: BuscarCargas,
});

function BuscarCargas() {
  const { origem, destino, veiculo } = Route.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: ["cargas", origem, destino, veiculo],
    queryFn: async () => {
      let q = supabase.from("cargas").select("*").eq("status", "ativa").order("created_at", { ascending: false }).limit(100);
      if (origem) q = q.eq("origem_estado", origem);
      if (destino) q = q.eq("destino_estado", destino);
      if (veiculo) q = q.eq("tipo_veiculo", veiculo);
      const { data, error } = await q;
      if (error) throw error;
      return data as Carga[];
    },
  });

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Cargas disponíveis</h1>
          <p className="mt-2 text-muted-foreground">Filtre por origem, destino ou tipo de veículo.</p>
          <div className="mt-6">
            <SearchForm defaults={{ origem, destino, veiculo }} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-semibold">Nenhuma carga encontrada</h3>
            <p className="mt-2 text-muted-foreground">Tente ajustar os filtros ou seja o primeiro a publicar.</p>
            <Link to="/publicar-carga" className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Truck className="h-4 w-4" /> Publicar carga
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">{data.length} carga(s) encontrada(s)</div>
            <div className="grid gap-4">
              {data.map((c) => <CargaCard key={c.id} carga={c} />)}
            </div>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
