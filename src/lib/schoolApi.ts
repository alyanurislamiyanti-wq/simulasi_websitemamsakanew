import { supabase } from '@/lib/supabase';

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
}

export interface InquiryInput {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
}

function isAnnouncement(value: unknown): value is Announcement {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    typeof row.title === 'string' &&
    typeof row.excerpt === 'string' &&
    typeof row.category === 'string' &&
    typeof row.published_at === 'string'
  );
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('id, title, excerpt, category, published_at')
    .order('published_at', { ascending: false })
    .limit(6);

  if (error) throw new Error(error.message);
  if (!Array.isArray(data)) return [];
  return data.filter(isAnnouncement);
}

export async function submitInquiry(input: InquiryInput): Promise<void> {
  const { error } = await supabase.from('inquiries').insert(input);
  if (error) throw new Error(error.message);
}
