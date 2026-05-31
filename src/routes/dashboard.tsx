import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { CargaCard, type Carga } from "@/components/cargas/CargaCard";
import { supabase } from "@/integrations/supabase/client";
import { Plus, LogOut, Package, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Minha conta — FreteBR" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
      setEmail(data.session?.user.email ?? "");
    });
  }, []);

  useEffect(() => {
    if (userId === null) navigate({ to: "/auth" });
  }, [userId, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: cargas, refetch } = useQuery({
    queryKey: ["my-cargas", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("cargas").select("*").eq("user_id", userId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data as Carga[];
    },
  });

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const remover = async (id: string) => {
    if (!confirm("Excluir esta carga?")) return;
    const { error } = await supabase.from("cargas").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Carga excluída"); refetch(); }
  };

  if (!userId) return <SiteLayout><div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Carregando...</div></SiteLayout>;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Olá, {profile?.nome_completo?.split(" ")[0] ?? "usuário"}</h1>
              <p className="text-sm text-muted-foreground">{email} · {profile?.tipo}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild><Link to="/publicar-carga"><Plus className="mr-1 h-4 w-4" /> Nova carga</Link></Button>
            <Button variant="outline" onClick={logout}><LogOut className="mr-1 h-4 w-4" /> Sair</Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="mb-4 font-display text-xl font-semibold">Minhas cargas publicadas</h2>
        {!cargas || cargas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Você ainda não publicou nenhuma carga.</p>
            <Button asChild className="mt-4"><Link to="/publicar-carga">Publicar primeira carga</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {cargas.map((c) => (
              <div key={c.id} className="space-y-2">
                <CargaCard carga={c} />
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => remover(c.id)} className="text-destructive hover:text-destructive">
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
