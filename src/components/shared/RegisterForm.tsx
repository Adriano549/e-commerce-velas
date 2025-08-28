'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Se a API retornou um erro (status 4xx ou 5xx)
                // Lemos os erros de validação do Zod que o back-end nos enviou
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).join(' \n');
                    setError(errorMessages);
                } else {
                    // Para outros erros da API
                    setError(data.message || 'Ocorreu um erro ao criar a conta.');
                }
                setIsLoading(false);
                return; // Interrompe a execução aqui
            }

            // Se a resposta for OK (status 2xx)
            setSuccess('Conta criada com sucesso! Será redirecionado para a página de login em 3 segundos...');
            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (error) {
            // Este catch agora pega principalmente erros de rede (ex: servidor offline)
            setIsLoading(false);
            setError('Falha na comunicação com o servidor. Tente novamente.');
            console.error("Erro inesperado no handleSubmit:", error);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>Crie uma nova conta para começar a comprar.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* O seu JSX para o formulário continua exatamente o mesmo aqui */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert variant="default" className="bg-green-100 dark:bg-green-900">
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'A criar...' : 'Criar Conta'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}