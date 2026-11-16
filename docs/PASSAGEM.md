# EDUCON · documento de passagem

Sistema escolar de **uma escola só** (Colégio Primeiro Sol, João Pessoa) para controle de notas,
frequência e turmas. É uma **refatoração** de um protótipo em JavaScript puro + Vite + localStorage.

- **Protótipo antigo (somente leitura, referência das telas e regras):**
  https://github.com/leandrosudo/educon/tree/develop
- **Este repositório (novo):** Next.js (App Router) + React + TypeScript + Tailwind + Supabase.
  Branch de trabalho: `development`.

## Estado atual

| Item | Estado |
| --- | --- |
| Projeto Supabase | Criado. URL e chave pública abaixo |
| `supabase/migrations/001_schema_educon.sql` | **Já executado** no Supabase |
| Primeiro coordenador (`lucas.ariete`) | Criado em Authentication e ligado em `perfis` |
| Cadastro livre e confirmação de e-mail no Auth | Desligados |
| Projeto Next | **Não criado ainda. É o próximo passo.** |
| Chave `secret` do Supabase | Será colocada só em `.env.local` e na hospedagem, pelo usuário |

```
NEXT_PUBLIC_SUPABASE_URL=https://vmkmqfhanbajlcycjfso.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_CfIo3vSv74js0IHZCuo_7g_gEMWpnMx
SUPABASE_SECRET_KEY=   # só no .env.local, NUNCA no Git nem no chat
```

A chave publishable é pública por desenho. Crie um `.env.example` sem a chave secreta e garanta
que `.env*.local` está no `.gitignore`.

## Decisões já tomadas

- **Uma escola só.** Sem multi-escola, sem painel de administrador, sem cores nem logo
  personalizáveis (foram cortados de propósito; ficam para depois, se fizer sentido).
- **Login por usuário, não por e-mail.** O Supabase exige e-mail, então o site converte
  `usuario` em `usuario@educon.app` (e-mail interno, inexistente, sem confirmação). Quem digita
  vê só o usuário/matrícula. O campo `perfis.usuario` guarda o texto digitado.
- **Contas criadas pelo servidor.** Só o servidor do Next (Server Actions / Route Handlers, com a
  chave `secret`) cria e apaga usuários no Supabase Auth, nunca o navegador. O coordenador cadastra
  aluno e professor; a conta e o registro em `perfis` nascem juntos.
- **Segurança no banco (RLS)** já escrita e testada. O Next deve ainda assim checar o perfil no
  servidor (middleware + grupos de rota) e nunca confiar só em esconder telas.
- **Idioma:** tudo em português (pt-BR), inclusive rotas: `/coordenacao`, `/professor`, `/aluno`.
- **Hospedagem:** a decidir depois (sugestão: Vercel).
- **Prioridade do usuário:** simples. Evite complexidade que ele não pediu.

## Perfis e o que cada um faz

- **Coordenador:** gerencia alunos, turmas, professores e a enturmação; lê toda frequência e nota.
- **Professor:** vê só as suas turmas; registra chamada e lança notas/conceitos dos alunos delas.
- **Aluno:** vê só o próprio boletim e a própria frequência; troca a própria senha.

## Requisitos funcionais (21)

**Público**
- RF01 Home institucional do Colégio Primeiro Sol (apresentação, contatos, botão de acesso).

**Acesso e autenticação**
- RF02 Login com usuário, senha e perfil. RF03 Logout.
- RF04 Cada perfil acessa só as suas páginas.
- RF05 Troca de senha pelo próprio usuário; **obrigatória no primeiro acesso, para todos os perfis**
  (no protótipo só o aluno tinha). Use `perfis.primeiro_acesso` e a função
  `concluir_primeiro_acesso()`.

**Alunos (coordenação)**
- RF06 Cadastrar aluno: matrícula automática (`ano + 3 dígitos`, ex. `2026001`) e conta criada junto.
- RF07 Listar e buscar. RF08 Excluir aluno (a conta do Auth é apagada; perfil, notas e frequência
  vão em cascata).

**Turmas (coordenação)**
- RF09 Criar, editar e excluir turma (nome, segmento, turno, professor regente).
- RF10 Listar e buscar.

**Enturmação (coordenação)**
- RF11 Enturmar e desenturmar, respeitando o segmento (o banco já recusa segmento diferente).

**Professores (coordenação)**
- RF12 Cadastrar professor (CPF validado, usuário e senha inicial gerados).
- RF13 Listar e buscar.
- RF14 Ativar e desativar (inativo não entra e não pode ser regente; o banco já corta o acesso).

**Diário de classe (professor)**
- RF15 Ver só as próprias turmas.
- RF16 Registrar e corrigir chamada por turma e data (presente/falta + observação até 160 caracteres).

**Notas (professor)**
- RF17 Fundamental I: N1 e N2 por disciplina e bimestre (0 a 10), média automática.
- RF18 Educação Infantil: conceito e parecer descritivo por bimestre.

**Portal do aluno**
- RF19 Boletim. RF20 Frequência (**novo**: o protótipo gravava mas o aluno não via). RF21 Imprimir boletim.

## Requisitos não funcionais (13)

- RNF01 Next (App Router), React, TypeScript, Tailwind. RNF02 Supabase (banco e login).
- RNF03 Senhas com hash pelo Supabase Auth, nunca em texto puro.
- RNF04 Permissões no banco (RLS): aluno só os próprios dados, professor só as suas turmas.
- RNF05 Chaves em variáveis de ambiente; a `secret` nunca vai ao navegador nem ao Git.
- RNF06 Dados no banco, sem registros órfãos ao excluir e sem reaproveitar matrícula.
- RNF07 Validação de formulários no cliente e no servidor (sugestão: zod).
- RNF08 Layout responsivo. RNF09 Acessibilidade básica (rótulos, teclado, contraste). RNF10 pt-BR.
- RNF11 Regras de negócio separadas da interface e com testes (Vitest).
- RNF12 Lint e build automáticos a cada alteração (GitHub Actions).
- RNF13 Publicado online (hospedagem a decidir).

