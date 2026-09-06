'use client';
import { ClerkProvider } from '@clerk/nextjs';
export function AppProviders({children}:{children:React.ReactNode}){const key=process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;return key?<ClerkProvider publishableKey={key}>{children}</ClerkProvider>:children;}
