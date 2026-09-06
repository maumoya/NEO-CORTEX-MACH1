import type { Metadata } from 'next';import './globals.css';import { AppProviders } from '@/components/AppProviders';
export const metadata:Metadata={title:{default:'NEO-CORTEX MACH1',template:'%s · NEO-CORTEX MACH1'},description:'A governed, model-agnostic Agentic Operating System.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><AppProviders>{children}</AppProviders></body></html>}
