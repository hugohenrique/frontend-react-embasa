# 0001 · Estrutura por funcionalidade

Data: 13/11/2026
Situação: aceita

## Contexto
O App.tsx tinha 173 linhas, com regras, estado e apresentação misturados.
A regra de "urgente" estava escrita em dois lugares.

## Decisão
Organizar o código por funcionalidade (features/), com:
- regras de negócio em funções puras (regras.ts);
- uma página por funcionalidade, que guarda o estado da tela;
- componentes de apresentação, que só recebem Props;
- um index.ts por funcionalidade como única porta de entrada.

## Consequências
+ Uma mudança de regra fica em um lugar só.
+ Uma funcionalidade nova ganha a própria pasta, sem mexer nas outras.
- Mais arquivos e mais imports para quem chega no projeto.
