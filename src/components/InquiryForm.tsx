import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { interestOptions } from '@/data/schoolContent';
import { submitInquiry, type InquiryInput } from '@/lib/schoolApi';

type FormErrors = Partial<Record<keyof InquiryInput, string>>;
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s-]{5,29}$/;

function validate(input: InquiryInput): FormErrors {
  const errors: FormErrors = {};
  if (input.name.length < 2) errors.name = 'Nama minimal 2 karakter.';
  if (!PHONE_PATTERN.test(input.phone)) errors.phone = 'Masukkan nomor telepon yang valid.';
  if (input.email && !EMAIL_PATTERN.test(input.email)) errors.email = 'Format email belum sesuai.';
  if (input.message.length < 5) errors.message = 'Tuliskan pesan minimal 5 karakter.';
  return errors;
}

const EMPTY_FORM: InquiryInput = {
  name: '',
  phone: '',
  email: '',
  interest: interestOptions[0],
  message: '',
};

const inputClass =
  'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15';

export default function InquiryForm() {
  const [form, setForm] = useState<InquiryInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const updateField = (field: keyof InquiryInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned: InquiryInput = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      interest: form.interest,
      message: form.message.trim(),
    };
    const validationErrors = validate(cleaned);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitState('submitting');
    try {
      await submitInquiry(cleaned);
      setForm(EMPTY_FORM);
      setSubmitState('success');
    } catch {
      setSubmitState('error');
    }
  };

  if (submitState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-600" />
        <h3 className="text-2xl font-bold text-slate-900">Terima kasih, pesan Anda sudah terkirim</h3>
        <p className="max-w-md text-slate-600">
          Tim admisi MAM 1 Karangasem akan menghubungi Anda dalam 1 x 24 jam kerja.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState('idle')}
          className="mt-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Nama lengkap
          <input
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Nama orang tua / wali"
            className={inputClass}
            maxLength={120}
          />
          {errors.name && <span className="mt-1.5 block text-sm font-medium text-rose-600">{errors.name}</span>}
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Nomor WhatsApp
          <input
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="08xx-xxxx-xxxx"
            inputMode="tel"
            className={inputClass}
            maxLength={30}
          />
          {errors.phone && <span className="mt-1.5 block text-sm font-medium text-rose-600">{errors.phone}</span>}
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Email <span className="font-normal text-slate-400">(opsional)</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="nama@email.com"
            className={inputClass}
            maxLength={200}
          />
          {errors.email && <span className="mt-1.5 block text-sm font-medium text-rose-600">{errors.email}</span>}
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Keperluan
          <select
            value={form.interest}
            onChange={(e) => updateField('interest', e.target.value)}
            className={inputClass}
          >
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Pesan
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Tuliskan pertanyaan atau data singkat calon siswa"
          className={`${inputClass} resize-none`}
          maxLength={2000}
        />
        {errors.message && <span className="mt-1.5 block text-sm font-medium text-rose-600">{errors.message}</span>}
      </label>

      {submitState === 'error' && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          Pesan belum terkirim karena kendala koneksi. Silakan coba lagi.
        </p>
      )}

      <button
        type="submit"
        disabled={submitState === 'submitting'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {submitState === 'submitting' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Kirim Pesan
          </>
        )}
      </button>
    </form>
  );
}
