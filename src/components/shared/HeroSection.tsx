import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {

    return (
        <section className="relative h-[60vh] w-full">
            <video
                src="/slide_3.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Acenda Momentos, Crie Memórias.
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-neutral-200">
                    Descubra nossa coleção exclusiva de velas aromáticas feitas à mão, perfeitas para transformar qualquer ambiente.
                </p>
                <Button asChild size="lg" className="mt-8">
                    <Link href="/shop">Conheça nossa coleção</Link>
                </Button>
            </div>
        </section>
    );
}