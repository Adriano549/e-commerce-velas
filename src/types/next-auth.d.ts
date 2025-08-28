import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        admin: boolean;
    }
}

declare module 'next-auth' {
    interface User extends DefaultUser {
        admin: boolean;
    }

    interface Session {
        user: {
            id: string;
            admin: boolean;
        } & DefaultSession['user'];
    }
}