# Contrato da API da Central

API REST do curso, com banco de dados SQLite. **Não é a API da Embasa**: os dados são fictícios.

Endereço base: `http://localhost:3333` (na Central, pelo proxy do Vite: `/api/...`).
Todas as respostas são JSON. Todo erro vem com um campo `mensagem`.
O banco fica em `api-central/dados/central.db`, criado na primeira vez. Os dados sobrevivem ao reinício.

## Solicitacao

| Campo        | Tipo                                                        | Quem define |
|--------------|-------------------------------------------------------------|-------------|
| `numero`     | texto, ex.: `"26-08821"`                                    | a API       |
| `tipo`       | `"vazamento"`, `"falta-agua"` ou `"religacao"`              | quem registra |
| `municipio`  | texto                                                       | quem registra |
| `bairro`     | texto, pelo menos 3 letras                                  | quem registra |
| `prioridade` | `"baixa"`, `"media"` ou `"alta"`                            | quem registra |
| `relato`     | texto, opcional, até 500 caracteres; **obrigatório (10+) se a prioridade for alta** | quem registra |
| `status`     | `"aberta"`, `"em-atendimento"`, `"concluida"` ou `"cancelada"` | a API (nasce `"aberta"`) |
| `abertura`   | data, ex.: `"2026-11-17"`                                   | a API       |
| `atualizada` | data e hora da última mudança, ex.: `"2026-11-17T09:42"`    | a API       |

## GET /api/solicitacoes

Lista, da mais nova para a mais antiga.

Parâmetros opcionais: `status`, `prioridade`, `busca` (bairro ou número), `pagina` (a partir de 1), `porPagina` (até 100; padrão 100).

- **200** `{ "itens": Solicitacao[], "total": number, "pagina": number, "porPagina": number }`

## POST /api/solicitacoes

Corpo: `{ "tipo", "municipio", "bairro", "prioridade", "relato" }`

- **201** a solicitação criada, com `numero`, `status`, `abertura` e `historico`
- **400** o corpo não é um objeto JSON
- **422** `{ "mensagem": "Há campos inválidos.", "campos": { "bairro": "...", "relato": "..." } }`

## GET /api/solicitacoes/{numero}

- **200** a solicitação com `historico`: `[{ "de": null | Status, "para": Status, "observacao": texto, "em": "2026-11-17T09:42" }]`
- **404** `{ "mensagem": "Solicitação 26-99999 não encontrada." }`

## PATCH /api/solicitacoes/{numero}/status

Corpo: `{ "status": Status, "observacao": texto }`

Caminhos possíveis: `aberta → em-atendimento | cancelada`; `em-atendimento → concluida | cancelada`. Concluída e cancelada são finais.
Para concluir ou cancelar, a observação é obrigatória (5+ caracteres).

- **200** a solicitação atualizada, com `historico`
- **404** número que não existe
- **409** `{ "mensagem": "A solicitação já está em atendimento.", "statusAtual": "em-atendimento" }`
- **422** `{ "mensagem": "Há campos inválidos.", "campos": { "observacao": "..." } }`

## GET /api/resumo

- **200** `{ "aberta": n, "em-atendimento": n, "concluida": n, "cancelada": n }`

## Respostas comuns

- **404** endereço que não existe · **405** método não aceito · **503** falha simulada com `--falha`

## Opções

```
npm run api -- --reiniciar     apaga o banco e volta aos dados iniciais
npm run api -- --volume 5000   completa o banco até 5000 solicitações fictícias
npm run api -- --atraso 3000   cada resposta demora 3 s (padrão: 300 ms)
npm run api -- --falha 50      metade das respostas falha com 503
npm run api -- --porta 4000    outra porta (padrão: 3333)
```
