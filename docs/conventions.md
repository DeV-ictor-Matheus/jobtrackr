# JobTrackr — Convenções do Projeto

> Guia de como o código deve ser escrito. Seguir essas convenções garante que o projeto pareça escrito pela mesma pessoa do início ao fim — seja você ou um qualquer outra pessoa.

---

## Princípio central

**Cada arquivo faz uma coisa só, e faz bem.**

Um arquivo com muitas responsabilidades é difícil de entender, difícil de manter e difícil de depurar. Quando algo quebra num arquivo de 300 linhas, você precisa vasculhar tudo para achar o problema. Quando quebra num arquivo de 80 linhas com responsabilidade clara, você sabe exatamente onde olhar.

---

## Organização de pastas

### Regras

- Nunca criar pasta sem ter pelo menos um arquivo dentro
- Nunca criar pasta dentro de pasta sem motivo arquitetural claro
- Nunca deixar arquivos soltos na raiz do projeto sem propósito definido
- Cada pasta tem um propósito único e bem definido — se não souber descrever o propósito em uma frase, a pasta não deveria existir

### Onde cada coisa vai

| O que é                        | Onde fica                               |
| ------------------------------ | --------------------------------------- |
| Página do Next.js              | `app/(grupo)/rota/page.tsx`             |
| Layout de grupo de rotas       | `app/(grupo)/layout.tsx`                |
| Route Handler (API)            | `app/api/recurso/route.ts`              |
| Componente de UI base (shadcn) | `components/ui/` — nunca editar         |
| Componente do kanban           | `components/board/`                     |
| Componente de gráfico          | `components/dashboard/`                 |
| Header, sidebar, navegação     | `components/layout/`                    |
| Conexão com Supabase           | `lib/supabase/client.ts` ou `server.ts` |
| Funções auxiliares             | `lib/utils/`                            |
| Tipos TypeScript do domínio    | `types/`                                |
| Schema SQL                     | `supabase/migrations/`                  |
| Documentação                   | `docs/`                                 |

---

## Nomenclatura

### Idioma

Todo código em **inglês** — variáveis, funções, arquivos, tipos, comentários. Sem misturar português e inglês no mesmo arquivo.

### Arquivos

| Tipo              | Formato                     | Exemplo               |
| ----------------- | --------------------------- | --------------------- |
| Componente React  | PascalCase                  | `ApplicationCard.tsx` |
| Hook customizado  | camelCase com prefixo `use` | `useApplications.ts`  |
| Função utilitária | camelCase                   | `formatDate.ts`       |
| Tipo / Interface  | PascalCase                  | `application.ts`      |
| Route Handler     | sempre `route.ts`           | `route.ts`            |
| Página Next.js    | sempre `page.tsx`           | `page.tsx`            |
| Layout Next.js    | sempre `layout.tsx`         | `layout.tsx`          |

### Variáveis e funções

**Seja descritivo, não genérico.** O nome deve dizer o que a coisa contém ou faz — sem precisar ler o código ao redor para entender.

```ts
// ❌ Ruim — genérico, não diz o que contém
const data = await fetchApplications()
const list = applications.filter(...)
const fn = (a: Application) => a.status === 'interview'

// ✅ Bom — curto e intuitivo
const applications = await fetchApplications()
const activeApplications = applications.filter(...)
const isInterview = (application: Application) => application.status === 'interview'
```

### Componentes React

```ts
// ❌ Ruim
export default function Card() {}
export default function Item() {}

// ✅ Bom — nome diz exatamente o que o componente representa
export default function ApplicationCard() {}
export default function BoardColumn() {}
```

### Funções de busca e mutação

```ts
// Busca: prefixo get ou fetch
async function getApplications(userId: string) {}
async function fetchApplicationById(id: string) {}

// Criação: prefixo create
async function createApplication(data: NewApplication) {}

// Atualização: prefixo update
async function updateApplicationStatus(id: string, status: ApplicationStatus) {}

// Remoção: prefixo delete
async function deleteApplication(id: string) {}
```

---

## Tamanho de arquivos

- **Até 150 linhas** — ideal
- **150 a 200 linhas** — sinal de alerta, avaliar se pode separar
- **Acima de 200 linhas** — obrigatório quebrar em partes menores

Quando um componente cresce demais, a solução quase sempre é extrair:

- Lógica de estado → hook customizado em `lib/hooks/`
- Parte visual repetida → componente separado
- Funções de busca → arquivo em `lib/supabase/`

---

## TypeScript

### Regras

- Sem `any` — sempre tipar corretamente
- Sem `// @ts-ignore` — se precisar ignorar um erro, algo está errado na arquitetura
- Props de componentes sempre tipadas com `interface`
- Tipos do domínio centralizados em `types/` — nunca duplicar o mesmo tipo em arquivos diferentes

