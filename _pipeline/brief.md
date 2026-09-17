# Brief · Repaginação de espeledata.com

Documento único para qualquer LLM ou agente. Cole inteiro no início da sessão de cada agente, junto com os arquivos listados na seção 2.

---

## 0. Como usar este brief

Três agentes, em sequência. Cada um recebe o brief completo e o artefato do anterior.

| Ordem | Papel | Modelo indicado | Entrega |
|---|---|---|---|
| 1 | Interface (design) | modelo forte em UI e raciocínio visual | Especificação de layout por seção (seção 6) |
| 2 | Código | modelo forte em código | Implementação numa prévia, sem publicar (seção 7) |
| 3 | Revisão de design | modelo diferente do agente 1 | Relatório com notas e bloqueios (seção 8) |

Regras do fluxo:

- Nenhum agente publica nada. A publicação é feita pelo Dan depois de aprovar a prévia.
- Se o revisor apontar bloqueio, o fluxo volta para o agente responsável (interface ou código). Máximo de 2 ciclos. Depois disso, a decisão é do Dan.
- Todo agente começa respondendo: "Li o brief. Minhas dúvidas antes de começar são: ..." Se não houver dúvida, escreve "nenhuma".

---

## 1. Contexto e objetivo

Danilo Campos Espeleta (Dan) é Especialista em CRM e Lifecycle Marketing, formado em Letras, em São Paulo. O site espeledata.com é o hub do portfólio dele.

Objetivo desta rodada:

1. Substituir a seção **Trajetória** (linha do tempo clicável) por uma seção **Relatos**, com sete cenas escritas em primeira pessoa.
2. Corrigir as informações do site que contradizem o currículo atual.
3. Revisar e repaginar o visual das seções afetadas, mantendo a identidade existente.

Público principal: recrutadoras e gestoras de vagas de estratégia de experiência, CRM e lifecycle, incluindo uma candidatura em andamento para Senior Experience Strategist. A leitura precisa funcionar em 10 segundos (quem só passa o olho) e em 3 minutos (quem lê tudo).

---

## 2. Fontes de verdade

Hierarquia. Em caso de conflito, vale a de cima.

1. **DE-Curriculo.pdf** (currículo em português) e **DE-Resume.pdf** (inglês). Fatos, números, cargos e datas.
2. **linkedin-e-site-relatos.md**, Parte 2 (textos da seção Relatos) e Parte 3 (ajustes de consistência). Texto literal.
3. O site atual em espeledata.com e espeledata.com/leea. Identidade visual, tipografia, cores e estrutura existente.

Nenhum agente cria número, cargo, data, cliente, resultado ou depoimento que não esteja nessas fontes.

---

## 3. Escopo

**Muda:**

- Seção Trajetória sai. Entra a seção Relatos (sete cenas, texto literal).
- Números do topo: o card "500% crescimento em participação de eventos" é substituído (ver seção 4).
- Datas: qualquer menção à Fênix como atual ("desde jul 2022", "presente") passa a jul 2022 a set 2025.
- Página /leea: rótulos "em validação" e "ainda não existe case pago" são substituídos pelo enquadramento "estudo de método".
- Certificações, que moravam dentro de Trajetória, viram uma linha compacta perto do botão de download do CV.
- Botões de download apontam para os novos DE-Curriculo.pdf e DE-Resume.pdf.

**Não muda:**

- Textos das seções Sobre, Como eu trabalho, Portfólio e Contato, exceto os pontos listados acima.
- Domínio, URLs e âncoras existentes (links já compartilhados não podem quebrar).
- Dados de contato.

---

## 4. Conteúdo e correções

### 4.1 Seção Relatos

Texto literal em `content/relatos.json` (PT e EN), inserido pelo script `scripts/render-relatos.js`. A tradução EN está marcada como proposta e precisa de aprovação do Dan antes do merge. Estrutura de cada cena:

- Rótulo: número · empresa · cargo · período (ex.: "02 · Monchu · Gerente de Comunicação e Branding · 2016 a 2019")
- Título da cena (ex.: "A festa que aprendeu a reconhecer quem voltava")
- Corpo (um parágrafo)
- Frase final em destaque visual (ex.: "Quem volta sempre merece uma pergunta mais funda.")

