# Contrato da API do curso

API REST fictícia, feita só para as aulas. **Não é a API da Embasa.**
Os dados ficam em memória e voltam ao estado inicial quando a API é reiniciada.

Endereço base: `http://localhost:3333`
Todas as respostas são JSON (`Content-Type: application/json; charset=utf-8`).
Todo erro vem com um campo `mensagem`.

## Solicitacao

| Campo        | Tipo                                         | Observação                  |
|--------------|----------------------------------------------|-----------------------------|
| `numero`     | texto, ex.: `"26-08830"`                     | definido pela API           |
| `tipo`       | `"vazamento"`, `"falta-agua"` ou `"religacao"` |                           |
| `municipio`  | texto                                        |                             |
| `bairro`     | texto                                        |                             |
| `prioridade` | `"baixa"`, `"media"` ou `"alta"`             |                             |
| `abertura`   | data em texto, ex.: `"2026-11-13"`           | definida pela API           |
| `relato`     | texto, opcional, até 500 caracteres          |                             |

## GET /api/solicitacoes

Lista todas, da mais nova para a mais antiga.

- **200** `{ "itens": Solicitacao[], "total": number }`

## GET /api/solicitacoes/{numero}

Busca uma solicitação pelo número.

- **200** `Solicitacao`
- **404** `{ "mensagem": "Solicitação 26-99999 não encontrada." }`

## POST /api/solicitacoes  (encontro 11)

Registra uma solicitação nova. O corpo é a solicitação **sem** `numero` e `abertura`:

```json
{ "tipo": "vazamento", "municipio": "Salvador", "bairro": "Barra", "prioridade": "alta", "relato": "..." }
```

- **201** a `Solicitacao` criada, já com `numero` e `abertura`
- **400** `{ "mensagem": "O corpo da requisição não é um JSON válido." }`
- **422** `{ "mensagem": "Há campos inválidos.", "campos": { "bairro": "Informe o bairro." } }`

## Respostas comuns a qualquer endereço

- **404** endereço que não existe
- **405** método não aceito no endereço (ex.: `DELETE`)
- **503** falha simulada, quando a API roda com `--falha`

## Opções ao rodar

```
node api-do-curso/servidor.mjs --atraso 3000   cada resposta demora 3 s (padrão: 600 ms)
node api-do-curso/servidor.mjs --falha 50      metade das respostas falha com 503
node api-do-curso/servidor.mjs --porta 4000    outra porta (padrão: 3333)
```
