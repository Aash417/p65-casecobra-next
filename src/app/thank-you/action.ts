'use server';

import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function getPaymentStatus({ orderId }: { orderId: string }) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user?.id || !user?.email) throw new Error('You need to be log in to view this page');

	const order = await db.order.findFirst({
		where: { id: orderId },
		include: {
			billingAddress: true,
			shippingAddress: true,
			configuration: true,
			user: true,
		},
	});
	if (!order) throw new Error('This order does not exists');

	if (order.isPaid) return order;
	else return false;
}