Ordem: 01 LBV Telemarketing, 02 e 03 Monchu, 04 LBV Parcerias, 05 e 06 Fênix (2022 a 2025), 07 Leea (2025 a presente).

Cabeçalho da seção: "RELATOS" / "SETE CENAS EM QUE LI COMPORTAMENTO ANTES DE DECIDIR" / "O currículo completo está para download logo abaixo. Aqui ficam as cenas."

### 4.2 Correções de consistência

| Onde | Hoje | Passa a ser (PT) | Passa a ser (EN) |
|---|---|---|---|
| Números do topo | 500% crescimento em participação de eventos | 2 a 3 mil · pessoas por edição (a partir de ~500) | 2,000 to 3,000 · attendees per edition (from ~500) |
| Card Leea no portfólio e na home | EM VALIDAÇÃO / Projeto autoral em validação | ESTUDO DE MÉTODO | METHOD STUDY |
| leea.html, card Leea | Projeto autoral em validação · Ainda não existe case pago da Leea | Estudo de método · Leea é um estudo de retenção que lê os sinais anteriores à decisão de cancelar em quatro camadas: comportamento, voz de marca, semiótica e tempo de permanência em cada estado da jornada. | Method study · Leea is a retention study that reads the signals preceding the decision to cancel across four layers: behavior, brand voice, semiotics and time spent in each journey state. |
| leea.html, card Monchu | 500 para mais de 3 mil | de 300 a 500 para 2 a 3 mil por edição | from 300 to 500 to 2,000 to 3,000 per edition |
| Qualquer lugar | Fênix "desde jul 2022" / "presente" | jul 2022 a set 2025 | Jul 2022 to Sep 2025 |
| case-boa-leitura.html e portfolio.html | "alavancagem" / "leverage" | termo equivalente sem a palavra proibida, aprovado pelo Dan | equivalent term, approved by Dan |

A lista completa de ocorrências é gerada por `node scripts/check-relatos.js`.

### 4.3 Currículos

Os PDFs em `CV/` são gerados a partir de `cv-src/resume-pt.html` e `cv-src/resume-en.html` com `cv-src/render-pdf.js`. Nesta rodada, os PDFs novos entregues pelo Dan substituem `CV/DE-Curriculo.pdf` e `CV/DE-Resume.pdf`. A atualização de `cv-src/` para refletir o CV novo fica como tarefa separada.

---

## 5. Regras de texto

Valem para qualquer microcopy nova (botões, rótulos, títulos de seção, alt text):

- Sem travessão (—) e sem meia-risca como pontuação. Usar vírgula, ponto, dois-pontos ou parênteses. Em intervalos de data, usar "a" (2016 a 2019).
- Vocabulário proibido: "alavancar", "destravar potencial", "navegar pelo cenário", "mergulhar fundo", "robusto", "estratégico" como qualificador genérico, "engajamento" como buzzword, "vale ressaltar", "é importante destacar", "em suma", "por fim", "ademais", "é fundamental".
- Sem o padrão de antítese "não é A, é B" ou "não faz A. Faz B."
- Sem pergunta engajadora no fim de seção.
- Sem emoji.
- Não reescrever os relatos. Ajuste de texto só com aprovação do Dan.

---

## 6. Agente 1 · Interface (design)

**Recebe:** este brief, capturas de tela das páginas atuais (desktop 1440 px e mobile 390 px) e o arquivo de relatos.

**Tarefa:** propor o desenho das seções afetadas antes de qualquer código.

**Entrega, em markdown, para cada seção afetada:**

1. Objetivo da seção em uma frase.
2. Hierarquia de leitura: o que o olho vê em 1º, 2º e 3º lugar.
3. Layout desktop e mobile, descrito por blocos (grid, colunas, espaçamentos em múltiplos de 4 ou 8 px).
4. Componentes: nome, variações, estados (hover, foco, expandido).
5. Tokens usados: cores, fontes, tamanhos, pesos. Reaproveitar os do site atual. Token novo precisa de justificativa.
6. Interação: se os relatos ficam todos abertos, em carrossel, em abas ou em acordeão, e por quê. Critério: quem só passa o olho precisa ver os sete títulos e frases finais sem clicar.
7. Acessibilidade: contraste mínimo WCAG AA (4,5:1 para texto), ordem de foco, alt text, tamanho mínimo de toque 44 px.
8. Riscos e alternativas descartadas.

