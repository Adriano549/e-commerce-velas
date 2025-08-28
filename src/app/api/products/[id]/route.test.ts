import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { GET, PUT, DELETE } from './route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession, Session } from 'next-auth';

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        product: {
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

const mockedPrismaProductFindUnique = prisma.product.findUnique as jest.MockedFunction<typeof prisma.product.findUnique>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockedPrismaProductUpdate = prisma.product.update as jest.MockedFunction<typeof prisma.product.update>;
const mockedPrismaProductDelete = prisma.product.delete as jest.MockedFunction<typeof prisma.product.delete>;

describe('GET /api/products/[id]', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar os dados do produto e status 200 se o produto for encontrado', async () => {
        const mockProduct = {
            id: '1',
            name: 'Produto A',
            description: 'Descrição do Produto A',
            price: new Prisma.Decimal(10.0),
            image: 'https://example.com/image-a.jpg',
            stock: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        mockedPrismaProductFindUnique.mockResolvedValue(mockProduct);
        const expectProduct = {
            id: '1',
            name: 'Produto A',
            description: 'Descrição do Produto A',
            price: "10",
            image: 'https://example.com/image-a.jpg',
            stock: 100,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        }
        const params = { params: { id: 'valid-id-123' } };
        const request = {} as NextRequest
        const response = await GET(request, params);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual(expectProduct);
        expect(mockedPrismaProductFindUnique).toHaveBeenCalledWith({ where: { id: 'valid-id-123' } });
    });

    it('deve retornar um erro 404 se o produto não for encontrado', async () => {
        mockedPrismaProductFindUnique.mockResolvedValue(null);
        const params = { params: { id: 'invalid-id' } };
        const request = {} as NextRequest

        const response = await GET(request, params);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.message).toEqual('Produto não encontrado');
    });

    it('deve retornar um erro 500 se ocorrer um problema no banco de dados', async () => {
        mockedPrismaProductFindUnique.mockRejectedValue(new Error('Erro no banco'));
        const params = { params: { id: 'any-id' } };
        const request = {} as NextRequest

        const response = await GET(request, params);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.message).toEqual('Ocorreu um erro inesperado no servidor.');
    });
});

