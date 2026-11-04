import Reveal from '@/components/Reveal';
import { programs } from '@/data/schoolContent';

export default function Programs() {
  return (
    <section id="program" className="bg-slate-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Program Unggulan</p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl">
            Pilihan kegiatan untuk mengembangkan setiap potensi siswa
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Reveal key={program.title} delay={index * 80}>
                <article className="group h-full rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-slate-900">{program.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{program.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
