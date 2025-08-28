// src/components/shared/PaginationControls.tsx
'use client';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}

export default function PaginationControls({
    currentPage,
    totalPages,
    basePath,
}: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleNavigation = (direction: 'prev' | 'next') => {
        const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(newPage));
        router.push(`${basePath}?${params.toString()}`);
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => handleNavigation('prev')}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="p-2 text-sm">
                        Página {currentPage} de {totalPages}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        onClick={() => handleNavigation('next')}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}