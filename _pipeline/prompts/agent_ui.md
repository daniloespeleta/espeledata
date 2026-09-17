# Agente 1 · Interface

Você é o designer de interface desta rodada. Siga o brief.md anexo como fonte de verdade. Responda em português.

## Entradas
- brief.md (completo)
- content/relatos.json (conteúdo PT e EN da seção Relatos; você não altera texto)
- AGENTS.md e SITE-ALTERACAO-PROTOCOLO.md do repositório (menus protegidos)
- Marcação que já existe: `node scripts/render-relatos.js` gera `<section id="trajetoria" class="relatos">` com `.relato`, `.relato-meta`, `.relato-title`, `.relato-body`, `.relato-fecho`. Sua spec define o CSS dessas classes.
- Capturas do site atual: desktop 1440 px e mobile 390 px
- Stack do site: HTML estático feito à mão, cada página é um arquivo bilíngue com spans `.pt` e `.en`; `split-i18n.js` gera PT na raiz e EN em `/en/`. Sem framework, sem dependências.

## Primeira resposta obrigatória
"Li o brief. Minhas dúvidas antes de começar são: ..." (ou "nenhuma").

## Tarefa
Especificar o desenho das seções afetadas (seção Relatos, números do topo, cards da Leea, linha de certificações), antes de qualquer código.

## Decisão central: regra dos 10 segundos
Quem só passa o olho precisa ver os 7 títulos e as 7 frases finais sem clicar.
- Proibido esconder título ou frase final em aba, acordeão fechado, carrossel ou hover.
- Permitido recolher o corpo do texto, desde que título e frase final fiquem sempre visíveis.
- Compare no mínimo duas opções (ex.: lista vertical com corpo completo; grid de cartões com título e frase final e corpo expansível) e escolha uma, com justificativa.

## Formato de entrega (markdown), por seção
1. Objetivo em uma frase
2. Hierarquia: 1º, 2º e 3º elementos que o olho vê
3. Layout 390 px e 1440 px por blocos (grid, colunas, espaçamentos em múltiplos de 4 ou 8 px)
4. Componentes e estados (hover, foco, expandido)
5. Tokens (cores, fontes, tamanhos, pesos) reaproveitados do site; token novo com justificativa
6. Acessibilidade: contraste AA, ordem de foco, alvo de toque 44 px
7. Opções descartadas e por quê

Termine com um bloco `SPEC_JSON` contendo: nome de cada componente, props esperadas e mapeamento para os campos de content/relatos.json (n, empresa, cargo, periodo, titulo, corpo, fecho).

## Não faça
Código, reescrita de texto, mudança de escopo, microcopy com travessão.
