import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { GET, PUT, DELETE } from './route';
import prisma from '@/lib/prisma';
import { getServerSession, Session } from 'next-auth';
import { NextRequest } from 'next/server';


jest.mock('next-auth');
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        address: {
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockedPrismaAddressFindUnique = prisma.address.findUnique as jest.MockedFunction<typeof prisma.address.findUnique>;
const mockedPrismaAddressUpdate = prisma.address.update as jest.MockedFunction<typeof prisma.address.update>;
const mockedPrismaAddressDelete = prisma.address.delete as jest.MockedFunction<typeof prisma.address.delete>;



describe('/api/addresses/[id]', () => {

    const mockSession: Session = {
        user: {
            id: 'admin-user-id',
            name: 'Admin User',
            email: 'admin@test.com',
            admin: true,
        },
        expires: '2025-10-10T00:00:00.000Z',
    };
    const mockAddress = {
        id: 'addr-abc',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Cidade',
        state: 'SP',
        zipCode: '12345-678',
        userId: 'admin-user-id',
        complement: null
    };
    const mockOtherUserAddress = {
        id: 'addr-xyz',
        userId: 'user-456',
        street: 'Rua Errada',
        number: '999',
        neighborhood: 'Bairro',
        city: 'Cidade',
        state: 'SP',
        zipCode: '12345-678',
        complement: null
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('deve obter o endereço com sucesso', async () => {
            mockedGetServerSession.mockResolvedValue(mockSession);
            mockedPrismaAddressFindUnique.mockResolvedValue(mockAddress);
            const context = { params: { id: 'addr-abc' } };

            const request = {} as NextRequest

            const response = await GET(request, context.params);
            const body = await response.json();

            expect(response.status).toBe(200);
            expect(body).toEqual(mockAddress);
            expect(mockedPrismaAddressFindUnique).toHaveBeenCalledWith({
                where: { id: 'addr-abc' }
            });
        });
        it('deve retornar 401 se o utilizador não estiver logado', async () => {
            mockedGetServerSession.mockResolvedValue(null);
            const context = { params: { id: 'addr-abc' } };

            const request = {} as NextRequest

            const response = await GET(request, context.params);

            expect(response.status).toBe(401);
        });
        it('deve retornar 403 quando usuário não admin tenta acessar endereço de outro usuário', async () => {
            const nonAdminSession = {
                ...mockSession,
                user: { ...mockSession.user, admin: false, id: 'user-123' }
            };

            mockedGetServerSession.mockResolvedValue(nonAdminSession);
            mockedPrismaAddressFindUnique.mockResolvedValue(mockOtherUserAddress);

            const context = { params: { id: 'addr-xyz' } };
            const request = {} as NextRequest

            const response = await GET(request, context.params);

            expect(response.status).toBe(403);
        });
        it('deve retornar 404 quando endereço não encontrado', async () => {
            mockedGetServerSession.mockResolvedValue(mockSession);
            mockedPrismaAddressFindUnique.mockResolvedValue(null);

            const context = { params: { id: 'addr-inexistente' } };
            const request = {} as NextRequest

            const response = await GET(request, context.params);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT', () => {
        it('deve atualizar o endereço com sucesso', async () => {
            mockedGetServerSession.mockResolvedValue(mockSession);
            mockedPrismaAddressFindUnique.mockResolvedValue(mockAddress);
            mockedPrismaAddressUpdate.mockResolvedValue({ ...mockAddress, number: '999' });
            const updateData = { number: '999' };
            const request = new NextRequest('http://localhost/api/addresses/addr-1',
                {
                    method: 'PUT',
                    body: JSON.stringify(updateData)
                });
            const context = { params: { id: 'addr-abc' } };

            const response = await PUT(request, context.params);

            expect(response.status).toBe(200);
            expect(mockedPrismaAddressUpdate).toHaveBeenCalledWith({
                where: { id: 'addr-abc' },
                data: updateData
            });
        });
        it('deve retornar 401 se o utilizador não estiver logado', async () => {
            mockedGetServerSession.mockResolvedValue(null);
            const request = new NextRequest('http://localhost/api/addresses/addr-abc', { method: 'PUT', body: '{}' });
            const context = { params: { id: 'addr-abc' } };
            const response = await PUT(request, context.params);
            expect(response.status).toBe(401);
        });
        it('deve retornar 403 se o endereço pertencer a outro utilizador', async () => {
            mockedGetServerSession.mockResolvedValue(mockSession);
            mockedPrismaAddressFindUnique.mockResolvedValue(mockOtherUserAddress); // Endereço de outro user
            const request = new NextRequest('http://localhost/api/addresses/addr-xyz', { method: 'PUT', body: '{}' });
            const context = { params: { id: 'addr-xyz' } };

            const response = await PUT(request, context.params);

            expect(response.status).toBe(403);
        });
        it('deve retornar 404 se o endereço não for encontrado', async () => {
            mockedGetServerSession.mockResolvedValue(mockSession);
            mockedPrismaAddressFindUnique.mockResolvedValue(null);
            const request = new NextRequest('http://localhost/api/addresses/non-existent-id', { method: 'PUT', body: '{}' });
            const context = { params: { id: 'non-existent-id' } };

            const response = await PUT(request, context.params);

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE', () => {
        it('deve apagar o endereço com sucesso', async () => {
            mockedGetServerSession.mockResolvedValue(mockSession);
            mockedPrismaAddressFindUnique.mockResolvedValue(mockAddress);

            const context = { params: { id: 'addr-1' } };
            const request = {} as NextRequest

            const response = await DELETE(request, context);
            const body = await response.json();

            expect(response.status).toBe(200);
            expect(body.message).toEqual('Endereço apagado com sucesso');
            expect(mockedPrismaAddressDelete).toHaveBeenCalledWith({ where: { id: 'addr-1' } });
        });
        it('deve retornar 401 se o utilizador não estiver logado', async () => {
            mockedGetServerSession.mockResolvedValue(null);
            const context = { params: { id: 'addr-abc' } };
            const request = {} as NextRequest

            const response = await DELETE(request, context);
            expect(response.status).toBe(401);
        });
        it('deve retornar 403 se o endereço pertencer a outro utilizador', async () => {
            mockedGetServerSession.mockResolvedValue(mockSession);
            mockedPrismaAddressFindUnique.mockResolvedValue(mockOtherUserAddress);
            const context = { params: { id: 'addr-xyz' } };

            const request = {} as NextRequest

            const response = await DELETE(request, context);

            expect(response.status).toBe(403);
        });
        it('deve retornar 404 se o endereço não for encontrado', async () => {
            mockedGetServerSession.mockResolvedValue(mockSession);
            mockedPrismaAddressFindUnique.mockResolvedValue(null);
            const context = { params: { id: 'non-existent-id' } };

            const request = {} as NextRequest

            const response = await DELETE(request, context);

            expect(response.status).toBe(404);
        });
    });
});