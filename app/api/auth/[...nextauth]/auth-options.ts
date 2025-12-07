import { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { randomUUID } from 'crypto';

const demoUserProfile = {
  id: process.env.DEMO_USER_ID || randomUUID(),
  email: process.env.DEMO_USER_EMAIL || 'demo@example.com',
  password: process.env.DEMO_USER_PASSWORD || 'demo123',
  name: process.env.DEMO_USER_NAME || 'Demo User',
  avatar: process.env.DEMO_USER_AVATAR || null,
  status: 'ACTIVE',
};

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember me', type: 'boolean' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(
            JSON.stringify({
              code: 400,
              message: 'Please enter both email and password.',
            }),
          );
        }

        if (
          credentials.email !== demoUserProfile.email ||
          credentials.password !== demoUserProfile.password
        ) {
          throw new Error(
            JSON.stringify({
              code: 401,
              message: 'Invalid credentials.',
            }),
          );
        }

        return {
          id: demoUserProfile.id,
          email: demoUserProfile.email,
          name: demoUserProfile.name,
          status: demoUserProfile.status,
          avatar: demoUserProfile.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({
      token,
      user,
      session,
      trigger,
    }: {
      token: JWT;
      user: User;
      session?: Session;
      trigger?: 'signIn' | 'signUp' | 'update';
    }) {
      if (trigger === 'update' && session?.user) {
        token = session.user;
      } else if (user) {
        token.id = (user.id || token.sub || demoUserProfile.id) as string;
        token.email = user.email;
        token.name = user.name;
        token.avatar = user.avatar;
        token.status = user.status;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.avatar = token.avatar;
        session.user.status = token.status;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

export default authOptions;
