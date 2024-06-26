import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Provider from '@/components/Provider';
import { Toaster } from '@/components/ui/toaster';
import { constructMetadata } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Recursive } from 'next/font/google';
import './globals.css';

const inter = Recursive({ subsets: ['latin'] });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Navbar />
				<main className='flex flex-col min-h-[calc(100vh-3.5rem-1px)] grainy-light'>
					<div className='flex-1 flex flex-col h-full'>
						<Provider>{children}</Provider>
					</div>
					<Footer />
				</main>
				<Toaster />
				<Analytics />
			</body>
		</html>
	);
}
