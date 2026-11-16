-- =====================================================================
-- EDUCON · esquema inicial (uma escola · Supabase / Postgres)
--
-- Como usar: Supabase > SQL Editor > New query > cole TUDO > Run.
-- Rode uma única vez, em um projeto vazio.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tipos
-- ---------------------------------------------------------------------
create type public.perfil_usuario   as enum ('coordenador', 'professor', 'aluno');
create type public.segmento_escolar as enum ('educacao_infantil', 'fundamental_1');
create type public.turno_escolar    as enum ('matutino', 'vespertino');
create type public.status_presenca  as enum ('presente', 'falta');

-- ---------------------------------------------------------------------
-- 2. Tabelas
-- ---------------------------------------------------------------------

-- Um perfil por usuário do Supabase Auth. "usuario" é o que a pessoa digita
-- no login (matrícula, nome.sobrenome...). O site converte para um e-mail interno.
create table public.perfis (
  id              uuid primary key references auth.users (id) on delete cascade,
  perfil          public.perfil_usuario not null,
  nome            text not null,
  usuario         text not null unique,
  primeiro_acesso boolean not null default true,
  ativo           boolean not null default true,
  criado_em       timestamptz not null default now()
);

create table public.professores (
  id        uuid primary key default gen_random_uuid(),
  perfil_id uuid not null unique references public.perfis (id) on delete cascade,
  nome      text not null,
  email     text not null unique check (email = lower(email)),
  cpf       text not null unique check (cpf ~ '^[0-9]{11}$'),   -- só dígitos; o dígito verificador é validado no site
  telefone  text not null check (telefone ~ '^[0-9]{10,11}$'),
  ativo     boolean not null default true,
  criado_em timestamptz not null default now()
);

create table public.turmas (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null unique,
  segmento     public.segmento_escolar not null,
  turno        public.turno_escolar not null,
  professor_id uuid references public.professores (id) on delete set null,
  criado_em    timestamptz not null default now()
);
create index on public.turmas (professor_id);

-- A sequência nunca volta atrás: uma matrícula excluída não é reaproveitada.
create sequence public.matricula_seq;

create function public.proxima_matricula() returns text
language sql security definer set search_path = '' as $$
  select to_char(now(), 'YYYY') || lpad(nextval('public.matricula_seq')::text, 3, '0');
$$;
-- Funções do schema public ficam chamáveis pela API do Supabase. Esta só o servidor do site
-- (chave secreta / service_role) pode usar, para ninguém "queimar" números de matrícula.
revoke all on function public.proxima_matricula() from public, anon, authenticated;
grant execute on function public.proxima_matricula() to service_role;

create table public.alunos (
  id               uuid primary key default gen_random_uuid(),
  perfil_id        uuid not null unique references public.perfis (id) on delete cascade,
  matricula        text not null unique default public.proxima_matricula(),
  nome             text not null,
  email            text,
  nome_responsavel text not null,
  telefone         text not null,
  segmento         public.segmento_escolar not null,
  data_nascimento  date not null,
  turma_id         uuid references public.turmas (id) on delete set null,  -- excluir a turma desenturma os alunos
  criado_em        timestamptz not null default now()
);
create index on public.alunos (turma_id);

-- Chamada: um registro por turma + data + aluno.
-- Excluir aluno ou turma apaga também a frequência ligada a eles (sem registros órfãos).
create table public.frequencias (
  id            uuid primary key default gen_random_uuid(),
  turma_id      uuid not null references public.turmas (id) on delete cascade,
  aluno_id      uuid not null references public.alunos (id) on delete cascade,
  data          date not null,
  status        public.status_presenca not null,
  observacao    text not null default '' check (char_length(observacao) <= 160),
  atualizado_em timestamptz not null default now(),
  unique (turma_id, data, aluno_id)
);
create index on public.frequencias (aluno_id);

