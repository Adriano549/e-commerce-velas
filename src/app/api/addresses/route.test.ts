import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { GET, POST } from './route';
import { getServerSession, Session } from 'next-auth';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';


jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));;
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        address: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
    },
}));

const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockedPrismaAddressFindMany = prisma.address.findMany as jest.MockedFunction<typeof prisma.address.findMany>;
const mockedPrismaAddressCreate = prisma.address.create as jest.MockedFunction<typeof prisma.address.create>;

describe('GET /api/addresses', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockSession: Session = {
        user: {
            id: 'admin-user-id',
            name: 'Admin User',
            email: 'admin@test.com',
            admin: true,
        },
        expires: '2025-10-10T00:00:00.000Z',
    };


    it('deve retornar a lista de endereços do usuário com status 200', async () => {
        const mockAddresses = [
            {
                id: 'addr-1',
                street: 'Rua das Flores',
                number: '123',
                neighborhood: 'Centro',
                city: 'Cidade',
                state: 'SP',
                zipCode: '12345-678',
                userId: 'user-123',
                complement: null
            },
        ];
        mockedGetServerSession.mockResolvedValue(mockSession);
        mockedPrismaAddressFindMany.mockResolvedValue(mockAddresses);
        const request = {} as NextRequest;

        const response = await GET(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual(mockAddresses);
        expect(mockedPrismaAddressFindMany).toHaveBeenCalledWith({
            where: { userId: mockSession.user.id },
        });
    });

    it('deve retornar um array vazio se o usuário não tiver endereços', async () => {
        mockedGetServerSession.mockResolvedValue(mockSession);
        mockedPrismaAddressFindMany.mockResolvedValue([]);
        const request = {} as NextRequest;

        const response = await GET(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual([]);
    });

    it('deve retornar 401 Unauthorized se o usuário não estiver logado', async () => {
        mockedGetServerSession.mockResolvedValue(null);
        const request = {} as NextRequest;

        const response = await GET(request);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body.message).toEqual("Não autorizado");
        expect(mockedPrismaAddressFindMany).not.toHaveBeenCalled();
    });
});


describe('POST /api/addresses', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockSession: Session = {
        user: { id: 'user-123', name: 'Test User', email: 'test@test.com', admin: false },
        expires: '2025-10-10T00:00:00.000Z',
    };

    const validAddressData = {
        street: 'Rua das Velas Novas',
        number: '789',
        neighborhood: 'Jardim Perfumado',
        city: 'Aromaville',
        state: 'SP',
        zipCode: '12345-000',
    };

    it('deve criar um novo endereço com sucesso para um usuário logado', async () => {
        mockedGetServerSession.mockResolvedValue(mockSession);
        mockedPrismaAddressCreate.mockResolvedValue({
            ...validAddressData,
            id: 'new-addr-id-456',
            userId: mockSession.user.id,
            complement: null
        });

        const request = new NextRequest('http://localhost/api/addresses', {
            method: 'POST',
            body: JSON.stringify(validAddressData),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(201);
        expect(body.id).toBeDefined();
        expect(body.street).toEqual(validAddressData.street);
        expect(mockedPrismaAddressCreate).toHaveBeenCalledTimes(1);
        expect(mockedPrismaAddressCreate).toHaveBeenCalledWith({
            data: {
                ...validAddressData,
                userId: mockSession.user.id,
            },
        });
    });

    it('deve retornar 401 Unauthorized se o usuário não estiver logado', async () => {
        mockedGetServerSession.mockResolvedValue(null);
        const request = new NextRequest('http://localhost/api/addresses', {
            method: 'POST',
            body: JSON.stringify(validAddressData),
        });

        const response = await POST(request);

        expect(response.status).toBe(401);
        expect(mockedPrismaAddressCreate).not.toHaveBeenCalled();
    });

    it('deve retornar 400 Bad Request se os dados do endereço forem inválidos', async () => {
        mockedGetServerSession.mockResolvedValue(mockSession);
        const invalidAddressData = {
            number: '123',
            city: 'Cidade Incompleta',
        };
        const request = new NextRequest('http://localhost/api/addresses', {
            method: 'POST',
            body: JSON.stringify(invalidAddressData),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.errors).toBeDefined();
        expect(body.errors.street).toEqual('A rua é obrigatória.');
        expect(mockedPrismaAddressCreate).not.toHaveBeenCalled();
    });
});