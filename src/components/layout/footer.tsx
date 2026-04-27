import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-soft border-t border-hairline pt-12 pb-8">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-black font-display text-ink uppercase">
            AeroMentor
          </div>
          <div className="font-display text-xs uppercase tracking-widest text-ink opacity-60">
            © {new Date().getFullYear()} AeroMentor. AI-Powered Aviation
            Training.
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link
            href="/login"
            className="font-display text-xs uppercase tracking-widest text-ink opacity-60 hover:opacity-100 transition-opacity"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="font-display text-xs uppercase tracking-widest text-ink opacity-60 hover:opacity-100 transition-opacity"
          >
            Register
          </Link>
          <a
            href="mailto:contact@aeromentor.in"
            className="font-display text-xs uppercase tracking-widest text-ink opacity-60 hover:opacity-100 transition-opacity"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