-- Fundamental I: N1 e N2 por disciplina e bimestre. A média é calculada na view abaixo.
create table public.notas_fundamental (
  id         uuid primary key default gen_random_uuid(),
  aluno_id   uuid not null references public.alunos (id) on delete cascade,
  disciplina text not null check (disciplina in
               ('Língua Portuguesa', 'Matemática', 'Ciências', 'História', 'Geografia')),
  bimestre   smallint not null check (bimestre between 1 and 4),
  n1         numeric(3,1) check (n1 between 0 and 10),
  n2         numeric(3,1) check (n2 between 0 and 10),
  unique (aluno_id, disciplina, bimestre)
);

-- Educação Infantil: conceito e parecer descritivo por bimestre.
create table public.avaliacoes_infantis (
  id       uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos (id) on delete cascade,
  bimestre smallint not null check (bimestre between 1 and 4),
  conceito text check (conceito in ('Desenvolvimento Satisfatório', 'Em Desenvolvimento')),
  parecer  text not null default '' check (char_length(parecer) <= 400),
  unique (aluno_id, bimestre)
);

-- Boletim do Fundamental I: média = (N1 + N2) / 2, só quando as duas notas existem.
-- security_invoker faz a view respeitar as regras de acesso de quem consulta.
create view public.boletim_fundamental with (security_invoker = true) as
  select aluno_id, disciplina, bimestre, round((n1 + n2) / 2, 1) as media
  from public.notas_fundamental
  where n1 is not null and n2 is not null;

-- ---------------------------------------------------------------------
-- 3. Gatilhos (regras que o banco garante sozinho)
-- ---------------------------------------------------------------------
create function public.definir_atualizado_em() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;
create trigger frequencias_atualizado
  before update on public.frequencias
  for each row execute function public.definir_atualizado_em();

-- O aluno só entra em turma do próprio segmento.
create function public.validar_segmento_do_aluno() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  seg public.segmento_escolar;
begin
  if new.turma_id is not null then
    select segmento into seg from public.turmas where id = new.turma_id;
    if seg is distinct from new.segmento then
      raise exception 'O aluno não pertence ao segmento desta turma.';
    end if;
  end if;
  return new;
end;
$$;
create trigger alunos_segmento
  before insert or update of turma_id, segmento on public.alunos
  for each row execute function public.validar_segmento_do_aluno();

-- A turma não muda de segmento enquanto tiver alunos.
create function public.validar_segmento_da_turma() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.segmento is distinct from old.segmento
     and exists (select 1 from public.alunos where turma_id = new.id) then
    raise exception 'A turma tem alunos. Remova-os antes de mudar o segmento.';
  end if;
  return new;
end;
$$;
create trigger turmas_segmento
  before update of segmento on public.turmas
  for each row execute function public.validar_segmento_da_turma();

-- ---------------------------------------------------------------------
-- 4. Funções de apoio às regras de acesso
--    (security definer: leem as tabelas sem cair em recursão de RLS.
--     Professor ou usuário inativo não recebe nenhum acesso.)
-- ---------------------------------------------------------------------
create function public.perfil_atual() returns public.perfil_usuario
language sql stable security definer set search_path = '' as $$
  select perfil from public.perfis where id = auth.uid() and ativo;
$$;

create function public.e_coordenador() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.perfil_atual() = 'coordenador', false);
$$;

create function public.professor_id_atual() returns uuid
language sql stable security definer set search_path = '' as $$
  select p.id
  from public.professores p
  join public.perfis f on f.id = p.perfil_id
  where p.perfil_id = auth.uid() and p.ativo and f.ativo;
$$;

create function public.aluno_id_atual() returns uuid
language sql stable security definer set search_path = '' as $$
  select a.id
  from public.alunos a
  join public.perfis f on f.id = a.perfil_id
  where a.perfil_id = auth.uid() and f.ativo;
$$;

create function public.turma_id_do_aluno_atual() returns uuid
language sql stable security definer set search_path = '' as $$
  select turma_id from public.alunos where perfil_id = auth.uid();
$$;

create function public.turma_do_professor(t uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.turmas
    where id = t and professor_id = public.professor_id_atual()
  );
$$;

