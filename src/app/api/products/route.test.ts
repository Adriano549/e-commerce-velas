import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { POST, GET } from './route';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Session } from 'next-auth';
import { Prisma } from '@prisma/client';


jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        product: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
        },
    },
}));

const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockedPrismaProductCreate = prisma.product.create as jest.MockedFunction<typeof prisma.product.create>;
const mockedPrismaProductFindMany = prisma.product.findMany as jest.MockedFunction<typeof prisma.product.findMany>;
const mockedPrismaProductCount = prisma.product.count as jest.MockedFunction<typeof prisma.product.count>;

describe('GET /api/products', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar uma lista de produtos ordenados por nome', async () => {

        const mockProducts = [
            {
                id: '1',
                name: 'Produto A',
                description: 'Descrição do Produto A',
                price: new Prisma.Decimal(10.0),
                image: 'https://example.com/image-a.jpg',
                stock: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]
        mockedPrismaProductFindMany.mockResolvedValue(mockProducts);
        mockedPrismaProductCount.mockResolvedValue(mockProducts.length);

        const expectedBody = [
            {
                id: '1',
                name: 'Produto A',
                description: 'Descrição do Produto A',
                price: "10",
                image: 'https://example.com/image-a.jpg',
                stock: 100,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            },
        ]
        const request = new NextRequest('http://localhost/api/products');

        const response = await GET(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.products).toEqual(expectedBody);
        expect(mockedPrismaProductFindMany).toHaveBeenCalledWith({
            skip: 0,
            take: 10,
            orderBy: { name: 'asc' },
            where: {}
        });
    });
    it('deve retornar um erro 500 se ocorrer um problema no banco de dados', async () => {
        mockedPrismaProductFindMany.mockRejectedValue(new Error('Erro de conexão com o banco de dados'));
        const request = new NextRequest('http://localhost/api/products');
        const response = await GET(request);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
            message: 'Ocorreu um erro inesperado no servidor.'
        });
    });
});

describe('POST /api/products', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar um produto com sucesso se o usuário for um administrador', async () => {
        const mockSession: Session = {
            user: {
                id: 'admin-user-id',
                name: 'Admin User',
                email: 'admin@test.com',
                admin: true,
            },
            expires: '2025-10-10T00:00:00.000Z',
        };

        mockedGetServerSession.mockResolvedValue(mockSession);

        const productData = {
            name: 'Vela de Teste',
            description: 'Uma descrição de teste para a vela.',
            price: 50.0,
            image: 'https://example.com/image.jpg',
            stock: 100,
        };

        const request = new NextRequest('http://localhost/api/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });

        mockedPrismaProductCreate.mockResolvedValue({
            id: 'new-product-id',
            name: productData.name,
            description: productData.description,
            price: new Prisma.Decimal(productData.price),
            image: productData.image,
            stock: productData.stock,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(201);
        expect(responseBody.name).toBe(productData.name);
        expect(mockedPrismaProductCreate).toHaveBeenCalledTimes(1);
        expect(mockedPrismaProductCreate).toHaveBeenCalledWith({ data: productData });
    });

    it('deve retornar 403 Forbidden se o usuário não for um administrador', async () => {

        mockedGetServerSession.mockResolvedValue({
            user: { id: 'user-id', name: 'Common User', email: 'user@test.com', admin: false },
            expires: '2025-10-10T00:00:00.000Z',
        });

        const request = new NextRequest('http://localhost/api/products', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
        });
        Object.defineProperty(request, 'json', {
            value: async () => ({}),
        });
        const response = await POST(request);

        expect(response.status).toBe(403);
    });
    it('deve retornar 400 Bad Request se os dados do produto forem inválidos', async () => {

        mockedGetServerSession.mockResolvedValue({
            user: { id: 'admin-user-id', name: 'Admin User', email: 'admin@test.com', admin: true },
        });

        const invalidProductData = {
            name: 'V',
            description: 'Curto',
            price: -50.0,
            image: 'nao-e-uma-url',
            stock: 10.5,
        };
        const request = new NextRequest('http://localhost/api/products', {
            method: 'POST',
            body: JSON.stringify(invalidProductData),
        });

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody.errors).toBeDefined();

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
        expect(mockedPrismaProductCreate).not.toHaveBeenCalled();
    });
    it('deve retornar 400 Bad Request se um campo obrigatório estiver faltando', async () => {

        mockedGetServerSession.mockResolvedValue({
            user: { id: 'admin-user-id', name: 'Admin User', email: 'admin@test.com', admin: true },
        });

        const incompleteProductData = {
            description: 'Esta vela não tem preço, o que é um erro.',
        };

        const request = new NextRequest('http://localhost/api/products', {
            method: 'POST',
            body: JSON.stringify(incompleteProductData),
        });

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody.errors).toBeDefined();


        expect(mockedPrismaProductCreate).not.toHaveBeenCalled();
    });
});
