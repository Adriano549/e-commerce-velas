import { NextResponse } from "next/server";

export function errorHandler(error: unknown, context: string = "UNKNOWN_CONTEXT") {
    console.error(`[ERROR_HANDLER] Erro capturado em: ${context}`);

    if (error instanceof Error) {
        console.error(`- Nome do Erro: ${error.name}`);
        console.error(`- Mensagem: ${error.message}`);
        console.error(`- Stack Trace: ${error.stack}`);
    } else {
        console.error(`- Erro não padrão capturado:`, error);
    }

    return NextResponse.json(
        { message: "Ocorreu um erro inesperado no servidor." },
        { status: 500 }
    );
}