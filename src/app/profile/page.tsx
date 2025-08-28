import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
import { getAddressesByUserId } from "@/services/addressService";
import AddressManager from "@/components/shared/AddressManager";
import { getOrdersByUser } from "@/services/orderService";
import OrderList from "@/components/profile/OrderList";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/login?callbackUrl=/profile');
    }

    if (session.user.admin) {
        redirect('/dashboard/');
    }
    const [initialAddresses, orders] = await Promise.all([
        getAddressesByUserId(session.user.id),
        getOrdersByUser(),
    ]);

    return (
        <main className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Minha Conta</h1>

                <div className="space-y-4">
                    <div className="p-4 border rounded-md bg-muted/50">
                        <p className="text-sm text-muted-foreground">Nome</p>
                        <p className="text-lg font-medium">{session.user.name || 'Não informado'}</p>
                    </div>
                    <div className="p-4 border rounded-md bg-muted/50">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-lg font-medium">{session.user.email}</p>
                    </div>
                    {session.user.admin && (
                        <div className="p-4 border rounded-md bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                            <p className="text-lg font-medium">Você é um Administrador.</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 space-y-4">
                    <div className="mt-12 border-t pt-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4">Meus Pedidos</h2>
                        <OrderList orders={orders} />
                    </div>
                    <div className="mt-12 border-t pt-8">
                        <h2 className="text-2xl font-bold tracking-tight mb-4">Meus Endereços</h2>
                        <AddressManager initialAddresses={initialAddresses} />
                    </div>
                </div>

            </div>
        </main>
    );
}