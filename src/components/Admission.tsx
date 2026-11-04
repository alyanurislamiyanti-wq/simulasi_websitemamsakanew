import { CalendarCheck, Clock, Mail, MapPin, Phone } from 'lucide-react';
import InquiryForm from '@/components/InquiryForm';
import Reveal from '@/components/Reveal';
import { admissionSteps, schoolContact } from '@/data/schoolContent';

const contactRows = [
  { icon: MapPin, text: schoolContact.address },
  { icon: Phone, text: schoolContact.phone },
  { icon: Mail, text: schoolContact.email },
  { icon: Clock, text: schoolContact.hours },
];

export default function Admission() {
  return (
    <section id="pendaftaran" className="bg-emerald-950 py-24 text-white lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-5 lg:px-8">
        <Reveal className="lg:col-span-2">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-300">Pendaftaran</p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl">
            Mulai perjalanan belajar terbaik untuk putra-putri Anda
          </h2>
          <p className="mt-6 leading-relaxed text-emerald-100/80">
            Kirim pesan melalui formulir, dan tim admisi kami akan membantu proses pendaftaran dari awal hingga siswa resmi bergabung.
          </p>

          <ol className="mt-10 space-y-6">
            {admissionSteps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-900">
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-100/75">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <CalendarCheck className="h-6 w-6 text-amber-300" />
            <ul className="mt-4 space-y-3 text-sm text-emerald-50">
              {contactRows.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-3">
          <div className="rounded-3xl bg-white p-8 text-slate-900 shadow-2xl sm:p-10">
            <h3 className="text-2xl font-bold">Formulir Pendaftaran</h3>
            <p className="mt-2 text-sm text-slate-600">Data Anda hanya digunakan untuk keperluan admisi sekolah.</p>
            <div className="mt-8">
              <InquiryForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
