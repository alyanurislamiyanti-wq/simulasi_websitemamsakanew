import { useEffect, useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import { navLinks } from '@/data/schoolContent';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || menuOpen;
  const textColor = solid ? 'text-slate-900' : 'text-white';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? 'border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#beranda" className={`flex items-center gap-3 font-bold ${textColor}`}>
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              solid ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-800'
            }`}
          >
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="text-lg tracking-tight">MAM 1 Karangasem</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-emerald-500 ${textColor}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#pendaftaran"
            className="inline-flex items-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-400/20 transition-all hover:-translate-y-0.5 hover:bg-amber-300"
          >
            Daftar Siswa Baru
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className={`rounded-lg p-2 md:hidden ${textColor}`}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-slate-100 py-3 font-semibold text-slate-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#pendaftaran"
            onClick={() => setMenuOpen(false)}
            className="mt-4 flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 font-bold text-white"
          >
            Daftar Siswa Baru
          </a>
        </div>
      )}
    </header>
  );
}
