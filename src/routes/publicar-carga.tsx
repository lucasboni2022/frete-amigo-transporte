import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ESTADOS, TIPOS_CARGA, TIPOS_VEICULO, TIPOS_CARROCERIA } from "@/lib/brazil";
import { toast } from "sonner";

export const Route = createFileRoute("/publicar-carga")({
  head: () => ({ meta: [{ title: "Publicar carga — FreteBR" }, { name: "description", content: "Publique sua carga gratuitamente e receba propostas de caminhoneiros em todo o Brasil." }] }),
  component: PublicarCarga,
});

const schema = z.object({
  origem_cidade: z.string().trim().min(2).max(100),
  origem_estado: z.string().length(2),
  destino_cidade: z.string().trim().min(2).max(100),
  destino_estado: z.string().length(2),
  data_coleta: z.string().min(1, "Informe a data"),
  tipo_carga: z.string().min(1),
  peso_kg: z.coerce.number().positive().max(100000),
  valor_frete: z.coerce.number().nonnegative().optional(),
  tipo_veiculo: z.string().min(1),
  tipo_carroceria: z.string().optional(),
  observacoes: z.string().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

function PublicarCarga() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
  }, []);

  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { tipo_carga: "Carga geral", tipo_veiculo: "Truck" } });

  if (userId === null) {
    return (
      <SiteLayout>
        <div className="container mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Faça login para publicar</h1>
          <p className="mt-2 text-muted-foreground">Você precisa de uma conta para publicar cargas.</p>
          <Button asChild className="mt-6"><Link to="/auth">Entrar ou cadastrar</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  const onSubmit = async (values: FormData) => {
    const { error } = await supabase.from("cargas").insert({
      ...values,
      user_id: userId,
      valor_frete: values.valor_frete || null,
      tipo_carroceria: values.tipo_carroceria || null,
    });
    if (error) {
      toast.error("Erro ao publicar: " + error.message);
      return;
    }
    toast.success("Carga publicada com sucesso!");
    navigate({ to: "/dashboard" });
  };

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Publicar carga</h1>
          <p className="mt-2 text-muted-foreground">Preencha os dados e publique gratuitamente.</p>
        </div>
      </section>

      <form onSubmit={form.handleSubmit(onSubmit)} className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
        <Section title="Rota">
          <div className="grid gap-4 md:grid-cols-[1fr_120px_1fr_120px]">
            <Field label="Cidade de origem" error={form.formState.errors.origem_cidade?.message}>
              <Input {...form.register("origem_cidade")} placeholder="São Paulo" />
            </Field>
            <Field label="UF">
              <Controlled value={form.watch("origem_estado")} onChange={(v) => form.setValue("origem_estado", v)} options={ESTADOS as readonly string[]} />
            </Field>
            <Field label="Cidade de destino" error={form.formState.errors.destino_cidade?.message}>
              <Input {...form.register("destino_cidade")} placeholder="Rio de Janeiro" />
            </Field>
            <Field label="UF">
              <Controlled value={form.watch("destino_estado")} onChange={(v) => form.setValue("destino_estado", v)} options={ESTADOS as readonly string[]} />
            </Field>
          </div>
        </Section>

        <Section title="Carga">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Tipo de carga">
              <Controlled value={form.watch("tipo_carga")} onChange={(v) => form.setValue("tipo_carga", v)} options={TIPOS_CARGA as readonly string[]} />
            </Field>
            <Field label="Peso (kg)" error={form.formState.errors.peso_kg?.message}>
              <Input type="number" step="any" {...form.register("peso_kg")} placeholder="15000" />
            </Field>
            <Field label="Data de coleta" error={form.formState.errors.data_coleta?.message}>
              <Input type="date" {...form.register("data_coleta")} />
            </Field>
          </div>
        </Section>

        <Section title="Veículo">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Tipo de veículo">
              <Controlled value={form.watch("tipo_veiculo")} onChange={(v) => form.setValue("tipo_veiculo", v)} options={TIPOS_VEICULO as readonly string[]} />
            </Field>
            <Field label="Carroceria (opcional)">
              <Controlled value={form.watch("tipo_carroceria") ?? ""} onChange={(v) => form.setValue("tipo_carroceria", v)} options={TIPOS_CARROCERIA as readonly string[]} />
            </Field>
            <Field label="Valor do frete (R$)">
              <Input type="number" step="any" {...form.register("valor_frete")} placeholder="A combinar" />
            </Field>
          </div>
        </Section>

        <Section title="Observações">
          <Textarea rows={4} {...form.register("observacoes")} placeholder="Descrição da carga, condições de pagamento, contato, etc." />
        </Section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>Cancelar</Button>
          <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Publicando..." : "Publicar carga"}
          </Button>
        </div>
      </form>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Controlled({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
