import { ArrowRight, Play } from 'lucide-react';
import { heroStats } from '@/data/schoolContent';

const HERO_IMAGE =
  'https://images.pexels.com/photos/32037741/pexels-photo-32037741.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function Hero() {
  return (
    <section id="beranda" className="relative isolate flex min-h-screen items-end overflow-hidden bg-emerald-950">
      <img
        src={HERO_IMAGE}
        alt="Siswa MAM 1 Karangasem belajar bersama di taman sekolah"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60 animate-[heroZoom_20s_ease-out_forwards]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-900/30" />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-40 lg:px-8 lg:pb-24">
        <div className="max-w-3xl animate-[fadeUp_0.8s_ease-out_both]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            Penerimaan Siswa Baru 2027/2028 telah dibuka
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Membentuk generasi yang berakhlak, cerdas, dan siap menghadapi masa depan
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-emerald-50/90 sm:text-lg">
            MAM 1 Karangasem menghadirkan pendidikan yang memadukan nilai-nilai karakter, sains modern,
            dan teknologi digital dalam lingkungan belajar yang hangat dan aman.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#pendaftaran"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 font-bold text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Daftar Sekarang
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#program"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              <Play className="h-4 w-4 fill-white" />
              Jelajahi Program
            </a>
          </div>

        </div>

        <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-white/15 pt-10 lg:grid-cols-4">
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm text-emerald-100/80">{stat.label}</dt>
              <dd className="mt-1 text-3xl font-bold text-white sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
