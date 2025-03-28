import NextAuth, { NextAuthConfig } from "next-auth";
import bcrypt from "bcrypt";
import "next-auth/jwt";
import { redirect } from "next/navigation";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { Role, UserStatus } from "@prisma/client";


export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "ALUMNI",
          status: "PENDING",
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          emailVerified: null,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
      allowDangerousEmailAccountLinking: true,
      async profile(profile, tokens) {
        // Profile id
        const { id } = profile
        // Access token
        const { accessToken } = tokens
        // Graph API URL to return a large picture
        const url = `https://graph.facebook.com/v22.0/${id}/picture?type=large&access_token=${accessToken || tokens.access_token}`
        // GET req via fetch
        const response = await fetch(url);
        // Get the final URL after redirects
        const imageUrl = response.url;
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: imageUrl,
          role: "ALUMNI",
          status: "PENDING",
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          emailVerified: null,
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          return null;
        }

        // const isPasswordValid = credentials.password as string === user.password;
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          emailVerified: user.emailVerified,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.role = token.role as Role;
        session.user.image = token.image as string;
        session.user.status = token.status as UserStatus;
        session.user.accountId = token.accountId;
        session.user.provider = token.provider;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        // Allow login even if email is missing
        const existingUser = await db.user.findFirst({
          where: { 
            OR: [
              { email: user.email || "" },
              { 
                accounts: {
                  some: {
                    provider: account.provider,
                    providerAccountId: account.providerAccountId
                  }
                }
              }
            ]
          },
        });
    
        if (!existingUser) {
          // Create new user
          const newUser = await db.user.create({
            data: {
              email: user.email || null,
              name: user.name || `User-${Date.now().toString().slice(-6)}`,
              image: user.image ?? profile?.picture,
              role: "ALUMNI",
              status: "PENDING",
              password: "", // Empty password for social login
              emailVerified: new Date(), // Mark as verified since it's from OAuth
              accounts: {
                create: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type,
                }
              }
            },
          });
    
          // Create notification for new user
          await db.notification.create({
            data: {
              userId: newUser.id,
              title: "Welcome to KHS Alumni",
              message: "Please complete your profile to get started.",
              type: "SYSTEM",
            },
          });
    
          // Update the user object with the new data
          user.id = newUser.id;
          user.role = newUser.role;
        } else {
          // Update the user object with existing data
          user.id = existingUser.id;
          user.role = existingUser.role;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      const socialUser = {
          OR: [
            { email: user?.email },
            {
              accounts: {
                some: {
                  provider: account?.provider,
                  providerAccountId: account?.providerAccountId
                }
              }
            }
          ]
        };
      const dbUser = await db.user.findFirst({
        where: account?.provider === 'google' || account?.provider === 'facebook' ? socialUser : {
          email: token.email,
        },
        include: {
          profile: true,
          accounts: true,
          memberships: {
            where: {
              status: 'ACTIVE'
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id as string;
          token.role = user.role as Role;
          token.status = user.status as UserStatus;
        }
        return token;
      }

      token.id = dbUser.id;
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.role = dbUser.role;
      token.image = dbUser.image;
      token.status = dbUser.status;
      token.profile = dbUser.profile ? {
        occupation: dbUser.profile.occupation,
      } : undefined;
      token.membershipStatus = dbUser.memberships[0]?.status || 'PENDING';
      token.provider = dbUser.accounts[0]?.provider;
      token.accountId = dbUser.accounts[0]?.providerAccountId;

      return token;
    },
  },
  debug: process.env.NODE_ENV !== 'production',
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authOptions,
});

export async function getCurrentUser() {
  const session = await auth()
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  return user;
}

export function isAdmin(role?: string) {
  return role === "ADMIN";
}

export function isAlumni(role?: string) {
  return role === "ALUMNI";
}