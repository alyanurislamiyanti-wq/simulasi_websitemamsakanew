/*
# Create school website tables

1. New Tables
- `announcements`: news and announcements shown on the public website.
  - `id` (uuid, primary key)
  - `title` (text, required)
  - `excerpt` (text, short summary)
  - `category` (text, e.g. Prestasi, Kegiatan, Pengumuman)
  - `published_at` (date, shown to visitors)
  - `created_at` (timestamp)
- `inquiries`: messages sent from the contact / admission form.
  - `id` (uuid, primary key)
  - `name`, `phone`, `email`, `interest`, `message` (text)
  - `created_at` (timestamp)

2. Security
- RLS enabled on both tables.
- `announcements`: anonymous and signed-in visitors can read rows only.
- `inquiries`: anonymous and signed-in visitors can submit rows only; nobody can read, change or delete submissions through the website. Length limits are enforced in the database.

3. Notes
- No sign-in is used by this site, so policies apply to the `anon` and `authenticated` roles.
- Seed announcements are inserted once so the news section is never empty.
*/

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Pengumuman',
  published_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  email text NOT NULL DEFAULT '' CHECK (char_length(email) <= 200),
  interest text NOT NULL DEFAULT 'Informasi umum' CHECK (char_length(interest) <= 120),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON announcements TO anon, authenticated;
GRANT INSERT ON inquiries TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_announcements" ON announcements;
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_submit_inquiries" ON inquiries;
CREATE POLICY "public_submit_inquiries" ON inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS announcements_published_at_idx ON announcements (published_at DESC);

INSERT INTO announcements (title, excerpt, category, published_at)
SELECT * FROM (VALUES
  ('Penerimaan Peserta Didik Baru Tahun Ajaran 2027/2028 Dibuka', 'Pendaftaran gelombang pertama dibuka mulai bulan ini dengan kuota terbatas untuk setiap jenjang.', 'Pengumuman', DATE '2026-10-20'),
  ('Siswa MAMSAKA Raih Juara Olimpiade Sains Tingkat Kabupaten', 'Tim sains kami berhasil meraih medali emas pada ajang olimpiade matematika dan sains tingkat kabupaten.', 'Prestasi', DATE '2026-10-08'),
  ('Peringatan Hari Santri dan Lomba Kreativitas Siswa', 'Rangkaian kegiatan meriah dengan lomba pidato, pentas seni, dan bazar karya siswa.', 'Kegiatan', DATE '2026-09-30')
) AS seed(title, excerpt, category, published_at)
WHERE NOT EXISTS (SELECT 1 FROM announcements);
