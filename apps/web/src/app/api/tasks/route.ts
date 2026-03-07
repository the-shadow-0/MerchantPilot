import { NextResponse } from 'next/server';
import { prisma } from '@merchantpilot/core-db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    const tasks = await prisma.agentTask.findMany({
      where: type ? { agentType: type } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let merchantId = body.merchantId;
    
    if (!merchantId) {
       const firstMerchant = await prisma.merchant.findFirst();
       if (firstMerchant) merchantId = firstMerchant.id;
    }

    const task = await prisma.agentTask.create({
      data: {
        merchantId,
        agentType: body.agentType,
        status: body.status || 'Running',
        payload: JSON.stringify(body.payload || {})
      }
    });
    
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const task = await prisma.agentTask.update({
      where: { id: body.id },
      data: {
        status: body.status,
        payload: body.payload ? JSON.stringify(body.payload) : undefined
      }
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
