import Chat from '@/components/Chat';
import { cookies } from 'next/headers';

export default async function ChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value || '';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] bg-fixed font-['Inter',system-ui,-apple-system,sans-serif] text-foreground">
      <Chat token={token} />
    </div>
  );
}

