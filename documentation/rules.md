REGRAS FUNDAMENTAIS DO DESENVOLVIMENTO - LEIA E SIGA RIGOROSAMENTE

1. COMUNICAÇÃO E ESCOPO:
   - Comunique-se EXCLUSIVAMENTE em português do Brasil.
   - No início de cada resposta, confirme e repita o escopo exato da solicitação.
   - ANTES de qualquer implementação, liste todos os arquivos que serão modificados e aguarde minha aprovação.
   - Nunca presuma a necessidade de modificações além do expressamente solicitado.
   - Explique suas decisões técnicas de forma clara e objetiva.
   - Priorize sempre a preservação da estrutura existente do código. Não altere nada desnecessariamente.

2. ANÁLISE DO SISTEMA EXISTENTE:
   - OBRIGATÓRIO: Realize uma análise completa do codebase antes de qualquer sugestão.
   - Identifique e cite explicitamente componentes, funções e padrões existentes que se relacionam com a tarefa.
   - Se existirem estruturas similares, utilize-as como modelo absoluto, mantendo consistência total.
   - Mantenha 100% dos padrões existentes.
   - Indique claramente: "Estou usando [componente/arquivo X] como referência para manter consistência."

3. REAPROVEITAMENTO E CONSULTA
- Antes de qualquer implementação/correção consulte detalhadamente o que já foi feito no sistema.
- Por sermos um SaaS, muito provavelmente o que você fará já foi feito em outros módulos do sistema. Portanto, use e consulte outros módulos do sistema como referência.
- Implemente algo do zero EXCLUSIVAMENTE se nada parecido tenha sido feito no sistema anteriormente.

4. Durante a implementação:
 - Mantenha as tecnologias existentes do projeto (ex: Tailwind CSS).
 - Escreva código em inglês, seguindo o padrão snake_case para variáveis e métodos, e PascalCase para classes.


5. RESTRIÇÕES CRÍTICAS DE MODIFICAÇÃO:
   - É EXPRESSAMENTE PROIBIDO alterar qualquer arquivo não mencionado na solicitação atual.
   - É EXPRESSAMENTE PROIBIDO modificar layouts, estilos ou elementos visuais existentes.
   - É EXPRESSAMENTE PROIBIDO adicionar funcionalidades extras "por melhorias" ou "boas práticas".
   - É EXPRESSAMENTE PROIBIDO refatorar código existente sem autorização específica.
   - Não implemente regras de negócio não solicitadas sem aprovação prévia

6. PRESERVAÇÃO DA INTEGRIDADE DO SISTEMA:
   - Mantenha absoluta fidelidade à arquitetura existente.
   - Preserve rigorosamente todos os padrões visuais e estruturais implementados.
   - Respeite a hierarquia de diretórios e a organização de arquivos atual.
   - Qualquer dúvida sobre a estrutura deve ser esclarecida ANTES da implementação.

7. IMPLEMENTAÇÃO TÉCNICA:
   - Siga inquestionavelmente os padrões SOLID e Clean Architecture conforme implementados.
   - Priorize componentes reutilizáveis já existentes no sistema.
   - Mantenha consistência absoluta com os padrões de nomenclatura existentes.
   - Documente o código quando necessário, seguindo o estilo de documentação já presente.
   - Escreva código pragmático, legível e facilmente manutenível.

8. PROCESSO DE VERIFICAÇÃO E ENTREGA:
   - Antes de finalizar, execute uma verificação completa contra todas as regras acima.
   - Compare o código criado com exemplos existentes para garantir consistência total.
   - Se houver QUALQUER conflito entre a solicitação e estas regras, peça esclarecimento antes de prosseguir.
   - Ao entregar, confirme explicitamente: "Verifiquei que esta implementação segue todas as regras estabelecidas."

9. MANUTENÇÃO DE CONTEXTO:
   - No início de cada nova sessão, faça um breve resumo do contexto anterior.
   - Mantenha registro mental das decisões importantes tomadas anteriormente.
   - Quando receber instruções que pareçam contradizer o histórico, solicite confirmação.

10. CONTROLE DE MUDANÇAS:
   - Toda alteração deve ser justificada com base em requisitos explícitos.
   - Apresente as implementações de forma incremental para facilitar a revisão.
   - Destaque claramente o que foi modificado em cada arquivo.

11. Finalize sua mensagem com um check das solicitações feitas pelo usuário que você implementou.