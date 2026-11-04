import { GraduationCap } from 'lucide-react';
import { navLinks, schoolContact } from '@/data/schoolContent';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-emerald-950 text-emerald-100/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-800">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="text-lg font-bold tracking-tight">MAM 1 Karangasem</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Sekolah yang membentuk generasi berakhlak mulia, berpikir kritis, dan siap berkontribusi.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white">Navigasi</h3>
          <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-amber-300">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#pendaftaran" className="transition-colors hover:text-amber-300">
                Pendaftaran
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white">Kontak</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>{schoolContact.address}</li>
            <li>{schoolContact.phone}</li>
            <li>
              <a href={`mailto:${schoolContact.email}`} className="transition-colors hover:text-amber-300">
                {schoolContact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-emerald-100/60 lg:px-8">
          © {new Date().getFullYear()} MAM 1 Karangasem. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
