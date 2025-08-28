
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs';
import { loginSchema } from './schemas/loginUserValidation';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                try {
                    const { email, password } = await loginSchema.parseAsync(credentials);

                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user || !user.password) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        admin: user.admin,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],

    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.admin = user.admin;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.admin = token.admin
            }
            return session;
        },
    }
};