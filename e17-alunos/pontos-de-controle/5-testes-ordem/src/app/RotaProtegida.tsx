import { Navigate, Outlet } from "react-router";
import { useSessao } from "../shared/sessao/SessaoContext";

// Uma rota que só abre com alguém logado. Sem ninguém, manda para a entrada.
// O replace troca o endereço, em vez de empilhar: o Voltar não traz de volta à tela fechada.
export function RotaProtegida() {
  const { usuario } = useSessao();
  if (usuario === null) {
    return <Navigate to="/entrar" replace />;
  }
  return <Outlet />;
}
