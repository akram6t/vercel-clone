import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import prisma from "@/lib/prisma";


export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      name: 'github',
      clientId: process.env.NEXTAUTH_GITHUB_ID!,
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET!,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.githubId = account?.providerAccountId!;
        token.githubUsername = profile?.login!;
        token.accessToken = account?.access_token!;
        token.avatar = profile?.avatar_url!
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.githubId = token.githubId;
        session.user.githubUsername = token.githubUsername;
        session.user.accessToken = token.accessToken;
        session.user.avatar = token.avatar;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log('user', user);
      console.log('account', account);
      console.log('profile', profile);
      if (!account || account.provider !== 'github') {
        return false;
      }
      // check existing user
      const existingUser = await prisma.user.findFirst({
        where: {
          githubId: account.providerAccountId
        }
      });

      // if user not exist then create new user
      if (!existingUser) {
        const createUser = await prisma.user.create({
          data: {
            name: profile?.name!,
            email: profile?.email!,
            avatar: profile?.avatar_url,
            githubId: account.providerAccountId,
            githubUsername: profile?.login!,
            accessToken: account.access_token!,
          }
        });
        if (createUser) {
          return true;
        }
      }
      else {
        // if user exist then update user
        const updateUser = await prisma.user.update({
          where: {
            id: existingUser.id
          },
          data: {
            name: profile?.name!,
            email: profile?.email!,
            avatar: profile?.avatar_url,
            githubUsername: profile?.login!,
            accessToken: account.access_token!,
          }
        });

        return true;
      }

      return false;
    }
  },

  session: {
    strategy: 'jwt',
  },

  pages: {
    'signIn': '/login',
  },
}

export default NextAuth(authOptions)