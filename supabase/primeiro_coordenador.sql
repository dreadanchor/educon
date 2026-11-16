-- =====================================================================
-- EDUCON · primeiro coordenador
--
-- Rode DEPOIS do 001_schema_educon.sql.
--
-- 1) No Supabase: Authentication > Users > Add user > Create new user
--      E-mail:   seu.usuario@educon.app      (o que vem antes do @ é o "usuário" do login)
--      Senha:    a que você quiser
--      Marque "Auto Confirm User".
-- 2) Copie o "User UID" do usuário criado.
-- 3) Troque os três valores abaixo (UID, nome e usuário) e rode no SQL Editor.
--    O "usuário" precisa ser igual ao que vem antes do @ do e-mail.
-- =====================================================================
insert into public.perfis (id, perfil, nome, usuario, primeiro_acesso)
values (
  'COLE-O-USER-UID-AQUI',
  'coordenador',
  'SEU NOME COMPLETO',
  'seu.usuario',
  false
);
