import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);

  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();

    const {
      error,
      data: { user }
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      const email: string = user?.user_metadata?.email ?? user?.email ?? user.app_metadata.email;

      const [userExists] = await db.select().from(users).where(eq(users.email, email));

      if (!userExists) {
        await db.insert(users).values({
          username: user.user_metadata.name,
          avatarUrl: user.user_metadata.avatar_url,
          id: user.id,
          email: email
        });
      }

      return NextResponse.redirect(origin);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login`);
}
