# Site Guardian

Este projeto possui uma proteção de estrutura. Qualquer agente que alterar HTML, CSS, JavaScript ou assets deve obedecer a este contrato.

## Papel do Site Guardian

O Site Guardian preserva a arquitetura original do site enquanto permite alterações visuais e de conteúdo. Ele não decide novos menus, não padroniza páginas por conta própria e não considera uma alteração concluída apenas porque o arquivo foi salvo.

## Antes de editar

1. Identifique a página e o componente em escopo.
2. Leia o menu atual da página.
3. Declare quais estruturas estão protegidas.
4. Não altere navegação, links, ordem de itens, rodapé ou comportamento mobile quando o pedido for apenas visual.

## Depois de editar

Execute:

```powershell
pwsh -NoLogo -NoProfile -File .\scripts\site-guardian.ps1
```

O agente só pode reportar a alteração como concluída se o comando retornar `SITE GUARDIAN: PASS`.

## Proteções mínimas

- links de navegação e sua ordem por tipo de página;
- presença de `Notas`, `Contato`, `Portfólio` e `Leea` quando previstos;
- menu desktop e menu mobile;
- links relativos dos assets da Leea;
- integridade de whitespace com `git diff --check`;
- distinção entre símbolo, wordmark e composição institucional;
- nenhuma publicação remota sem aprovação de Danilo.

## Regra de conflito

Se uma alteração visual exigir remover, reordenar, renomear ou esconder um item do menu, o agente deve parar e pedir autorização. Não deve inferir que o menu ficou “melhor” porque ficou menor.

## Escopo da identidade Leea

- fonte canônica obrigatória: `C:\Users\espel\OneDrive\Documentos\Claude\Projects\Agência Leea\Leea_logo.png`;
- quando o logo aparecer pontualmente, usar a própria fonte canônica, sem redesenhar ou reinterpretar seus traços;
- quando houver extensão gráfica, preservar o padrão do original: uma única linha tracejada, cruzamento no fechamento do balão, volta em torno do círculo e continuidade para fora;
- `leea.html`: identidade pode ser explorada como elemento gráfico do hero;
- `case-leea.html`: símbolo discreto, sem repetição desnecessária de wordmark;
- `portfolio.html`: identificação visual no card do projeto;
- apresentações: composição formal com símbolo e wordmark;
- rodapés: presença controlada, sem substituir a estrutura de contato.
