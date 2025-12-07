'use client';

import { configSWR } from '@/lib/utils';
import {
	Deals,
	FeaturedProducts,
	Info,
	NewArrivals,
	PopularSneakers,
	SpecialOffers,
} from './home/components';
import useSWR from 'swr';

export default function Page() {
	const { data } = useSWR(`/api/products/homepage?specialOffersLimit=8&newArrivalsLimit=8&popularLimit=8&limitedDealsLimit=8`, configSWR);
	const {limitedDeals, newArrivals, popularProducts, specialOffers} = data?.data || {};
	return (
		<div className="container">
			<div className="grid grid-cols-1 gap-6">
				<FeaturedProducts />
				<NewArrivals products={newArrivals} />
				<PopularSneakers products={popularProducts} />
				<Deals products={limitedDeals} />
				<Info />
			</div>
		</div>		
	);
}
