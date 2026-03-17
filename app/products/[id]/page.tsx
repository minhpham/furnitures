import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/api/products';
import { ProductDetailClient } from './ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 404) {
      notFound();
    }
    throw err;
  }

  return <ProductDetailClient product={product} />;
}
