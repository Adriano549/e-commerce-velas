// src/app/api/orders/[id]/route.test.ts
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { GET, PUT } from './route';
import prisma from '@/lib/prisma';
import { getServerSession, Session } from 'next-auth';
import { Prisma, StatusPedido } from '@prisma/client';
import { NextRequest } from 'next/server';


jest.mock('next-auth');
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        order: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockedPrismaOrderFindUnique = prisma.order.findUnique as jest.MockedFunction<typeof prisma.order.findUnique>;
const mockedPrismaOrderUpdate = prisma.order.update as jest.MockedFunction<typeof prisma.order.update>;

describe('/api/orders/[id]', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const createMockContext = (id: string) => ({
        params: Promise.resolve({ id })
    });

    const adminSession: Session = {
        user: {
            id: 'admin-456',
            name: 'Admin User',
            email: 'admin@test.com',
            admin: true,
        },
        expires: '2025-10-10T00:00:00.000Z',
    };
    const userSession: Session = {
        user: {
            id: 'user-123',
            name: 'Test User',
            email: 'test@test.com',
            admin: false,
        },
        expires: '2025-10-10T00:00:00.000Z',
    };
    const mockOrder = {
        id: 'order-abc',
        userId: userSession.user.id,
        total: new Prisma.Decimal(150.00),
        status: StatusPedido.ENVIADO,
        shippingAddress: { street: 'Rua Teste', city: 'Cidade Teste' },
        createdAt: new Date(),
        updatedAt: new Date(),
        orderProducts: []
    };
    const mockOtherUser = {
        id: 'other-user-789',
        name: 'Other User',
        email: 'other@test.com',
        admin: false
    }
    const mockOtherUserOrder = {
        id: 'order-xyz',
        userId: mockOtherUser.id,
        total: new Prisma.Decimal(150.00),
        status: StatusPedido.ENVIADO,
        shippingAddress: { street: 'Rua Teste', city: 'Cidade Teste' },
        createdAt: new Date(),
        updatedAt: new Date(),
        orderProducts: []
    }
    describe('GET', () => {
        it('deve retornar o pedido se o utilizador for o dono', async () => {
            mockedGetServerSession.mockResolvedValue(userSession);
            mockedPrismaOrderFindUnique.mockResolvedValue(mockOrder);
            const request = {} as NextRequest;
            const response = await GET(request, createMockContext('order-abc'));
            expect(response.status).toBe(200);
        });

        it('deve retornar 403 se o utilizador for outro', async () => {
            mockedGetServerSession.mockResolvedValue(userSession);
            mockedPrismaOrderFindUnique.mockResolvedValue(mockOtherUserOrder);
            const request = {} as NextRequest;
            const response = await GET(request, createMockContext('order-xyz'));
            expect(response.status).toBe(403);
        });

        it('deve retornar 401 se o utilizador nao estiver logado', async () => {
            mockedGetServerSession.mockResolvedValue(null);
            const request = {} as NextRequest;
            const response = await GET(request, createMockContext('order-abc'));
            expect(response.status).toBe(401);
        });
    });

    describe('PUT', () => {
        it('deve atualizar o status do pedido se o utilizador for admin', async () => {
            mockedGetServerSession.mockResolvedValue(adminSession);
            mockedPrismaOrderFindUnique.mockResolvedValue(mockOrder);
            mockedPrismaOrderUpdate.mockResolvedValue({ ...mockOrder, status: 'ENVIADO' });
            const request = new NextRequest('http://localhost/api/orders/order-abc', { method: 'PUT', body: JSON.stringify({ status: 'ENVIADO' }) });

            const response = await PUT(request, createMockContext('order-abc'));
            expect(response.status).toBe(200);
            expect(mockedPrismaOrderUpdate).toHaveBeenCalledWith({
                where: { id: 'order-abc' },
                data: { status: 'ENVIADO' }
            });
        });

        it('deve retornar 403 se o utilizador não for admin', async () => {
            mockedGetServerSession.mockResolvedValue(userSession);
            const request = new NextRequest('http://localhost/api/orders/order-abc', { method: 'PUT', body: '{}' });
            const response = await PUT(request, createMockContext('order-abc'));
            expect(response.status).toBe(403);
        });

        it('deve retornar 401 se o utilizador nao estiver logado', async () => {
            mockedGetServerSession.mockResolvedValue(null);
            const request = new NextRequest('http://localhost/api/orders/order-abc', { method: 'PUT', body: '{}' });
            const response = await PUT(request, createMockContext('order-abc'));
            expect(response.status).toBe(401);
        });
    });
});