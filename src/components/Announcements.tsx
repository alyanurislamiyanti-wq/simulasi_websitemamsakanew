import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CalendarDays, Loader2, Newspaper } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { fetchAnnouncements, type Announcement } from '@/lib/schoolApi';

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; items: Announcement[] };

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Announcements() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  const load = useCallback(() => {
    setState({ status: 'loading' });
    fetchAnnouncements()
      .then((items) => setState({ status: 'ready', items }))
      .catch(() => setState({ status: 'error' }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section id="berita" className="bg-slate-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Berita & Pengumuman</p>
            <h2 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl">
              Kabar terbaru dari MAM 1 Karangasem
            </h2>
          </div>
        </Reveal>

        {state.status === 'loading' && (
          <div className="mt-12 flex items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
            Memuat berita...
          </div>
        )}

        {state.status === 'error' && (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-rose-600" />
            <p className="font-semibold text-rose-900">Berita belum dapat dimuat saat ini.</p>
            <button
              type="button"
              onClick={load}
              className="rounded-full bg-rose-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-rose-700"
            >
              Coba lagi
            </button>
          </div>
        )}

        {state.status === 'ready' && state.items.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Newspaper className="h-8 w-8 text-slate-400" />
            <p className="text-slate-600">Belum ada berita yang dipublikasikan.</p>
          </div>
        )}

        {state.status === 'ready' && state.items.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {state.items.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(item.published_at)}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold leading-snug text-slate-900">{item.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-slate-600">{item.excerpt}</p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
