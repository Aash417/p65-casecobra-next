import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';

export default function Footer() {
	return (
		<div className='bg-white h-20 relative'>
			<MaxWidthWrapper>
				<div className='border-t border-gray-200' />

				<div className='h-full flex flex-col items-center md:justify-between justify-center'>
					<div className='text-center md:text-left pb-2 md:pb-0'>
						<p className='text-sm text-muted-foreground'>
							&copy; {new Date().getFullYear()} All rights reserved
						</p>
					</div>

					<div className='flex inline-center justify-center'>
						<div className='flex space-x-8'>
							<Link
								href='#'
								className='text-sm text-muted-foreground hover:text-gray-600'
							>
								Terms
							</Link>
							<Link
								href='#'
								className='text-sm text-muted-foreground hover:text-gray-600'
							>
								Privacy Policy
							</Link>
							<Link
								href='#'
								className='text-sm text-muted-foreground hover:text-gray-600'
							>
								Cookie Policy
							</Link>
						</div>
					</div>
				</div>
			</MaxWidthWrapper>
		</div>
	);
}
