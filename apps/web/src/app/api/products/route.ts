import { NextResponse } from 'next/server';
import { prisma } from '@merchantpilot/core-db';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { listings: true }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
