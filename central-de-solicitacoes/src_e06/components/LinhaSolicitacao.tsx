import { formatarData, nomesDosTipos, nomesDasPrioridades } from '../formatos';
import type { Prioridade, TipoServico } from '../tipos';

type LinhaSolicitacaoProps = {
    numero: string;
    tipo: TipoServico;
    municipio: string;
    bairro: string;
    prioridade: Prioridade;
    abertura: string;
};

export default function LinhaSolicitacao({ numero, tipo, municipio, bairro, prioridade, abertura }: LinhaSolicitacaoProps) {
    return (
        <tr>
            <td>{numero}</td>
            <td>{nomesDosTipos[tipo]}</td>
            <td>{municipio}</td>
            <td>{bairro}</td>
            <td>{nomesDasPrioridades[prioridade]}</td>
            <td>{formatarData(abertura)}</td>
        </tr>
    );
}
