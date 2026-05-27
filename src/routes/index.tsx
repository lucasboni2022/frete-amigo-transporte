import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SearchForm } from "@/components/cargas/SearchForm";
import { Button } from "@/components/ui/button";
import { Truck, Package, Users, ShieldCheck, MapPin, Zap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreteBR — Plataforma de fretes e cargas do Brasil" },
      { name: "description", content: "Encontre cargas e fretes em todo o Brasil. Conecte embarcadores, transportadoras e caminhoneiros em uma única plataforma." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px, 90px 90px",
          }}
        />
        <div className="container mx-auto px-4 pt-20 pb-32 text-primary-foreground">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Zap className="h-3 w-3" /> Mais de 50.000 cargas publicadas todo mês
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
              A plataforma de fretes que move o Brasil
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
              Conecte cargas e caminhoneiros em segundos. Publique fretes, negocie direto e acompanhe tudo em um só lugar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-base">
                <Link to="/buscar-cargas">Sou caminhoneiro</Link>
              </Button>
              <Button asChild size="lg" className="h-12 px-6 text-base bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/publicar-carga">Publicar carga grátis <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="mt-14 max-w-5xl">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-background py-12">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {[
            { v: "50k+", l: "Cargas/mês" },
            { v: "200k+", l: "Caminhoneiros" },
            { v: "5.500", l: "Cidades atendidas" },
            { v: "24/7", l: "Plataforma ativa" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-3xl font-bold text-primary md:text-4xl">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Tudo para sua operação de transporte</h2>
          <p className="mt-3 text-muted-foreground">Da publicação à entrega, em uma plataforma feita para o motorista e para o embarcador.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Package, title: "Publicação simples", desc: "Cadastre cargas em menos de 1 minuto com todos os dados que o motorista precisa." },
            { icon: MapPin, title: "Filtros inteligentes", desc: "Busque por origem, destino, tipo de veículo, carroceria e muito mais." },
            { icon: Users, title: "Contato direto", desc: "Fale diretamente com embarcadores e motoristas — sem intermediários." },
            { icon: Truck, title: "Frota completa", desc: "Truck, carreta, bitrem, rodotrem, VUC e todos os tipos de carroceria." },
            { icon: ShieldCheck, title: "Cadastros verificados", desc: "Confirme dados e construa reputação na plataforma." },
            { icon: Zap, title: "Tempo real", desc: "Veja cargas novas assim que são publicadas em qualquer rota." },
          ].map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="overflow-hidden rounded-3xl border border-border" style={{ background: "var(--gradient-hero)" }}>
          <div className="grid items-center gap-8 px-8 py-14 text-primary-foreground md:grid-cols-2 md:px-14">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Pronto para começar?</h2>
              <p className="mt-3 text-primary-foreground/85">Cadastre-se gratuitamente e publique sua primeira carga ou encontre seu próximo frete em minutos.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" variant="secondary" className="h-12 px-6">
                <Link to="/auth">Criar conta grátis</Link>
              </Button>
              <Button asChild size="lg" className="h-12 px-6 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/buscar-cargas">Ver cargas disponíveis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
