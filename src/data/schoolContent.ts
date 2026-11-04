import {
  BookOpen,
  Code2,
  FlaskConical,
  Languages,
  Palette,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Program', href: '#program' },
  { label: 'Berita', href: '#berita' },
  { label: 'Galeri', href: '#galeri' },
];

export const schoolContact = {
  address: 'Karangasem',
  phone: '(021) 000-0000',
  email: 'info@mam1karangasem.sch.id',
  hours: 'Senin - Sabtu, 07.00 - 15.00 WIB',
};

export const heroStats = [
  { value: '1.200+', label: 'Siswa aktif' },
  { value: '85+', label: 'Guru & tenaga pendidik' },
  { value: '40+', label: 'Prestasi tingkat nasional' },
  { value: '25', label: 'Tahun pengalaman' },
];

export const values = [
  'Pembelajaran berbasis karakter dan adab',
  'Kelas kecil dengan pendampingan personal',
  'Laboratorium sains dan ruang literasi modern',
  'Lingkungan aman, bersih, dan inklusif',
];

export interface Program {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const programs: Program[] = [
  {
    title: 'Tahfidz & Akhlak',
    description: 'Hafalan Al-Qur\'an terstruktur dengan pembinaan adab dan karakter setiap hari.',
    icon: BookOpen,
  },
  {
    title: 'Sains & Teknologi',
    description: 'Laboratorium lengkap untuk eksperimen sains, riset siswa, dan olimpiade.',
    icon: FlaskConical,
  },
  {
    title: 'Bahasa Asing',
    description: 'Kemampuan Bahasa Inggris dan Arab aktif melalui percakapan dan program pertukaran.',
    icon: Languages,
  },
  {
    title: 'Coding & Literasi Digital',
    description: 'Pengenalan pemrograman, desain digital, dan etika bermedia sejak dini.',
    icon: Code2,
  },
  {
    title: 'Seni & Kreativitas',
    description: 'Musik, seni rupa, dan pentas kreatif untuk menumbuhkan rasa percaya diri.',
    icon: Palette,
  },
  {
    title: 'Olahraga & Prestasi',
    description: 'Pelatihan olahraga terukur dengan pelatih bersertifikat dan jadwal kompetisi.',
    icon: Trophy,
  },
];

export const admissionSteps = [
  { title: 'Isi formulir', description: 'Kirim data calon siswa melalui formulir pendaftaran.' },
  { title: 'Seleksi & tes', description: 'Tes wawancara dan kemampuan dasar sesuai jenjang.' },
  { title: 'Pengumuman', description: 'Hasil seleksi diumumkan langsung kepada orang tua.' },
  { title: 'Daftar ulang', description: 'Lengkapi administrasi dan mulai masa orientasi.' },
];

export const interestOptions = [
  'Informasi umum',
  'Pendaftaran siswa baru',
  'Beasiswa & potongan biaya',
  'Jadwal kunjungan sekolah',
];

export const galleryItems = [
  { src: 'https://images.pexels.com/photos/10638213/pexels-photo-10638213.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', caption: 'Perpustakaan & literasi' },
  { src: 'https://images.pexels.com/photos/8471913/pexels-photo-8471913.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', caption: 'Laboratorium sains' },
  { src: 'https://images.pexels.com/photos/35865693/pexels-photo-35865693.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', caption: 'Belajar dengan fokus' },
  { src: 'https://images.pexels.com/photos/32037741/pexels-photo-32037741.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', caption: 'Kebersamaan di taman sekolah' },
  { src: 'https://images.pexels.com/photos/8419491/pexels-photo-8419491.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', caption: 'Diskusi kelas interaktif' },
  { src: 'https://images.pexels.com/photos/29599422/pexels-photo-29599422.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', caption: 'Semangat siswa MAM 1 Karangasem' },
];
