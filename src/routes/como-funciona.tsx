import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { UserPlus, Search, MessageSquare, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({ meta: [{ title: "Como funciona — FreteBR" }, { name: "description", content: "Entenda como funciona a plataforma FreteBR em 4 passos simples." }] }),
  component: ComoFunciona,
});

const steps = [
  { icon: UserPlus, title: "Cadastre-se grátis", desc: "Crie sua conta em menos de 1 minuto, como motorista, embarcador ou transportadora." },
  { icon: Search, title: "Publique ou encontre", desc: "Embarcadores publicam cargas; motoristas filtram por rota, veículo e tipo." },
  { icon: MessageSquare, title: "Negocie direto", desc: "Contato direto pelo telefone do anúncio, sem intermediários." },
  { icon: CheckCircle2, title: "Faça o frete", desc: "Combine, transporte e construa sua reputação para conquistar mais cargas." },
];

function ComoFunciona() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto px-4 py-14 text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Como funciona o FreteBR</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">A maneira mais simples e rápida de conectar cargas e caminhoneiros no Brasil.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Passo {i + 1}</span>
              <s.icon className="h-8 w-8 text-accent" />
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
