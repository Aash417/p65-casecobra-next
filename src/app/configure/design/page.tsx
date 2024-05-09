import { db } from '@/db';
import { notFound } from 'next/navigation';
import DesignConfigurator from './DesignConfigurator';

interface PageProps {
	searchParams: {
		[key: string]: string | string[] | undefined;
	};
}

export default async function Page({ searchParams }: PageProps) {
	const { id } = searchParams;
	if (!id || typeof id !== 'string') return notFound();
	// db call
	const configuration = await db.configuration.findUnique({
		where: { id },
	});
	if (!configuration) return notFound();

	const { imgUrl, width, height } = configuration;

	return (
		<DesignConfigurator
			imageUrl={imgUrl}
			configId={configuration.id}
			imageDimensions={{ width, height }}
		/>
	);
	// return <div className=''>{id}</div>;
}