## Banco de dados (resumo; a fonte da verdade é o SQL)

Tabelas: `perfis` (1 por usuário do Auth; `perfil`, `nome`, `usuario`, `primeiro_acesso`, `ativo`),
`professores`, `turmas`, `alunos`, `frequencias`, `notas_fundamental`, `avaliacoes_infantis`.
View `boletim_fundamental` (média = (N1+N2)/2, só quando as duas existem; usa `security_invoker`).

- Segmentos: `educacao_infantil`, `fundamental_1`. Turnos: `matutino`, `vespertino`.
- Disciplinas do Fundamental I: Língua Portuguesa, Matemática, Ciências, História, Geografia.
- Educação Infantil: um conceito por bimestre (`Desenvolvimento Satisfatório` ou `Em Desenvolvimento`)
  + parecer (até 400 caracteres). O boletim infantil mostra 3 áreas (Linguagem, Matemática,
  Natureza e Sociedade), todas com o conceito do bimestre; no protótipo o conceito vira o código
  `D` ou `EM`.
- Bimestres: 1 a 4. Notas de 0 a 10 com uma casa decimal.
- A criação de aluno usa `public.proxima_matricula()`, que **só o `service_role` pode chamar**
  (a coluna `matricula` já tem esse default, então um `insert` feito pelo servidor basta).
- Excluir turma: alunos ficam sem turma e a chamada dela é apagada. Excluir a conta do Auth
  apaga perfil, aluno, notas e frequência em cascata.
- O coordenador só **lê** frequência e notas; quem escreve é o professor da turma.
- O `perfis.usuario` do coordenador é `lucas.ariete`; o e-mail interno é `lucas.ariete@educon.app`.

## Regras de negócio herdadas do protótipo (portar para `src/lib/domain`, com testes)

- **CPF:** 11 dígitos, rejeita sequências repetidas (`111.111.111-11`), valida os dois dígitos
  verificadores. Guardar só dígitos; formatar `000.000.000-00` na tela.
- **Telefone:** 10 ou 11 dígitos (DDD + número). Formatar `(83) 99999-8888`.
- **Aluno:** a **senha inicial é a própria matrícula** e o usuário de login é a matrícula.
  Primeiro acesso obrigatório.
- **Professor:** usuário = `nome.sobrenome` minúsculo e sem acento, ignorando títulos com ponto
  (`Prof.ª`, `Dr.`); se repetir, `ana.souza2`, `ana.souza3`. Senha inicial = `sobrenome` + `nome` +
  4 últimos dígitos do celular, minúscula, sem acento (ex. `rochacamila8888`). Exige nome e sobrenome.
- **Média:** (N1 + N2) / 2; a média geral é a média das médias existentes.
- **Enturmação:** aluno só entra em turma do próprio segmento; só aparecem para enturmar os alunos
  do segmento da turma que ainda não têm turma.

## Telas a portar (veja o protótipo antigo)

| Perfil | Tela | Arquivos do protótipo |
| --- | --- | --- |
| Público | Home | `index.html` |
| Público | Login | `src/pages/login.html`, `src/js/login.js` |
| Coordenação | Painel (Turmas, Alunos, Professores, Enturmar) | `coord.html`, `coord.js`, `components/modalCadastro.js`, `services/cadastrosService.js` |
| Professor | Diário + Notas | `prof.html`, `prof.js`, `services/frequenciaService.js`, `services/notasService.js` |
| Aluno | Boletim, troca de senha, impressão | `aluno.html`, `aluno.js` |

Reaproveite o **visual** (cores, layout) com Tailwind, mas não copie a estrutura: no protótipo as
telas são montadas com `document.createElement`; aqui viram componentes React.

## Bugs do protótipo que NÃO devem ser repetidos

- Turma guardava o professor pelo **nome** e o filtro procurava por id: todo professor via todas
  as turmas. Aqui: `turmas.professor_id` (FK) e RLS.
- Senhas em texto puro no localStorage. Aqui: Supabase Auth.
- Excluir aluno não apagava notas e frequência; matrícula era reaproveitada. Aqui: cascata e sequência.
- Segmento escrito de dois jeitos (`FUNDAMENTAL_1` × `Ensino Fundamental I`). Aqui: um enum só.
- Modais sem Esc/foco e `window.alert/confirm`. Aqui: modal acessível reutilizável.
- Botões «Horário das aulas» e «Fórum de avisos» do aluno eram só um alerta. **Fora do escopo.**

## Fora do escopo (por ora)

Multi-escola, cores e logo personalizáveis, recuperação de senha por e-mail, horário de aulas,
fórum de avisos, financeiro, app móvel, notificações, situação final (aprovado/reprovado).

## Ordem sugerida

1. **Base:** `create-next-app` (TypeScript, Tailwind, ESLint, App Router, `src/`), `.env.example`,
   clientes Supabase (`@supabase/ssr`), estrutura de pastas por perfil, Vitest, CI.
2. **Domínio:** `src/lib/domain` com CPF, telefone, média, geração de usuário e senha, com testes.
3. **Acesso:** login (usuário → e-mail interno), middleware, logout, troca de senha / primeiro acesso.
4. **Coordenação:** turmas, alunos, professores, enturmação.
5. **Professor:** diário e notas.
6. **Aluno:** boletim, frequência, impressão.
7. **Home**, acessibilidade, testes ponta a ponta, deploy.

Avance por partes pequenas e mostre cada uma ao usuário antes de seguir.
