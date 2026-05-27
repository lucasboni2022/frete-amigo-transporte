import { Link } from "@tanstack/react-router";
import { Truck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold font-display">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-foreground text-primary">
              <Truck className="h-5 w-5" />
            </span>
            FreteBR
          </div>
          <p className="mt-3 text-sm text-primary-foreground/70 max-w-xs">
            A plataforma de fretes que conecta embarcadores, transportadoras e caminhoneiros em todo o Brasil.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Para Embarcadores</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/publicar-carga" className="hover:text-primary-foreground">Publicar carga</Link></li>
            <li><Link to="/planos" className="hover:text-primary-foreground">Planos</Link></li>
            <li><Link to="/como-funciona" className="hover:text-primary-foreground">Como funciona</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Para Caminhoneiros</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/buscar-cargas" className="hover:text-primary-foreground">Buscar cargas</Link></li>
            <li><Link to="/auth" className="hover:text-primary-foreground">Cadastrar-se</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Empresa</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/como-funciona" className="hover:text-primary-foreground">Sobre</Link></li>
            <li><a href="mailto:contato@fretebr.app" className="hover:text-primary-foreground">Contato</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-5 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} FreteBR. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
