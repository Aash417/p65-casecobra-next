'use server';

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/product';
import { db } from '@/db';
import { stripe } from '@/lib/stripe';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Order } from '@prisma/client';

export async function createCheckoutSession({ configId }: { configId: string }) {
	const configuration = await db.configuration.findUnique({
		where: { id: configId },
	});
	if (!configuration) throw new Error('No such configuration found');

	const { getUser } = await getKindeServerSession();
	const user = await getUser();
	if (!user) throw new Error('You need to be logged in');

	const { finish, material } = configuration;
	let totalPrice = BASE_PRICE;
	if (material === 'polycarbonate') totalPrice += PRODUCT_PRICES.material.polycarbonate;
	if (finish === 'textured') totalPrice += PRODUCT_PRICES.finish.textured;

	// console.log(user.id, configuration.id);

	let order: Order | undefined = undefined;
	const existingOrder = await db.order.findFirst({
		where: {
			userId: user.id,
			configurationId: configuration.id,
		},
	});

	if (existingOrder) order = existingOrder;
	else
		order = await db.order.create({
			data: {
				userId: user.id,
				amount: totalPrice,
				configurationId: configuration.id,
			},
		});

	// const product = await stripe.products.create({
	// 	name: 'Custom iphone case',
	// 	images: [configuration.imgUrl],
	// 	default_price_data: {
	// 		currency: 'INR',
	// 		unit_amount: totalPrice,
	// 	},
	// });

	const stripeSession = await stripe.checkout.sessions.create({
		mode: 'payment',
		payment_method_types: ['card'],
		success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
		cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?orderId=${configuration.id}`,

		customer_email: user.email,

		shipping_address_collection: { allowed_countries: ['DE', 'US', 'IN'] },
		metadata: {
			userId: user.id,
			orderId: order.id,
		},
		line_items: [
			{
				price_data: {
					unit_amount: totalPrice,
					currency: 'INR',
					product_data: {
						name: 'Custom iphone case 3',
						images: [configuration.imgUrl],
					},
				},
				quantity: 1,
			},
		],
	});
	return { url: stripeSession.url };
}
