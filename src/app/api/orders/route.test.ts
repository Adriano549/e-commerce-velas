import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import prisma from '@/lib/prisma';
import { Prisma, StatusPedido } from '@prisma/client';
import { processCart } from '@/services/cartService';
import { createOrderInDb } from '@/services/orderService';


jest.mock('@/services/cartService');
jest.mock('@/services/orderService');
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));;



jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        order: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
        address: {
            findUnique: jest.fn()
        },
    },
}));


const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockedPrismaOrderFindMany = prisma.order.findMany as jest.MockedFunction<typeof prisma.order.findMany>;
const mockedProcessCart = processCart as jest.MockedFunction<typeof processCart>;
const mockedPrismaAddressFindUnique = prisma.address.findUnique as jest.MockedFunction<typeof prisma.address.findUnique>;
const mockedCreateOrderInDb = createOrderInDb as jest.MockedFunction<typeof createOrderInDb>;

describe('GET /api/orders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const mockSession: Session = {
        user: {
            id: 'user-123',
            name: 'Test User',
            email: 'test@test.com',
            admin: false,
        },
        expires: '2025-10-10T00:00:00.000Z',
    };
    it('deve retornar os pedidos do usuário logado com status 200', async () => {
        const mockOrders = [
            {
                id: 'order-1',
                userId: mockSession.user.id,
                total: new Prisma.Decimal(100.00),
                status: StatusPedido.ENTREGUE,
                shippingAddress: { street: 'Rua Teste', city: 'Cidade Teste' },
                createdAt: new Date(),
                updatedAt: new Date(),
                orderProducts: [],
            },
            {
                id: 'order-2',
                userId: 'user-123',
                total: new Prisma.Decimal(200.05),
                status: StatusPedido.PENDENTE,
                shippingAddress: { street: 'Rua Teste 2', city: 'Cidade Teste 2' },
                createdAt: new Date(),
                updatedAt: new Date(),
                orderProducts: [],
            },
        ];
        mockedGetServerSession.mockResolvedValue(mockSession);
        mockedPrismaOrderFindMany.mockResolvedValue(mockOrders);
        const expectedBody = [
            {
                ...mockOrders[0],
                total: "100",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }
            ,
            {
                ...mockOrders[1],
                total: "200.05",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }
        ];


        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual(expectedBody);
        expect(mockedPrismaOrderFindMany).toHaveBeenCalledWith({
            where: { userId: mockSession.user.id },
            include: {
                orderProducts: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    });
    it('deve retornar 401 Unauthorized se o usuário não estiver logado', async () => {
        mockedGetServerSession.mockResolvedValue(null);

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body.message).toEqual("Não autorizado");
        expect(mockedPrismaOrderFindMany).not.toHaveBeenCalled();
    });
    it('deve retornar 500 Internal Server Error se ocorrer um erro no banco de dados', async () => {
        mockedGetServerSession.mockResolvedValue(mockSession);
        mockedPrismaOrderFindMany.mockRejectedValue(new Error('Erro de conexão com o banco de dados'));

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.message).toEqual('Ocorreu um erro inesperado no servidor.');
    });
})

describe('POST /api/orders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const mockSession: Session = {
        user: {
            id: 'user-123',
            name: 'Test User',
            email: 'test@test.com',
            admin: false,
        },
        expires: '2025-10-10T00:00:00.000Z',
    };

    const mockAddress = {
        id: 'f1e2d3c4-b5a6-4789-8abc-ba9876543210',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Cidade',
        state: 'SP',
        zipCode: '12345-678',
        userId: 'user-123',
        complement: null
    };
    const mockRequestBody = { items: [{ productId: 'c1b2a3d4-e5f6-4789-8abc-ef1234567890', quantity: 1 }], addressId: mockAddress.id };

    it('deve criar um pedido com sucesso', async () => {
        mockedGetServerSession.mockResolvedValue(mockSession);
        mockedPrismaAddressFindUnique.mockResolvedValue(mockAddress);
        mockedProcessCart.mockResolvedValue({ total: 100, products: [], error: null });
        mockedCreateOrderInDb.mockResolvedValue({
            id: 'new-order-id',
            userId: mockSession.user.id,
            total: new Prisma.Decimal(100),
            status: StatusPedido.PENDENTE,
            shippingAddress: mockAddress,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const request = new NextRequest('http://localhost/api/orders', {
            method: 'POST',
            body: JSON.stringify(mockRequestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const response = await POST(request);
        const body = await response.json();
        console.log('Request body:', mockRequestBody);
        console.log('Response status:', response.status);
        console.log('Response body:', body)

        expect(response.status).toBe(201);
    });

    it('deve retornar 401 se o usuário não estiver logado', async () => {
        mockedGetServerSession.mockResolvedValue(null);
        const request = new NextRequest('http://localhost/api/orders', {
            method: 'POST', body: JSON.stringify(mockRequestBody)
        });

        const response = await POST(request);

        expect(response.status).toBe(401);
        expect(mockedCreateOrderInDb).not.toHaveBeenCalled();
    });
    it('deve retornar 400 para corpo de requisição inválido', async () => {


        mockedGetServerSession.mockResolvedValue(mockSession);
        const invalidRequestBody = {
            items: [],
            addressId: 'uuid-valido-aqui',
        };

        const request = new NextRequest('http://localhost/api/orders', {
            method: 'POST',
            body: JSON.stringify(invalidRequestBody),
        });

        const response = await POST(request);

        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.errors).toBeDefined();
        expect(mockedCreateOrderInDb).not.toHaveBeenCalled();
    });
});
