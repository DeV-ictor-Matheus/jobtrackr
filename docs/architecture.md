# JobTrackr — Arquitetura

> Documento técnico de referência. Explica como o sistema funciona por baixo dos panos e por que cada decisão foi tomada.

---

## Visão geral

O JobTrackr é uma aplicação Next.js full-stack com renderização no servidor, autenticação via Google OAuth delegada ao Supabase, e banco de dados PostgreSQL com isolamento de dados por usuário via RLS.

```
Navegador → Next.js (servidor) → Supabase (banco + auth)
                ↑
           Middleware
         (valida sessão)
```

---

## Fluxo de autenticação

O app nunca vê a senha do usuário. Todo o processo de validação de credenciais é delegado ao Google e ao Supabase.

```
1. Usuário clica em "Entrar com Google"
        ↓
2. Supabase redireciona para os servidores do Google
        ↓
3. Google valida as credenciais e devolve um código temporário
        ↓
4. Google redireciona para /auth/callback?code=xxxxx
        ↓
5. app/(auth)/auth/callback/route.ts
   └── supabase.auth.exchangeCodeForSession(code)
   └── Supabase troca o código por uma sessão JWT
        ↓
6. Sessão salva em cookie seguro
        ↓
7. Usuário redirecionado para /board
        ↓
8. Middleware valida o JWT em toda requisição subsequente
```

### Por que a callback é assíncrona

A rota de callback precisa esperar o Supabase terminar a troca do código com o Google antes de redirecionar. Se fosse síncrona, o redirecionamento aconteceria antes da sessão estar criada.

```ts
// app/(auth)/auth/callback/route.ts
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code); // espera a sessão
  }

  return NextResponse.redirect(new URL("/board", request.url)); // só então redireciona
}
```

### Middleware de proteção de rotas

Toda requisição para rotas protegidas passa pelo middleware antes de chegar na página. Ele lê o cookie, valida o JWT e decide o que fazer:

```
Requisição para /board
        ↓
middleware.ts
  ├── Sessão válida → deixa passar
  └── Sem sessão → redireciona para /login

Requisição para /login
  ├── Sem sessão → deixa passar
  └── Sessão válida → redireciona para /board
```

---

## Fluxo de dados

### Carregamento inicial da página (servidor)

Quando o usuário acessa `/board`, os dados são buscados no servidor antes de qualquer HTML chegar ao navegador.

```
Navegador acessa /board
        ↓
Next.js Server Component executa no servidor
        ↓
lib/supabase/server.ts busca candidaturas no Supabase
        ↓
Supabase aplica RLS — retorna só os dados do usuário logado
        ↓
HTML já com os dados é enviado ao navegador
        ↓
Usuário vê os dados imediatamente — sem tela em branco
```

**Vantagens:**

- Performance — dados chegam junto com o HTML, sem segunda requisição
- Segurança — lógica de busca e chaves ficam no servidor, nunca expostas ao navegador

### Ações do usuário após carregar (navegador)

Quando o usuário interage com o board após a página carregar — mover um card, editar uma candidatura — a atualização acontece no navegador.

```
Usuário move card para nova coluna
        ↓
React atualiza o estado local imediatamente (Optimistic Update)
        ↓
Tela já mostra o card na nova posição — sem esperar o banco
        ↓
Em paralelo: requisição assíncrona para o Supabase
        ├── Banco confirma → nada muda, tudo certo
        └── Banco rejeita → tela volta ao estado anterior + mensagem de erro
```

### Regra geral

| Situação                      | Onde roda | Arquivo Supabase         |
| ----------------------------- | --------- | ------------------------ |
| Carregar dados da página      | Servidor  | `lib/supabase/server.ts` |
| Ação do usuário após carregar | Navegador | `lib/supabase/client.ts` |

---

## Kanban — como funciona tecnicamente

O board é composto por colunas fixas de status e cartões que representam candidaturas. O drag and drop é gerenciado pela biblioteca `@dnd-kit`.

### Estrutura de componentes

```
BoardPage (Server Component)
└── busca candidaturas no servidor
└── passa dados para o BoardClient

BoardClient (Client Component — "use client")
└── gerencia estado local das candidaturas
└── BoardColumns
    └── BoardColumn × 5 (por status)
        ├── ColumnHeader
        └── ApplicationCard × N
            └── ApplicationModal (detalhe/edição)
```

### Por que BoardPage é Server e BoardClient é Client

A página em si pode ser Server Component — ela só busca dados e passa para baixo. O `BoardClient` precisa ser Client Component porque gerencia estado (`useState`) para o optimistic update e escuta eventos de drag and drop.

Essa separação é intencional: busca de dados no servidor, interatividade no cliente.

