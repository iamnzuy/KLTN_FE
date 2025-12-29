import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
      roleId?: string | null;
      roleName?: string | null;
      status: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    roleId?: string | null;
    roleName?: string | null;
    status: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    roleId?: string | null;
    roleName?: string | null;
    status: string;
  }
}
