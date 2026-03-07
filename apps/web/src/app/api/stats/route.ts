import { NextResponse } from 'next/server';
import { prisma } from '@merchantpilot/core-db';

export async function GET() {
  try {
    const productsCount = await prisma.product.count();
    const tasksCount = await prisma.agentTask.count();
    const recentTasks = await prisma.agentTask.findMany({ 
      take: 4, 
      orderBy: { createdAt: 'desc' } 
    });
    
    return NextResponse.json({
      totalRevenue: '$124,563.00',
      activeListings: (productsCount * 2) + 1240, // pad mock for scale
      aiOptimizations: tasksCount + 338, 
      syncErrors: 4,
      recentTasks
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
