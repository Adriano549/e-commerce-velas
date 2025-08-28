import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function verifyAdminSession() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.admin) {
        return { authorized: false, message: 'Não autorizado', status: 403 };
    }

    return { authorized: true, session };
}

export async function verifyUserSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { authenticated: false, userId: null };
    }
    return { authenticated: true, userId: session.user.id };
}