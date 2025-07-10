import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const handler = async (req, res) => {
  const client = await clientPromise;

  return await NextAuth(req, res, {
    adapter: MongoDBAdapter(clientPromise, {
      databaseName: "habitTracker", // ✅ Explicitly set DB name
    }),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            scope: "openid email profile",
          },
        },
      }),
    ],

    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // ✅ Will help capture detailed logs if error continues

    callbacks: {
      async signIn({ account, profile }) {
        console.log("SIGN-IN ACCOUNT:", account);
        console.log("SIGN-IN PROFILE:", profile);
        return true;
      },
      async jwt({ token }) {
        console.log("JWT CALLBACK:", token);
        return token;
      },
      async session({ session, token }) {
        console.log("SESSION CALLBACK:", session);
        return session;
      },
    },
  });
};

export { handler as GET, handler as POST };



