# Estudo do DIW / SOEP como referência de comunicação para a Leea

Fonte primária: `diw.de/en/diw_01.c.581706.en/how_to_work_with_spell_data_en.html`, mais as páginas do menu SERVICES (Re-Analysis, Guests, Publications, SOEP as Reference, User Survey) e o material de spell data já baixado em `Claude\Projects\Agência Leea\Spell Data`.

Anotação prática. O que gera comunicação, e o que a Leea faz diferente hoje.

---

## 1. A abertura: problema concreto antes de qualquer nome próprio

Texto real do DIW, na íntegra, é o primeiro parágrafo inteiro da página:

> "Spell, duration or event history data are used frequently in the social sciences. Handling this kind of data can be cumbersome, especially when you want to supplement spell data with panel data or vice versa. Alternatively, you might want to combine two spell files or enrich spell data with information on events while keeping the spell structure of your data. To accomplish these tasks, we provide five do-files to facilitate the data management."

Quatro frases. A estrutura é rígida e vale copiar:

1. Onde isso é usado (contexto factual, sem adjetivo).
2. Qual é a dor, dita com palavra comum: "can be cumbersome", é trabalhoso.
3. Dois exemplos específicos da dor, com "especially when" e "alternatively".
4. O que você recebe, contado: "we provide five do-files".

Nenhuma tese. Nenhum princípio. Nenhum nome de metodologia. O nome do método não aparece porque o método é a lista de cinco arquivos.

**Leea hoje faz o contrário**: abre com "O sentido tem duração", um princípio, e só depois tenta explicar o que isso significa operacionalmente.

## 2. A oferta é contável e cada item tem uma linha de função

O DIW não descreve capacidade, lista arquivo. Os cinco, com a função de cada um em uma frase:

| Arquivo | O que faz |
|---|---|
| SPELL_TO_PANEL | Converte episódio (início e fim) em painel (um registro por unidade por período) |
| PANEL_TO_SPELL | Caminho inverso, colapsa períodos consecutivos no mesmo estado em um episódio |
| SPELL_TO_SPELL | Combina dois arquivos de spell respeitando os limites temporais de ambos |
| EVENT_TO_SPELL | Anexa evento pontual ao episódio, mantendo a estrutura temporal |
| SPLITTING_OVERLAPS | Quebra episódios sobrepostos em subspells que não se intersectam |

Detalhe de comunicação que importa: o SPLITTING_OVERLAPS vem com uma **instrução de ordem de uso**, "rode este antes de combinar arquivos, introduzir painel ou adicionar eventos". Não é só o que faz, é quando usar.

**Leea hoje**: seis agentes com uma frase de função cada, o que estruturalmente é igual. O que falta é a ordem de uso e o formato de entrada e saída de cada um.

## 3. A prova é o artefato baixável, não a descrição do artefato

A página oferece três coisas concretas, com peso do arquivo declarado:

- Short abstract
- Example do-files, ZIP de 296.8 KB
- Full documentation, PDF de 386.41 KB (`diw_ssp0492.pdf`)

E o ZIP não contém só o código. Contém quatro pastas: `example_do_files`, `example_input_data`, `example_output_data`, `example_temp_data`. Ou seja: o código, o dado que entra, o dado que sai, e o intermediário.

Isso é a peça mais forte do modelo inteiro. **Mostrar entrada e saída de exemplo é o que transforma alegação em demonstração.** Quem baixa consegue rodar e comparar.

**Leea hoje**: lista nomes de artefato (`problem_contract`, `episode_fact`, `decision_record`, `intervention_spec`, `measurement_record`) como chips, sem mostrar o formato de nenhum. É a lista de arquivos sem o ZIP.

## 4. Parâmetro documentado na própria linha

Do `event_to_spell.do` real, o padrão de comentário inline:

```stata
global spellfile 	biomarsm	/** Name of spell datafile **/
global s_pid 		persnr		/** Identifier for individuals in spell datafile **/
global spellnr 		spellnr		/** Identifier for spells of each person **/
global begin 		begin		/** Begin of spells **/
global end 		end		/** End of spells **/
```

Cada variável configurável tem: nome, valor de exemplo real, e explicação na mesma linha. O leitor sabe o que trocar sem ler documentação separada.

Há também comentário de regra de negócio no meio do código, em linguagem comum:

```stata
*all endings of spells must be equal to the beginning of the following
```

Uma linha, minúscula, sem jargão, explicando a invariante. Esse é o tom.

## 5. O dado de exemplo é pequeno, real e legível

Do material de spell data adaptado para CRM, a tabela de partida:

