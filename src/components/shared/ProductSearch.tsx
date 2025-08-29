'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductSearchProps {
    basePath?: string;
}

export default function ProductSearch({ basePath }: ProductSearchProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentSearch = searchParams.get('q') || '';

    const [query, setQuery] = useState(currentSearch);

    const targetPath = basePath || pathname;

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (query !== currentSearch) {
                const params = new URLSearchParams(searchParams.toString());
                if (query) {
                    params.set('q', query);
                } else {
                    params.delete('q');
                }
                params.delete('page');

                router.push(`${targetPath}?${params.toString()}`);
            }
        }, 500);

        return () => clearTimeout(debounceTimer);

    }, [query, currentSearch, router, searchParams, targetPath]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Buscar por nome ou aroma..."
                className="w-full rounded-full pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
}