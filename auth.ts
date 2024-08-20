import NextAuth, {type DefaultSession} from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "@/auth.config"
import {db} from "@/lib/db"
import { getUserById } from "@/data/user"
import {JWT} from "next-auth/jwt"


declare module "next-auth" {
    interface Session {
        user: {
            role: 'landlord' | "tenant"
        } & DefaultSession ["user"]
    }
}


declare module "next-auth/jwt" {
    interface JWT {
        role?: "landlord" | "tenant";
    }
}

export const { 
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth ({
    pages: {
        signIn: "/sign-in",
        error: "/error"
    },
    events: {
        async linkAccount ({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") return true;
        
            if (user.id === undefined) return false;
        
            const existingUser = await getUserById(user.id);
        
            if(!existingUser?.emailVerified) return false;
            
            return true;
        },
        async session ({ token, session }){
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role;
            }

            return session
        },
        async jwt ({ token }){
            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

            token.role = existingUser.role;
            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: {strategy: "jwt"},
  ...authConfig,
})