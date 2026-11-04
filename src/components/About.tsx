import { CheckCircle2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { values } from '@/data/schoolContent';

const ABOUT_IMAGE =
  'https://images.pexels.com/photos/10638213/pexels-photo-10638213.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function About() {
  return (
    <section id="tentang" className="bg-white py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="relative">
            <img
              src={ABOUT_IMAGE}
              alt="Siswa MAM 1 Karangasem membaca bersama di perpustakaan"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl sm:aspect-[5/4]"
            />
          </div>
        </Reveal>

        <Reveal delay={150}>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Tentang Kami</p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl">
            Sekolah yang menumbuhkan iman, ilmu, dan kepribadian dalam satu langkah
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-600">
            Sejak berdiri, MAM 1 Karangasem berkomitmen menyiapkan siswa menjadi pribadi yang tangguh,
            beradab, dan kompeten. Setiap siswa mendapat perhatian personal dari guru pembimbing
            sehingga potensi mereka tumbuh secara optimal.
          </p>

          <ul className="mt-8 space-y-4">
            {values.map((value) => (
              <li key={value} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span className="font-medium text-slate-700">{value}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
