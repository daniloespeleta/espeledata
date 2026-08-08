# Post para LinkedIn, case espeledata.com

Arquivo de trabalho, não vai ao ar. Escolha uma das versões, copie e cole.
Regra de voz: sem travessão, sem emoji, sem bajulação.

---

## Versão A, o bug como gancho (recomendada)

O meu próprio site me pegou numa armadilha que eu já tinha visto em CRM.

Ele é bilíngue por um desenho simples: cada página existe uma vez só, com português e inglês no mesmo arquivo, marcados por classe. Na hora de publicar, um script apaga o idioma oposto e escreve duas versões. Assim é impossível corrigir um idioma e esquecer o outro, porque os dois estão na mesma linha.

Junto disso eu escrevi um validador que roda depois do build e reprova a publicação. Ele confere idioma por URL, canonical, hreflang, um único H1, formulário na língua certa. E confere uma regra minha de escrita: travessão é proibido no site inteiro. Se aparecer um, o build falha.

Aí entrou uma página nova. Ela usava classe composta, tipo "step en" em vez de só "en". O separador procurava a string exata, não encontrou, e não apagou nada. A versão em português passou a exibir o texto em inglês inteiro.

O validador não acusou. Porque ele procurava exatamente a mesma string.

O erro não foi de CSS. Foi que a verificação herdou a suposição errada do código que ela deveria vigiar. Quando o teste e o alvo compartilham o mesmo ponto cego, o teste passa e o problema vai ao ar.

Isso é a mesma coisa que acontece em operação de CRM. O relatório que você usa para conferir a régua foi construído com a mesma premissa da régua. Os dois concordam, e nenhum dos dois está certo.

Escrevi o case completo, com a auditoria de tipografia que veio junto e como a construção foi feita em par com um agente de codificação.

espeledata.com/case-espeledata.html

---

## Versão B, o método como gancho

Transformei a construção do meu portfólio em case, e o motivo é que ele testa uma tese que eu defendo em CRM.

Trinta e duas páginas publicadas, dezesseis em dois idiomas. Zero dependência de terceiros, o repositório nem tem package.json. Um arquivo-fonte por página, com português e inglês convivendo, separados só na hora de publicar. E vinte e oito asserções que rodam a cada build e reprovam o deploy.

Uma dessas asserções não é técnica, é editorial: travessão é proibido no site. Se um aparecer, o build quebra.

Essa é a parte que interessa. Padrão de escrita costuma morar em documento que ninguém abre. Aqui ele mora no mesmo lugar que o teste de código, e tem o mesmo poder de veto.

A construção foi feita em par com um agente de codificação, e a divisão que funcionou é a que eu uso em CRM: o modelo lê, propõe e escreve; o código calcula e verifica; a decisão do que vai ao ar é minha. O validador existe justamente para essa última parte não depender de confiança.

O case tem o passo a passo, incluindo o bug que o próprio sistema deixou passar e a auditoria de tipografia que mostrou que o texto mais importante das páginas estava tratado como legenda.

espeledata.com/case-espeledata.html

---

## Versão C, curta

Padrão de escrita normalmente vive num documento que ninguém abre.

No meu site, ele virou asserção de CI. Travessão é proibido, e se um aparecer o build falha e a página não publica.

Junto com isso: site bilíngue com um arquivo-fonte por página, sem framework, sem dependência, com a separação de idioma acontecendo só na hora de publicar. Vinte e oito checagens por build.

Transformei em case, com o bug que o próprio validador deixou passar.

espeledata.com/case-espeledata.html

---

## Sugestão de hashtags

Usar poucas, três a cinco. Sugestões:
#CRM #LifecycleMarketing #MarketingOps #IA #Automacao

## Observações

1. Confirmar o link antes de postar. A página está em espeledata.com/case-espeledata.html
2. Se for postar em inglês, a versão EN da página fica em espeledata.com/en/case-espeledata.html
3. As duas certificações novas da Anthropic já estão no site, na seção de Certificações da home.