### Fluxo do drag and drop

```
1. Usuário começa a arrastar um card (onDragStart)
   └── Card fica "fantasma" — opacidade reduzida

2. Usuário solta o card em nova coluna (onDragEnd)
   └── dnd-kit detecta a coluna de destino

3. Optimistic Update
   └── useState atualiza o status do card localmente
   └── Tela reflete a mudança imediatamente

4. Requisição assíncrona para o Supabase
   └── UPDATE applications SET status = 'interview' WHERE id = '...'

5. Resultado
   ├── Sucesso → nada muda visualmente
   └── Erro → estado volta ao anterior + toast de erro
```

---

## Segurança

### Por que não usamos JWT manual nem bcrypt

O JobTrackr usa exclusivamente Google OAuth — não existe senha no sistema. O Supabase gera, assina e valida JWTs automaticamente. Reimplementar isso manualmente seria introduzir risco desnecessário.

### Row Level Security (RLS)

O isolamento de dados acontece no banco — não só na aplicação. Mesmo que alguém faça uma requisição direta à API do Supabase, os dados de outros usuários não são retornados.

```sql
-- Política aplicada em todas as tabelas
create policy "users can only access their own data"
  on applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

```
Requisição de usuário A
        ↓
Supabase recebe query
        ↓
RLS verifica: auth.uid() = user_id
        ↓
Retorna APENAS os registros onde user_id = id do usuário A
```

---

## Modelo de dados

### Tabela `applications`

```sql
applications (
  id          uuid primary key,     -- identificador único
  user_id     uuid not null,        -- dono do registro (FK → auth.users)
  company     text not null,        -- nome da empresa
  role        text not null,        -- título da vaga
  platform    text,                 -- LinkedIn, Gupy, Indeed...
  stack       text,                 -- tecnologias exigidas na vaga
  status      text not null,        -- applied | test | interview | offer | rejected
  apply_date  date,                 -- data de candidatura
  link        text,                 -- URL da vaga
  notes       text,                 -- observações livres
  created_at  timestamptz,          -- criação do registro
  updated_at  timestamptz           -- atualizada automaticamente via trigger
)
```

### Fluxo de status

```
applied → test → interview → offer

Qualquer status → rejected
```

---

## Ferramentas de desenvolvimento

### Context7

O Context7 é um MCP (Model Context Protocol) integrado ao Cursor que busca documentação atualizada das bibliotecas diretamente nas fontes oficiais em tempo real.

**Por que isso importa:** bibliotecas evoluem e APIs mudam entre versões. Sem o Context7, o Cursor gera código baseado no que aprendeu durante o treinamento — que pode estar desatualizado. Com ele, o Cursor consulta a documentação atual antes de escrever, evitando bugs causados por APIs depreciadas ou padrões antigos.

**Exemplo real neste projeto:** ao criar o `proxy.ts`, o Cursor consultou o Context7 e descobriu que no Next.js 16 o `middleware.ts` foi renomeado para `proxy.ts` — informação que não estaria no treinamento base. Sem essa consulta, teria criado o arquivo com o nome errado e o middleware não funcionaria.

**Como usar:** o Context7 já está conectado ao Cursor. Antes de escrever código que envolva bibliotecas externas, o Cursor deve consultá-lo automaticamente. Se não fizer isso, instrua explicitamente:

```
Use o Context7 para verificar a documentação atual de [biblioteca] antes de escrever.
```

**Bibliotecas que sempre devem ser verificadas via Context7:**

- `next` — APIs mudam entre versões minor
- `@supabase/ssr` — padrões de cookies e autenticação evoluem
- `@dnd-kit/*` — API de drag and drop tem variações de versão
- `recharts` — componentes e props podem mudar

---

## Decisões técnicas registradas

| Decisão            | Alternativa considerada      | Motivo da escolha                                              |
| ------------------ | ---------------------------- | -------------------------------------------------------------- |
| Next.js App Router | Pages Router                 | Server Components, layouts aninhados, middleware nativo        |
| Supabase Auth      | Auth.js / JWT manual         | OAuth pronto, JWT automático, sem senha no sistema             |
| @dnd-kit           | react-beautiful-dnd          | Mantido ativamente, acessível, mais leve                       |
| Recharts           | Chart.js / D3                | Componentes React nativos, fácil integração com TypeScript     |
| shadcn/ui          | Chakra UI / MUI              | Componentes copiados para o projeto, sem dependência de versão |
| Optimistic Update  | Esperar resposta do servidor | Interface instantânea, melhor experiência do usuário           |
| Context7           | Documentação manual          | Documentação atualizada em tempo real direto no Cursor         |

---

_Última atualização: maio de 2026_
