import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/planos")({
  head: () => ({ meta: [{ title: "Planos — FreteBR" }, { name: "description", content: "Conheça nossos planos para embarcadores e transportadoras." }] }),
  component: Planos,
});

const planos = [
  { nome: "Gratuito", preco: "R$ 0", periodo: "/mês", desc: "Comece grátis", recursos: ["3 cargas/mês", "Contato direto", "Suporte por email"], destaque: false },
  { nome: "Profissional", preco: "R$ 99", periodo: "/mês", desc: "Para embarcadores ativos", recursos: ["Cargas ilimitadas", "Destaque nas buscas", "Estatísticas", "Suporte prioritário"], destaque: true },
  { nome: "Empresa", preco: "Sob consulta", periodo: "", desc: "Para grandes operações", recursos: ["Tudo do Profissional", "Múltiplos usuários", "API de integração", "Gerente de conta"], destaque: false },
];

function Planos() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto px-4 py-14 text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Planos para todo perfil</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Cadastrar-se e buscar cargas é sempre grátis. Embarcadores escolhem o plano ideal para publicar.</p>
        </div>
      </section>

      <section className="container mx-auto grid gap-6 px-4 py-16 md:grid-cols-3">
        {planos.map((p) => (
          <div key={p.nome} className={`rounded-2xl border p-7 ${p.destaque ? "border-accent bg-card shadow-[var(--shadow-elegant)] ring-2 ring-accent/40" : "border-border bg-card shadow-[var(--shadow-card)]"}`}>
            {p.destaque && <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">Mais popular</span>}
            <h3 className="font-display text-xl font-semibold">{p.nome}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <div className="mt-5 flex items-end gap-1">
              <span className="font-display text-4xl font-bold text-primary">{p.preco}</span>
              <span className="text-muted-foreground">{p.periodo}</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {p.recursos.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{r}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7 w-full" variant={p.destaque ? "default" : "outline"}>
              <Link to="/auth">Começar</Link>
            </Button>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