create function public.aluno_do_professor(a uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.alunos al
    join public.turmas t on t.id = al.turma_id
    where al.id = a and t.professor_id = public.professor_id_atual()
  );
$$;

create function public.aluno_na_turma(a uuid, t uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.alunos where id = a and turma_id = t);
$$;

-- O próprio usuário marca que já trocou a senha inicial.
create function public.concluir_primeiro_acesso() returns void
language sql security definer set search_path = '' as $$
  update public.perfis set primeiro_acesso = false where id = auth.uid();
$$;
revoke all on function public.concluir_primeiro_acesso() from public, anon;
grant execute on function public.concluir_primeiro_acesso() to authenticated;

-- ---------------------------------------------------------------------
-- 5. Regras de acesso (RLS)
--    Criar e apagar contas (Supabase Auth) é feito só pelo servidor do site,
--    com a chave secreta. Nada abaixo permite isso ao navegador.
-- ---------------------------------------------------------------------
alter table public.perfis             enable row level security;
alter table public.professores         enable row level security;
alter table public.turmas              enable row level security;
alter table public.alunos              enable row level security;
alter table public.frequencias         enable row level security;
alter table public.notas_fundamental   enable row level security;
alter table public.avaliacoes_infantis enable row level security;

-- Perfis: cada um vê o seu; o coordenador vê todos.
create policy perfis_ler on public.perfis
  for select to authenticated
  using (id = auth.uid() or public.e_coordenador());

-- Professores
create policy professores_ler on public.professores
  for select to authenticated
  using (public.e_coordenador() or perfil_id = auth.uid());
create policy professores_coordenacao on public.professores
  for all to authenticated
  using (public.e_coordenador()) with check (public.e_coordenador());

-- Turmas: coordenador todas; professor as suas; aluno a sua.
create policy turmas_ler on public.turmas
  for select to authenticated
  using (
    public.e_coordenador()
    or professor_id = public.professor_id_atual()
    or id = public.turma_id_do_aluno_atual()
  );
create policy turmas_coordenacao on public.turmas
  for all to authenticated
  using (public.e_coordenador()) with check (public.e_coordenador());

-- Alunos: coordenador todos; professor os das suas turmas; aluno só ele.
create policy alunos_ler on public.alunos
  for select to authenticated
  using (
    public.e_coordenador()
    or perfil_id = auth.uid()
    or public.turma_do_professor(turma_id)
  );
create policy alunos_coordenacao on public.alunos
  for all to authenticated
  using (public.e_coordenador()) with check (public.e_coordenador());

-- Frequências: professor registra nas suas turmas; aluno lê as dele; coordenador lê todas.
create policy frequencias_professor on public.frequencias
  for all to authenticated
  using (public.turma_do_professor(turma_id))
  with check (
    public.turma_do_professor(turma_id)
    and public.aluno_na_turma(aluno_id, turma_id)
  );
create policy frequencias_aluno on public.frequencias
  for select to authenticated
  using (aluno_id = public.aluno_id_atual());
create policy frequencias_coordenacao on public.frequencias
  for select to authenticated
  using (public.e_coordenador());

-- Notas (Fundamental I)
create policy notas_professor on public.notas_fundamental
  for all to authenticated
  using (public.aluno_do_professor(aluno_id))
  with check (public.aluno_do_professor(aluno_id));
create policy notas_aluno on public.notas_fundamental
  for select to authenticated
  using (aluno_id = public.aluno_id_atual());
create policy notas_coordenacao on public.notas_fundamental
  for select to authenticated
  using (public.e_coordenador());

-- Avaliações (Educação Infantil)
create policy avaliacoes_professor on public.avaliacoes_infantis
  for all to authenticated
  using (public.aluno_do_professor(aluno_id))
  with check (public.aluno_do_professor(aluno_id));
create policy avaliacoes_aluno on public.avaliacoes_infantis
  for select to authenticated
  using (aluno_id = public.aluno_id_atual());
create policy avaliacoes_coordenacao on public.avaliacoes_infantis
  for select to authenticated
  using (public.e_coordenador());
