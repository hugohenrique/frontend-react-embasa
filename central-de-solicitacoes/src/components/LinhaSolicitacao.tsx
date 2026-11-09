import { formatarData, nomesDasPrioridades } from '../formatos';
import type { Prioridade, TipoServico } from '../tipos';

type LinhaSolicitacaoProps = {
    numero: string;
    tipo: TipoServico;
    municipio: string;
    prioridade: Prioridade;
    abertura: string;
};

export default function LinhaSolicitacao({ numero, tipo, municipio, prioridade, abertura }: LinhaSolicitacaoProps) {
    return (
        <tr>
            <td>{numero}</td>
            <td>{tipo}</td>
            <td>{municipio}</td>
            <td>{nomesDasPrioridades[prioridade]}</td>
            <td>{formatarData(abertura)}</td>
        </tr>
    );
}