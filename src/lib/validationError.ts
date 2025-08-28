import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleZodValidationError(error: ZodError) {
    const errors = error.issues.reduce((acc, issue) => {
        const field = issue.path.join('.');
        acc[field] = issue.message;
        return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ errors }, { status: 400 });
}