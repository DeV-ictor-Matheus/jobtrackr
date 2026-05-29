"use client";

import { useEffect, useState } from "react";
import { Code2, LayoutGrid, ListChecks, type LucideIcon } from "lucide-react";

import BrandLogo from "@/components/layout/BrandLogo";
import BoardPreview from "@/components/board/BoardPreview";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "Funcionalidades", href: "#features", external: false },
  { label: "Sobre", href: "#sobre", external: false },
  {
    label: "GitHub",
    href: "https://github.com/DeV-ictor-Matheus/jobtrackr",
    external: true,
  },
];

interface AboutCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

const aboutCards: AboutCard[] = [
  {
    icon: LayoutGrid,
    title: "Tudo em um lugar",
    description: "Chega de planilha e post-it espalhados.",
  },
  {
    icon: ListChecks,
    title: "Acompanhe cada etapa",
    description: "Do envio à oferta, sem perder o controle.",
  },
  {
    icon: Code2,
    title: "Feito por dev, para dev",
    description: "Open source e gratuito.",
  },
];

const ctaButtonStyles =
  "inline-flex items-center justify-center gap-3 rounded-xl bg-indigo-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:bg-indigo-400 hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    // On success the browser is redirected to Google, so this only runs on failure.
    if (error) {
      console.error("Failed to start Google sign in:", error.message);
      setErrorMessage("Não foi possível iniciar o login. Tente novamente.");
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-[#0a0a0a] font-[system-ui,sans-serif] text-neutral-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[120px]"
      />

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          isScrolled
            ? "border-zinc-800/80 bg-[#0a0a0a]/60 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Voltar ao topo"
            className="cursor-pointer rounded-lg no-underline transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <BrandLogo />
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-neutral-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-[#1a1a1a] hover:text-neutral-100 disabled:opacity-60"
          >
            Entrar
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <section
          id="about"
          className="flex flex-col items-center pt-20 pb-12 text-center sm:pt-28"
        >
          <span className="animate-in fade-in slide-in-from-bottom-2 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#111111] px-4 py-1.5 text-xs font-medium text-zinc-400 duration-700">
            <span className="size-1.5 rounded-full bg-indigo-400" />
            Gratuito para usar · Open source
          </span>

          <h1 className="animate-in fade-in slide-in-from-bottom-3 mt-7 max-w-3xl text-4xl font-bold tracking-tight text-balance text-neutral-50 duration-700 delay-150 sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Organize sua busca por emprego
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-3 mt-6 max-w-xl text-lg text-balance text-zinc-400 duration-700 delay-300">
            Acompanhe cada candidatura, plataforma e etapa do processo em um
            único lugar.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-3 mt-9 duration-700 delay-500">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={ctaButtonStyles}
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-white">
                <GoogleIcon />
              </span>
              {isLoading ? "Redirecionando..." : "Entrar com Google"}
            </button>

            <p className="mt-4 text-sm text-zinc-500">
              Sem cartão de crédito · Login em um clique
            </p>

            {errorMessage ? (
              <p className="mt-3 text-sm text-red-400" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </section>

        <section
          id="features"
          className="animate-in fade-in slide-in-from-bottom-8 pb-24 duration-1000 delay-700"
        >
          <div className="animate-float">
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-3 shadow-[0_20px_60px_-30px_rgba(99,102,241,0.18)] sm:p-4">
              <div className="flex items-center gap-2 px-2 pb-3">
                <span className="size-3 rounded-full bg-red-500/70" />
                <span className="size-3 rounded-full bg-amber-500/70" />
                <span className="size-3 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-xs font-medium text-zinc-600">
                  jobtrackr.app/board
                </span>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0a0a0a] p-4">
                <BoardPreview />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="scroll-mt-24 pb-24">
          <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">
            Por que o JobTrackr?
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {aboutCards.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-[#111111] p-6"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold text-neutral-50">
                  {title}
                </h3>
                <p className="text-sm text-zinc-400">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"
      />
    </svg>
  );
}
