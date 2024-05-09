import { db } from '@/db';
import sharp from 'sharp';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { z } from 'zod';
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({ image: { maxFileSize: '4MB' } })
		.input(z.object({ configId: z.string().optional() }))
		// Set permissions and file types for this FileRoute
		.middleware(async ({ input }) => {
			// This code runs on your server before upload
			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { input };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			const { configId } = metadata.input;
			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback

			const res = await fetch(file.url);
			const buffer = await res.arrayBuffer();
			const imgMetadata = await sharp(buffer).metadata();
			const { width, height } = imgMetadata;

			if (!configId) {
				const configuration = await db.configuration.create({
					data: {
						imgUrl: file.url,
						height: height || 500,
						width: width || 500,
					},
				});
				return { configId: configuration.id };
			} else {
				const updatedConfiguration = await db.configuration.update({
					where: {
						id: configId,
					},
					data: {
						croppedImageUrl: file.url,
					},
				});

				return { configId: updatedConfiguration.id };
			}
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
