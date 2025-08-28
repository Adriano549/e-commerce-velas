'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogIn, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useCartStore } from '@/store/cartStore';

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const cartItems = useCartStore((state) => state.items);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Velas' },
        { href: '/sobre', label: 'Sobre o Projeto' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                    VelasAroma
                </Link>

                <div className="hidden items-center space-x-6 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" className="relative">
                        <Link href="/cart"><ShoppingCart className="h-5 w-5" /></Link>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                {totalItems}
                            </span>
                        )}
                    </Button>

                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/profile"><User className="h-5 w-5" /></Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => signOut()}>
                                <LogOut className="h-5 w-5 hidden md:flex" />
                            </Button>
                        </>
                    ) : (
                        <Button variant="ghost" asChild>
                            <Link href="/login" className="flex items-center gap-2">
                                <LogIn className="h-5 w-5" />
                                <span className="hidden md:inline">Login</span>
                            </Link>
                        </Button>
                    )}

                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="flex flex-col space-y-4 p-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <Button variant="ghost" onClick={() => { signOut(); setIsMenuOpen(false); }} className="justify-start p-0 h-auto font-medium text-muted-foreground">
                                Sair
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}