### Tipos do domínio

```ts
// types/application.ts

export type ApplicationStatus =
  | "applied"
  | "test"
  | "interview"
  | "offer"
  | "rejected";

export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  platform: string | null;
  stack: string | null;
  status: ApplicationStatus;
  apply_date: string | null;
  link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type NewApplication = Omit<
  Application,
  "id" | "user_id" | "created_at" | "updated_at"
>;
```

### Props de componentes

```ts
// ✅ Sempre tipadas com interface
interface ApplicationCardProps {
  application: Application;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export default function ApplicationCard({
  application,
  onStatusChange,
}: ApplicationCardProps) {}
```

---

## Componentes React

### Quando usar "use client"

Só adicionar `"use client"` quando o componente precisar de:

- Estado local (`useState`, `useReducer`)
- Efeitos (`useEffect`)
- Eventos do navegador (`onClick`, `onChange`, `onDragEnd`)
- Hooks do React que dependem do navegador

```ts
// ❌ Ruim — "use client" desnecessário
"use client"
export default function ApplicationCard({ application }: ApplicationCardProps) {
  return <div>{application.company}</div> // não precisa de nada do cliente
}

// ✅ Bom — Server Component por padrão
export default function ApplicationCard({ application }: ApplicationCardProps) {
  return <div>{application.company}</div>
}
```

### Estrutura de um componente

```ts
// 1. Imports externos
import { useState } from 'react'
import { formatDate } from 'date-fns'

// 2. Imports internos
import { Button } from '@/components/ui/button'
import type { Application } from '@/types/application'

// 3. Interface de props
interface ApplicationCardProps {
  application: Application
  onStatusChange: (id: string, status: ApplicationStatus) => void
}

// 4. Componente
export default function ApplicationCard({ application, onStatusChange }: ApplicationCardProps) {
  // 4a. Estado (se necessário)
  const [isOpen, setIsOpen] = useState(false)

  // 4b. Handlers
  function handleStatusChange(status: ApplicationStatus) {
    onStatusChange(application.id, status)
  }

  // 4c. Render
  return (
    <div>...</div>
  )
}
```

---

## Tratamento de erros

Toda operação com o Supabase precisa tratar erro. Nunca ignorar o retorno.

```ts
// ❌ Ruim — ignora o erro
const { data } = await supabase.from("applications").select();

// ✅ Bom — trata o erro
const { data: applications, error } = await supabase
  .from("applications")
  .select();

if (error) {
  console.error("Failed to fetch applications:", error.message);
  return null;
}
```

---

## Commits

Seguir o padrão **Conventional Commits** — cada commit diz exatamente o que foi feito.

### Formato

```
tipo: descrição curta em inglês
```

### Tipos

| Tipo       | Quando usar                                     |
| ---------- | ----------------------------------------------- |
| `feat`     | Nova funcionalidade                             |
| `fix`      | Correção de bug                                 |
| `docs`     | Alteração em documentação                       |
| `refactor` | Refatoração sem mudança de comportamento        |
| `style`    | Formatação, espaçamento (sem mudança de lógica) |
| `chore`    | Atualização de dependências, configurações      |

### Exemplos

```bash
# ✅ Bom
feat: add application card component
fix: correct status filter on board page
docs: update architecture with auth flow
refactor: extract status logic to useApplicationStatus hook
chore: update supabase to v2.39

# ❌ Ruim — vago, não diz o que foi feito
fix: bug fix
update: changes
feat: stuff
```

---

## Estilo (Tailwind)

- Tailwind para todo estilo — sem arquivos `.css` separados
- Sem classes CSS customizadas quando Tailwind resolve
- Ordem de classes: layout → espaçamento → visual → estado → responsivo

```tsx
// ✅ Ordem consistente
<div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md md:flex-row">
```

- Extrair classes longas repetidas para variáveis quando necessário:

```tsx
// ❌ Ruim — repetição
<div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md">
<button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md">

// ✅ Bom — extrai para variável
const btnStyles = "flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md"
<div className={btnStyles}>
<button className={btnStyles}>
```

---

## Comentários

Comentar apenas o que não é óbvio. Código bem nomeado não precisa de comentário.

```ts
// ❌ Ruim — comenta o óbvio
// Busca as candidaturas do usuário
const applications = await getApplications(userId);

// ✅ Bom — comenta o porquê, não o quê
// Optimistic update: atualiza o estado local antes da confirmação do servidor
// para que a interface responda imediatamente ao drag and drop
setApplications((prev) =>
  prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
);
```

---

_Última atualização: maio de 2026_
