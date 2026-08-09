# Protocolo de alteração do site

Este documento protege a estrutura original do espeledata.com durante alterações visuais, de conteúdo e de identidade.

## Regra principal

Uma alteração deve modificar somente o componente pedido. Nenhum ajuste de logo, tipografia, cor, espaçamento ou hero pode remover, reordenar ou renomear itens de navegação sem autorização explícita.

## Menus protegidos

O site possui variações legítimas de menu por tipo de página. A diferença é intencional e não pode ser corrigida por “padronização” automática.

### Home

`Sobre → Agência Leea → Trajetória → Portfólio → Notas → Contato`

### Portfólio

`Início → Sobre → Portfólio → Notas → Contato`

### Agência Leea

`Início → Sobre → Portfólio → Agência Leea → Notas → Contato`

### Notas

`Início → Sobre → Agência Leea → Portfólio → Notas → Contato`

### Contato

`Início → Sobre → Portfólio → Notas → Contato`

### Cases

`Início → Portfólio → Agência Leea → Contato`

O menu desktop e o menu lateral mobile precisam manter a mesma arquitetura de links dentro de cada página.

## Processo obrigatório

Antes de editar:

1. identificar a página e o componente em escopo;
2. registrar o estado atual do menu;
3. declarar o que não será alterado;
4. confirmar se a alteração é visual, estrutural ou de conteúdo.

Depois de editar:

1. executar `scripts/validate-site-structure.ps1`;
2. abrir a página em desktop e mobile;
3. testar a entrada e a saída pelo menu;
4. conferir a presença de `Notas`, `Contato`, `Portfólio` e `Agência Leea` conforme a variação esperada;
5. só então considerar a alteração pronta para publicação.

## Proibições

- não substituir o menu inteiro para inserir uma marca;
- não remover links porque “não cabem” em uma composição visual;
- não reduzir o menu para acomodar logo, wordmark ou hero;
- não usar a aparência de uma página como referência para sobrescrever outra;
- não publicar sem validação local e aprovação de Danilo.

## Uso da identidade Leea

Na página oficial da agência, o símbolo pode funcionar como elemento gráfico do hero, em orientação horizontal ou vertical. No case, a identidade deve ser discreta. Em apresentações formais, símbolo e wordmark podem aparecer juntos.

A versatilidade do logo não autoriza alterar a estrutura de navegação.
