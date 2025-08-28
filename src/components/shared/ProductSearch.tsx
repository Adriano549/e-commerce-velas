'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSearch = searchParams.get('q') || '';

    const [query, setQuery] = useState(currentSearch);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (query !== currentSearch) {
                if (query) {
                    router.push(`/shop?q=${query}`);
                } else {
                    router.push('/shop');
                }
            }
        }, 500);

        return () => clearTimeout(debounceTimer);

    }, [query, currentSearch, router]);

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