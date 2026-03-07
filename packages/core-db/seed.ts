import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Create a Merchant
  const defaultMerchant = await prisma.merchant.create({
    data: {
      name: 'Acme Retail Corp',
      subscriptionPlan: 'PRO'
    }
  });

  // 2. Create Products
  const pt1 = await prisma.product.create({
    data: {
      merchantId: defaultMerchant.id,
      unifiedSku: 'COFFEE-MUG-12OZ',
      basePrice: 12.99,
      listings: {
        create: [
          { marketplaceId: 'AMAZON_US', syncStatus: 'SYNCED' },
          { marketplaceId: 'SHOPIFY', syncStatus: 'SYNCED' }
        ]
      }
    }
  });

  const pt2 = await prisma.product.create({
    data: {
      merchantId: defaultMerchant.id,
      unifiedSku: 'CERAMIC-VASE-W',
      basePrice: 45.00,
      listings: {
        create: [
          { marketplaceId: 'ETSY', syncStatus: 'PENDING' }
        ]
      }
    }
  });

  // 3. Create Agent Tasks (e.g. recent logs)
  await prisma.agentTask.createMany({
    data: [
      {
        merchantId: defaultMerchant.id,
        agentType: 'Listing Agent',
        status: 'Complete',
        payload: '{"desc": "Optimized 45 titles for Amazon SEO"}'
      },
      {
        merchantId: defaultMerchant.id,
        agentType: 'Compliance Agent',
        status: 'Action Needed',
        payload: '{"desc": "Flagged BPA-Free claim on Shopify"}'
      },
      {
        merchantId: defaultMerchant.id,
        agentType: 'Growth Agent',
        status: 'Complete',
        payload: '{"desc": "Started -15% promotion on slow movers"}'
      }
    ]
  });

  console.log('Database seeded successfully!', { merchantId: defaultMerchant.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
