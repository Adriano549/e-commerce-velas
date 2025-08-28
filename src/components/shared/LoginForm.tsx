'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/profile';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Email ou senha inválidos.');
                console.error('Falha no login:', result.error);
            } else if (result?.ok) {
                router.push(callbackUrl);
            }
        } catch {
            setError('Ocorreu um erro ao tentar fazer login.');
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Acesse sua conta para continuar.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                    <Button type="submit" className="w-full">
                        Entrar
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <Button variant="outline"
                        className="w-full"
                        onClick={() => signIn('github', { callbackUrl: '/profile' })}>
                        Entrar com GitHub
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Não tem uma conta?{" "}
                    <Link href="/register" className="underline">
                        Crie uma aqui
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}