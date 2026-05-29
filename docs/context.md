# JobTrackr — Contexto do Projeto

---

## O que é o projeto

JobTrackr é uma aplicação web para organizar candidaturas de emprego. O objetivo principal é que o usuário tenha facilidade em acompanhar o dia a dia das suas aplicações, com um feed claro e objetivo — sem precisar ficar clicando em diversos lugares para encontrar a vaga que aplicou.

O problema que resolve: quando a pessoa se candidata a muitas vagas ao mesmo tempo, perde o controle de onde aplicou, por qual plataforma, em qual etapa está cada processo e quando fazer follow-up.

---

## Para quem é

**Perfil primário:** 18 a 35 anos, em busca do primeiro emprego ou recolocação, com alguma familiaridade com tecnologia mas não necessariamente avançada.

**Perfil secundário:** 35 a 60 anos, recolocação no mercado, pode ter menos familiaridade com tecnologia.

**Consequência direta para o código:** a interface precisa ser limpa, intuitiva e funcionar sem necessidade de tutorial. Nunca assuma que o usuário é técnico.

---

## Regras invioláveis do produto

Estas três regras nunca podem ser comprometidas, independente de qualquer decisão técnica ou de prazo:

1. **Nunca perder ou corromper dados do usuário** — toda operação de escrita precisa ser confiável e tratada com erro adequado.
2. **Nunca exigir mais de dois cliques para cadastrar ou atualizar uma candidatura** — fluxos longos ou confusos destroem o propósito do app.
3. **Nunca expor dados de um usuário para outro** — Row Level Security (RLS) aplicado em todas as tabelas, sem exceção.

---

## Stack

| Camada       | Tecnologia                                            |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 14 com App Router                             |
| Linguagem    | TypeScript — tipagem obrigatória em todos os arquivos |
| Estilo       | Tailwind CSS + shadcn/ui (preset Nova)                |
| Backend/Auth | Supabase (PostgreSQL + Auth Google OAuth + RLS)       |
| Gráficos     | Recharts                                              |
| Ícones       | Lucide React                                          |
| Utilitários  | date-fns                                              |
| Deploy       | Vercel                                                |

---

## Estrutura de pastas

```
jobtrackr/
├── app/
│   ├── (auth)/                 # Rotas públicas — login, callback OAuth
│   ├── (dashboard)/            # Rotas protegidas — requer autenticação
│   │   ├── board/              # Kanban de candidaturas
│   │   ├── dashboard/          # Gráficos e métricas
│   │   └── settings/           # Perfil do usuário
│   └── api/                    # Route handlers Next.js
├── components/
│   ├── ui/                     # Componentes base do shadcn (nunca editar diretamente)
│   ├── board/                  # Componentes do kanban
│   ├── dashboard/              # Componentes de gráficos
│   └── layout/                 # Header, sidebar, navegação
├── lib/
│   ├── supabase/               # client.ts (browser) e server.ts (servidor)
│   └── utils/                  # Funções auxiliares
├── types/                      # Tipos TypeScript do domínio
├── docs/                       # Documentação do projeto
└── supabase/
    └── migrations/             # Schema SQL versionado
```

---

## Decisões de segurança

### Autenticação — por que não usamos JWT manual nem bcrypt

O JobTrackr usa **exclusivamente login com Google OAuth via Supabase Auth**. Essa decisão elimina a necessidade de implementar JWT e bcrypt manualmente — e isso é intencional.

**JWT** — o Supabase já gera, assina e valida JWTs automaticamente em cada sessão. O token é armazenado em cookie seguro e o middleware do Next.js o valida em cada requisição protegida. Não instalar `jsonwebtoken` ou qualquer biblioteca de JWT manual.

**Bcrypt** — é usado para fazer hash de senhas. Como não existe cadastro com email e senha no JobTrackr, não há senha trafegando pelo sistema em momento algum. O Google autentica o usuário e devolve um token seguro para o Supabase. Não instalar `bcrypt` ou `bcryptjs`.

**Resumo:** autenticação é responsabilidade do Supabase + Google. Nunca reimplementar o que eles já fazem.

### Isolamento de dados

- RLS (Row Level Security) ativo em todas as tabelas do Supabase
- Nenhuma query retorna dados de outro usuário — isso é garantido no banco, não só na aplicação
- A política aplicada é: `auth.uid() = user_id` em todas as operações

---

## Regras de arquitetura

### Sobre Server e Client Components

- Por padrão, todo componente é Server Component no Next.js App Router
- Só adicionar `"use client"` quando o componente precisar de: estado (`useState`), efeitos (`useEffect`), eventos do navegador (`onClick`, `onChange`) ou hooks do React
- Nunca adicionar `"use client"` por precaução — só quando realmente necessário
- Busca de dados sempre no servidor quando possível — nunca fazer fetch no cliente se puder fazer no servidor

### Sobre o Supabase

- `lib/supabase/client.ts` → usar em componentes com `"use client"`
- `lib/supabase/server.ts` → usar em Server Components, Server Actions e Route Handlers
- Nunca acessar o Supabase diretamente nas páginas — sempre via funções em `lib/`
- RLS ativo em todas as tabelas — nunca desativar

### Sobre componentes

- Componentes da pasta `components/ui/` são do shadcn — nunca editar diretamente
- Componentes customizados ficam em `components/board/`, `components/dashboard/` ou `components/layout/`
- Cada componente em seu próprio arquivo
- Nomear em PascalCase: `ApplicationCard.tsx`, `BoardColumn.tsx`

### Sobre TypeScript

- Sem `any` — sempre tipar corretamente
- Tipos do domínio ficam em `types/`
- Usar os tipos gerados pelo Supabase sempre que possível

### Sobre estilo

- Tailwind CSS para estilo — sem CSS puro separado
- Não criar classes CSS customizadas sem necessidade
- Seguir o design system do shadcn com preset Nova
- Interface mobile-first — toda tela precisa funcionar bem no celular

---

## O que o Cursor deve fazer

- Seguir a estrutura de pastas definida acima — nunca criar arquivos fora do lugar
- Usar TypeScript em todos os arquivos — sem arquivos `.js`
- Usar os componentes do shadcn já instalados antes de criar componentes do zero
- Tratar erros em toda operação com o Supabase
- Comentar apenas o que não é óbvio — sem comentários desnecessários
- Gerar código limpo, legível e pronto para produção
- **Consultar o Context7 antes de escrever código que envolva bibliotecas externas** — especialmente `next`, `@supabase/ssr`, `@dnd-kit` e `recharts`, pois APIs mudam entre versões

## O que o Cursor não deve fazer

- Não usar `any` no TypeScript
- Não adicionar `"use client"` sem necessidade real
- Não criar lógica de banco de dados fora de `lib/supabase/`
- Não editar arquivos dentro de `components/ui/`
- Não instalar novas bibliotecas sem perguntar primeiro
- Não criar CSS puro quando Tailwind resolve
- Não ignorar tratamento de erros
- Não criar componentes gigantes — separar responsabilidades

---

## Status atual do projeto

- [x] Setup Next.js + TypeScript + Tailwind
- [x] shadcn/ui instalado (preset Nova)
- [x] Supabase conectado (client e server)
- [x] Middleware de autenticação criado
- [x] Estrutura de pastas criada
- [x] Schema SQL executado no Supabase (tabela applications + RLS)
- [x] Repositório no GitHub configurado
- [ ] Página de login com Google OAuth
- [ ] Layout do dashboard com sidebar
- [ ] Board Kanban
- [ ] CRUD de candidaturas
- [ ] Dashboard com gráficos

---

_Última atualização: maio de 2026_