**Não faz:** código, reescrita de texto, mudança de escopo.

---

## 7. Agente 2 · Código

**Recebe:** este brief, a especificação aprovada do agente 1 e acesso ao repositório ou editor do site.

**Stack do site:** HTML estático bilíngue (spans .pt/.en) em github.com/daniloespeleta/espeledata; build `node build.js`; deploy contínuo no Netlify a partir do main; prévia via pull request. Detalhes em prompts/agent_code.md.

**Tarefa:** implementar a especificação numa prévia.

**Regras:**

- Trabalhar em branch ou ambiente de prévia. Nunca publicar em produção.
- Texto copiado literal das fontes. Diferença de uma vírgula é erro.
- Não quebrar URLs nem âncoras existentes. Se a âncora #trajetoria existir, redirecionar para #relatos.
- Sem dependência nova sem justificativa.
- Imagens com dimensões definidas e alt text. Nada de layout shift perceptível.
- Mobile primeiro: testar em 390 px antes de 1440 px.

**Entrega:**

1. Link da prévia.
2. Lista de arquivos alterados, com uma linha sobre cada mudança.
3. Checklist da seção 9 preenchido, item a item, com "ok" ou o problema encontrado.
4. Capturas de tela da prévia em 390 px e 1440 px, de cada seção alterada.

---

## 8. Agente 3 · Revisão de design

**Recebe:** este brief, a especificação do agente 1, as capturas e o link da prévia do agente 2.

**Tarefa:** revisar como uma diretora de design exigente e como uma recrutadora com 10 segundos. Usar um modelo diferente do agente 1, para não validar as próprias escolhas.

**Rubrica, nota de 1 a 5 por critério:**

| Critério | O que avaliar |
|---|---|
| Fidelidade ao conteúdo | Textos literais, números e datas conforme as fontes |
| Hierarquia | Leitura em 10 segundos: títulos das cenas e frases finais visíveis sem clicar |
| Consistência visual | Tokens, espaçamentos e tipografia coerentes com o resto do site |
| Legibilidade | Tamanho de fonte, comprimento de linha (45 a 80 caracteres), contraste |
| Responsividade | 390 px e 1440 px sem quebra, corte ou rolagem horizontal |
| Acessibilidade | WCAG AA, foco visível, alt text, alvos de toque |
| Coerência de narrativa | Site, CV e LinkedIn contam a mesma história |

**Entrega:**

1. Tabela com nota e justificativa de uma linha por critério.
2. Bloqueios: tudo que impede publicar (erro de conteúdo, número divergente, quebra no mobile, contraste abaixo de AA). Cada bloqueio indica o agente responsável.
3. Melhorias opcionais, em ordem de impacto, no máximo 5.
4. Veredito: "pronto para aprovação do Dan" ou "volta para [agente]".

Critério de aprovação: nenhuma nota abaixo de 4 e zero bloqueios.

---

## 9. Checklist de aceite

- [ ] Seção Trajetória removida e âncora antiga redirecionada
- [ ] Sete relatos com texto literal, na ordem certa
- [ ] Card "500%" substituído
- [ ] Fênix com jul 2022 a set 2025 em todas as ocorrências
- [ ] /leea sem "em validação" e sem "ainda não existe case pago"
- [ ] Card Monchu em /leea corrigido
- [ ] Certificações em linha compacta perto do download do CV
- [ ] Downloads apontando para os novos DE-Curriculo.pdf e DE-Resume.pdf
- [ ] Nenhum travessão, palavra proibida ou antítese em microcopy nova
- [ ] Contraste AA e foco visível
- [ ] 390 px e 1440 px revisados por captura
- [ ] Nada publicado sem aprovação do Dan

---

## 10. Decisões do Dan antes de rodar

- [ ] Aprovar a tradução EN dos relatos em `content/relatos.json` (depois apagar a chave `_status_en`)
- [ ] Escolher o substituto de "alavancagem" / "leverage" em case-boa-leitura.html e portfolio.html
- [ ] Confirmar que o Netlify gera deploy preview para pull requests (Site settings, Build & deploy, Deploy Previews)
- [ ] Substituir CV/DE-Curriculo.pdf e CV/DE-Resume.pdf pelos PDFs novos