| cliente_id | estado | inicio | fim |
|---|---|---|---|
| 1001 | trial | 2024-01-05 | 2024-02-04 |
| 1001 | ativo_basic | 2024-02-05 | 2024-07-31 |
| 1001 | ativo_pro | 2024-08-01 | 2024-11-15 |
| 1001 | churned | 2024-11-16 | 2024-12-31 |

Um cliente. Quatro linhas. Datas reais. Estados com nome de negócio, não de teoria.

Isso responde sozinho o que "episódio", "estado" e "transição" significam, sem precisar de glossário. **A tabela é a definição.**

**Leea hoje**: define os seis termos do vocabulário Sulco em uma frase cada, sem nenhuma tabela dessa. O glossário está fazendo o trabalho que quatro linhas de dado fariam melhor.

## 6. Registro e tom

- Terceira pessoa institucional, mas com "you" para o leitor: "when **you** want to supplement", "**you** might want to combine". O leitor é sujeito da ação.
- Frases curtas a médias, sem subordinação empilhada.
- Vocabulário comum onde dá: "cumbersome", "facilitate", "keep the structure".
- Zero adjetivo de venda. Não tem "poderoso", "inovador", "de ponta", "proprietário".
- O número aparece cru e específico: "296.8 KB", "837 responses", "70.6%", "7.8 out of 10". Nunca arredondado para impressionar.
- Nas páginas de serviço, a instrução é procedimental e nomeia o destinatário: "For any questions please contact the SOEP Community Management", com telefone e e-mail na sequência.

## 7. Como as páginas de SERVICES estruturam uma oferta

Padrão observado em `SOEP-in-Residence` (programa de visitante), que é a página mais parecida com uma oferta comercial:

Quatro categorias de visitante, cada uma em bloco expansível, e dentro de cada bloco sempre a mesma sequência:

1. Quem é o público daquela faixa.
2. O que a pessoa recebe (espaço, acesso a dado, reembolso).
3. Duração possível, em faixas nomeadas: "from a few days to a month", "one month to one year".
4. O que precisa entregar para se candidatar, com limite: "brief description of the research project (three pages maximum)", "current CV".
5. O que se espera como resultado: "publish their findings as a SOEPpaper after the end of their research stay".
6. Uma pessoa nomeada com e-mail direto: "Janina Britzke (jbritzke@diw.de)".

Nenhuma das faixas menciona preço. Mas todas mencionam **duração, requisito de entrada e resultado esperado**.

**Leea hoje**: os três níveis de oferta têm escopo e entregável, mas não têm duração, requisito de entrada, nem resultado esperado. E o CTA é genérico, não tem pessoa nomeada.

## 8. Como o DIW mostra resultado sem inflar

Da página de User Survey, o padrão de reportar número:

> "45.3 % identified as female, 53.9 % as male, and 0.8 % as diverse"
> "R users have more than doubled since 2019", de 20.5% (2019) para 41.5% (2023)
> "Overall satisfaction registers at 7.8 out of 10 points"

E, junto, a ressalva institucional em voz própria: "We are confident that we will be able to provide data earlier again in the future", que é admissão de que houve atraso.

Ou seja: número exato, série temporal com os dois pontos, e o problema admitido na mesma página do resultado.

---

## 9. O que aplicar na Leea, em ordem

1. **Trocar a abertura**: sair do princípio ("O sentido tem duração") e entrar pela dor concreta, no molde das quatro frases do DIW. O princípio pode ficar, mas depois, como conclusão, não como porta de entrada.

2. **Mostrar a tabela de quatro linhas** logo no começo, com um cliente e quatro estados datados. Ela substitui metade do glossário.

3. **Mostrar entrada e saída**. Para pelo menos uma transformação, mostrar o dado antes, o dado depois, e o código no meio. É o que o ZIP do DIW faz e é o que falta na página inteira.

4. **Dar ordem de uso aos seis agentes**, e para cada um declarar entrada, saída e o que ele não faz.

5. **Nomear ferramenta real**. O resto do site do Danilo nomeia RD Station, Mautic, n8n, Power BI, SQL em quase toda seção. A Leea não nomeia nenhuma. Nomear, ainda que como exemplo de onde o dado sai.

6. **Threshold explícito no scrubber**. Enquanto o usuário arrasta, mostrar a regra: qual sinal, qual corte numérico, qual ação disparada, quantos dias antes. Uma regra escrita como regra, não como conceito.

7. **Completar os três níveis de oferta** com duração, requisito de entrada e resultado esperado, no molde do SOEP-in-Residence.

8. **Trocar o stats-band**. Hoje conta partes do próprio framework (6 agentes, 5 etapas, 4 camadas, 3 níveis), que é sumário, não evidência. Substituir por número que descreva o escopo do piloto ou remover.
