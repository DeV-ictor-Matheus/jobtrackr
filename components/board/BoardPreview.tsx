interface PreviewCard {
  company: string;
  role: string;
  platform: string;
}

interface PreviewColumn {
  title: string;
  dotClassName: string;
  cards: PreviewCard[];
}

const previewColumns: PreviewColumn[] = [
  {
    title: "Aplicada",
    dotClassName: "bg-zinc-400",
    cards: [
      { company: "Nubank", role: "Frontend Engineer", platform: "LinkedIn" },
      { company: "iFood", role: "React Developer", platform: "Gupy" },
      { company: "Stone", role: "Software Engineer", platform: "Indeed" },
    ],
  },
  {
    title: "Teste",
    dotClassName: "bg-amber-400",
    cards: [
      { company: "Mercado Livre", role: "Fullstack Dev", platform: "LinkedIn" },
      { company: "PicPay", role: "Frontend Pleno", platform: "Site" },
    ],
  },
  {
    title: "Entrevista",
    dotClassName: "bg-indigo-400",
    cards: [
      { company: "Wellhub", role: "Senior Engineer", platform: "Referral" },
      { company: "QuintoAndar", role: "React Native Dev", platform: "Gupy" },
    ],
  },
  {
    title: "Oferta",
    dotClassName: "bg-emerald-400",
    cards: [{ company: "Loft", role: "Frontend Engineer", platform: "LinkedIn" }],
  },
];

export default function BoardPreview() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {previewColumns.map((column) => (
        <div
          key={column.title}
          className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-[#111111] p-3"
        >
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-2 text-sm font-medium text-neutral-200">
              <span className={`size-2 rounded-full ${column.dotClassName}`} />
              {column.title}
            </span>
            <span className="text-xs font-medium text-zinc-500">
              {column.cards.length}
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {column.cards.map((card) => (
              <div
                key={`${card.company}-${card.role}`}
                className="flex flex-col gap-1.5 rounded-lg border border-zinc-800 bg-[#1a1a1a] p-3 transition-colors hover:border-zinc-700"
              >
                <span className="text-sm font-semibold text-neutral-100">
                  {card.company}
                </span>
                <span className="text-xs text-zinc-400">{card.role}</span>
                <span className="mt-1 w-fit rounded-md border border-zinc-800 bg-[#111111] px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                  {card.platform}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
