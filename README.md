# JobTrackr

Aplicação web para organizar candidaturas de emprego. Acompanhe o dia a dia das suas aplicações em um feed claro e objetivo — sem precisar ficar clicando em diversos lugares para encontrar a vaga que aplicou.

<p align="center">
  <a href="https://jobtrackr-gray.vercel.app">🚀 Acessar o app</a>
  ·
  <a href="https://github.com/DeV-ictor-Matheus/jobtrackr/issues">📋 Reportar bug</a>
  ·
  <a href="https://github.com/DeV-ictor-Matheus/jobtrackr/issues">💡 Sugerir feature</a>
</p>

---

## Sobre o projeto

Quando a pessoa se candidata a muitas vagas ao mesmo tempo, perde o controle de onde aplicou, por qual plataforma, em qual etapa está cada processo e quando fazer follow-up. O JobTrackr resolve isso com um board Kanban simples e um dashboard de métricas.

## Stack

| Camada       | Tecnologia                                            |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 14 com App Router                             |
| Linguagem    | TypeScript                                            |
| Estilo       | Tailwind CSS + shadcn/ui (preset Nova)                |
| Backend/Auth | Supabase (PostgreSQL + Auth Google OAuth + RLS)       |
| Gráficos     | Recharts                                              |
| Ícones       | Lucide React                                          |
| Utilitários  | date-fns                                              |
| Deploy       | Vercel                                                |

## Começando

Primeiro, instale as dependências e rode o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para ver o resultado.

### Variáveis de ambiente

Crie um arquivo `.env.local` com as chaves do Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

## Deploy

O app está em produção na Vercel: [https://jobtrackr-gray.vercel.app](https://jobtrackr-gray.vercel.app)

## Contribuindo

Encontrou um bug ou tem uma ideia? Abra uma issue em [github.com/DeV-ictor-Matheus/jobtrackr/issues](https://github.com/DeV-ictor-Matheus/jobtrackr/issues).

## Repositório

[https://github.com/DeV-ictor-Matheus/jobtrackr](https://github.com/DeV-ictor-Matheus/jobtrackr)

---

<p align="center">
  Feito por <a href="https://github.com/DeV-ictor-Matheus">DeV-ictor-Matheus</a>
</p>