describe('PUT /api/products/[id]', () => {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    const adminSession: Session = {
        user: {
            id: 'admin-user-id',
            name: 'Admin User',
            email: 'admin@test.com',
            admin: true,
        },
        expires: '2025-10-10T00:00:00.000Z',
    };
    const mockProduct = {
        id: 'prod-123',
        name: 'Vela Original',
        description: 'Uma descrição original.',
        price: new Prisma.Decimal(50.0), // Use new Prisma.Decimal para o tipo correto
        image: 'https://example.com/original.jpg',
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const updateData = { name: 'Vela Atualizada', stock: 99 };

    it('deve atualizar um produto com sucesso se o usuário for admin', async () => {
        // ARRANGE
        mockedGetServerSession.mockResolvedValue(adminSession);
        mockedPrismaProductFindUnique.mockResolvedValue(mockProduct);
        mockedPrismaProductUpdate.mockResolvedValue({ ...mockProduct, ...updateData });
        const request = new NextRequest('http://localhost/api/products/prod-123', {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
        const params = { params: { id: 'prod-123' } };

        // ACT
        const response = await PUT(request, params);
        const body = await response.json();

        // ASSERT
        expect(response.status).toBe(200);
        expect(body.name).toEqual('Vela Atualizada');
        expect(body.stock).toEqual(99);
        expect(mockedPrismaProductUpdate).toHaveBeenCalledWith({
            where: { id: 'prod-123' },
            data: updateData,
        });
    });

    it('deve retornar 403 se o usuário não for admin', async () => {
        // ARRANGE
        mockedGetServerSession.mockResolvedValue({
            user: {
                id: 'admin-user-id',
                name: 'Admin User',
                email: 'admin@test.com',
                admin: false,
            },
            expires: '2025-10-10T00:00:00.000Z',
        });
        const request = new NextRequest('http://localhost/api/products/prod-123', {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
        const params = { params: { id: 'prod-123' } };

        // ACT
        const response = await PUT(request, params);

        expect(response.status).toBe(403);
    });

    it('deve retornar 404 se o produto não existir', async () => {
        mockedGetServerSession.mockResolvedValue(adminSession);
        mockedPrismaProductFindUnique.mockResolvedValue(null); // Produto não encontrado
        const request = new NextRequest('http://localhost/api/products/id-nao-existe', {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
        const params = { params: { id: 'id-nao-existe' } };

        const response = await PUT(request, params);

        expect(response.status).toBe(404);
    });

    it('deve retornar 400 se os dados de atualização forem inválidos', async () => {
        // ARRANGE
        mockedGetServerSession.mockResolvedValue(adminSession);
        mockedPrismaProductFindUnique.mockResolvedValue(mockProduct);
        const invalidData = {
            name: 'V',
            description: 'Curto',
            price: -50.0,
            image: 'nao-e-uma-url',
            stock: 10.5,
        };
        const request = new NextRequest('http://localhost/api/products/prod-123', {
            method: 'PUT',
            body: JSON.stringify(invalidData),
        });
        const params = { params: { id: 'prod-123' } };

        const response = await PUT(request, params);
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody.errors.name).toEqual(
            'O nome deve ter no mínimo 3 caracteres.'
        );
        expect(responseBody.errors.price).toEqual(
            'Preço deve ser um número positivo.'
        );
        expect(responseBody.errors.image).toEqual(
            'URL da imagem deve ser válida.'
        );
        expect(responseBody.errors.stock).toEqual(
            'O estoque deve ser um número inteiro.'
        );
        expect(responseBody.errors.description).toEqual(
            'Descrição é obrigatória.'
        );
    });
});

describe('DELETE /api/products/[id]', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve excluir um produto com sucesso se o usuário for admin', async () => {
        mockedGetServerSession.mockResolvedValue({
            user: { id: 'admin-user-id', name: 'Admin User', email: 'admin@test.com', admin: true },
            expires: '2025-10-10T00:00:00.000Z',
        });

        const mockProduct = {
            id: 'prod-to-delete-123',
            name: 'Produto A',
            description: 'Descrição do Produto A',
            price: new Prisma.Decimal(10.0),
            image: 'https://example.com/image-a.jpg',
            stock: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockedPrismaProductFindUnique.mockResolvedValue(mockProduct);
        mockedPrismaProductDelete.mockResolvedValue(mockProduct);

        const context = {
            params: Promise.resolve({ id: 'prod-to-delete-123' })
        };

        const mockRequest = new NextRequest('http://localhost/api/products/prod-to-delete-123', {
            method: 'DELETE'
        });

        const response = await DELETE(mockRequest, context);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({ message: 'Produto deletado com sucesso' });
        expect(mockedPrismaProductFindUnique).toHaveBeenCalledWith({ where: { id: 'prod-to-delete-123' } });
        expect(mockedPrismaProductDelete).toHaveBeenCalledTimes(1);
        expect(mockedPrismaProductDelete).toHaveBeenCalledWith({ where: { id: 'prod-to-delete-123' } });
    });

    it('deve retornar 403 se o usuário não for admin', async () => {
        mockedGetServerSession.mockResolvedValue({
            user: {
                id: 'user-123',
                name: 'Regular User',
                email: 'user@test.com',
                admin: false,
            },
            expires: '2025-10-10T00:00:00.000Z',
        });

        const context = {
            params: Promise.resolve({ id: 'prod-to-delete-123' })
        };

        const mockRequest = new NextRequest('http://localhost/api/products/prod-to-delete-123', {
            method: 'DELETE'
        });

        const response = await DELETE(mockRequest, context);
        const body = await response.json();

        expect(response.status).toBe(403);
        expect(body).toEqual({ message: "Não autorizado" });
        expect(mockedPrismaProductDelete).not.toHaveBeenCalled();
    });

    it('deve retornar 404 se o produto não for encontrado', async () => {
        mockedGetServerSession.mockResolvedValue({
            user: { id: 'admin-user-id', name: 'Admin User', email: 'admin@test.com', admin: true },
            expires: '2025-10-10T00:00:00.000Z',
        });

        mockedPrismaProductFindUnique.mockResolvedValue(null);

        const context = {
            params: Promise.resolve({ id: 'non-existent-id' })
        };

        const mockRequest = new NextRequest('http://localhost/api/products/non-existent-id', {
            method: 'DELETE'
        });

        const response = await DELETE(mockRequest, context);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body).toEqual({ message: 'Produto não encontrado' });
        expect(mockedPrismaProductDelete).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se o usuário não estiver logado', async () => {
        mockedGetServerSession.mockResolvedValue(null);

        const context = {
            params: Promise.resolve({ id: 'prod-to-delete-123' })
        };

        const mockRequest = new NextRequest('http://localhost/api/products/prod-to-delete-123', {
            method: 'DELETE'
        });

        const response = await DELETE(mockRequest, context);
        const body = await response.json();

        expect(response.status).toBe(403);
        expect(body).toEqual({ message: "Não autorizado" });
        expect(mockedPrismaProductDelete).not.toHaveBeenCalled();
    });
});