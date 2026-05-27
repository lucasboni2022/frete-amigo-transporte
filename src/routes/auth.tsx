import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Truck } from "lucide-react";

const searchSchema = z.object({ tab: z.enum(["login", "signup"]).optional() });

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar ou cadastrar — FreteBR" }] }),
  validateSearch: searchSchema,
  component: AuthPage,
});

function AuthPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: "/dashboard" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return (
    <SiteLayout>
      <div className="container mx-auto flex max-w-md flex-col items-center px-4 py-14">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Truck className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold">Bem-vindo ao FreteBR</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acesse sua conta ou cadastre-se grátis.</p>

        <Tabs defaultValue={tab ?? "login"} className="mt-8 w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="login"><LoginForm /></TabsContent>
          <TabsContent value="signup"><SignupForm /></TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Bem-vindo de volta!");
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
    </form>
  );
}

function SignupForm() {
  const [data, setData] = useState({ email: "", password: "", nome_completo: "", telefone: "", tipo: "embarcador" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { nome_completo: data.nome_completo, telefone: data.telefone, tipo: data.tipo },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Conta criada! Verifique seu email.");
  };

  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, [k]: e.target.value });

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="space-y-1.5">
        <Label>Eu sou</Label>
        <Select value={data.tipo} onValueChange={(v) => setData({ ...data, tipo: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="embarcador">Embarcador (tenho cargas)</SelectItem>
            <SelectItem value="motorista">Caminhoneiro</SelectItem>
            <SelectItem value="transportadora">Transportadora</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5"><Label>Nome completo</Label><Input required value={data.nome_completo} onChange={upd("nome_completo")} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={data.email} onChange={upd("email")} /></div>
        <div className="space-y-1.5"><Label>Telefone</Label><Input value={data.telefone} onChange={upd("telefone")} placeholder="(11) 99999-9999" /></div>
      </div>
      <div className="space-y-1.5"><Label>Senha (mín. 6 caracteres)</Label><Input type="password" required minLength={6} value={data.password} onChange={upd("password")} /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Criando..." : "Criar conta grátis"}</Button>
    </form>
  );
}
