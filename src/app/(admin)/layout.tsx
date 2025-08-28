import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/dashboard/products');
    }

    if (!session.user.admin) {
        return (
            <div className="container mx-auto py-10">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertDescription>
                        Acesso Negado. Você não tem permissão para aceder a esta página.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return <>{children}</>;
}