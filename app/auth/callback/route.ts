import { NextRequest, NextResponse } from 'next/server';
import { supabaseAuth } from '@/lib/supabase/auth';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  
  if (code) {
    // Exchange the code for a session
    const { error } = await supabaseAuth.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        new URL('/auth/error?message=' + encodeURIComponent(error.message), requestUrl.origin)
      );
    }
    
    // Redirect based on the type of callback
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin));
    } else if (type === 'signup') {
      return NextResponse.redirect(new URL('/auth/verify-email?success=true', requestUrl.origin));
    }
    
    // Default redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
  }
  
  // If no code is present, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}