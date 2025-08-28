import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-muted text-muted-foreground">
            <div className="container mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-foreground">VelasAroma</h3>
                    <p className="text-sm">
                        Feito à mão para iluminar seus melhores momentos.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-foreground">Navegação</h3>
                    <Link href="/" className="text-sm hover:text-primary">Home</Link>
                    <Link href="/shop" className="text-sm hover:text-primary">Velas</Link>
                    <Link href="/sobre" className="text-sm hover:text-primary">Sobre o Projeto</Link>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-foreground">Conecte-se Comigo</h3>
                    <div className="flex items-center gap-4">
                        <a href="https://github.com/Adriano549" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 fill-current text-muted-foreground hover:text-primary"
                            >
                                <title>GitHub</title>
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z" />
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/adriano-almeida-510a0a309/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 fill-current text-muted-foreground hover:text-primary"
                            >
                                <title>LinkedIn</title>
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t">
                <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <p className="text-sm">
                        © {new Date().getFullYear()} VelasAroma. Todos os direitos reservados.
                    </p>
                    <p className="text-xs text-muted-foreground text-center sm:text-right">
                        Todas as imagens e vídeos foram gerados por IA via Canva.
                    </p>
                    <p className="text-xs">
                        Um Projeto de Portfólio.
                    </p>
                </div>
            </div>
        </footer>
    );
}