import Reveal from '@/components/Reveal';
import { galleryItems } from '@/data/schoolContent';

export default function Gallery() {
  return (
    <section id="galeri" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Galeri</p>
            <h2 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl">
              Momen belajar, berkarya, dan bertumbuh bersama
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3">
          {galleryItems.map((item, index) => (
            <Reveal
              key={item.src}
              delay={index * 60}
              className={`h-full ${index === 0 || index === 4 ? 'md:row-span-2' : ''}`}
            >
              <figure className="group relative h-full overflow-hidden rounded-2xl bg-slate-200">
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-emerald-950/90 to-transparent p-5 pt-12 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
