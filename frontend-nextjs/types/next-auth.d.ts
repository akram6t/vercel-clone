import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            userId: string
            avatar: string
            githubId: string
            githubUsername: string
            accessToken: string
        } & DefaultSession["user"]
    }

    interface Profile extends DefaultUser {
        userId: string
        avatar_url?: string
        githubId: string
        login?: string
        accessToken?: string
    }

    interface User extends DefaultUser {
        userId: string
        avatar: string
        githubId: string
        githubUsername: string
        accessToken: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string
        avatar: string
        githubId: string
        githubUsername: string
        accessToken: string
    }
}
